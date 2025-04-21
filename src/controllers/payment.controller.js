import Stripe from 'stripe';
import { Payment, Rent, Warehouse, User } from '../models/index.js';
import { sendLatePaymentNotification } from './notificacion.controller.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { rent_id, payment_method_id } = req.body;

    const rent = await Rent.findByPk(rent_id, {
      include: [
        { 
          model: Warehouse,
          where: { status: 'available' }
        },
        { model: User }
      ]
    });

    if (!rent) {
      return res.status(404).json({ message: 'Rent not found or warehouse not available' });
    }

    // Verificar si hay pagos atrasados
    if (rent.payment_status === 'overdue') {
      await sendLatePaymentNotification(rent.User, rent.Warehouse, rent);
    }

    // Create or retrieve Stripe customer
    let customerId = rent.User.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: rent.User.email,
        payment_method: payment_method_id,
        invoice_settings: {
          default_payment_method: payment_method_id,
        }
      });
      customerId = customer.id;
      await User.update(
        { stripe_customer_id: customerId },
        { where: { user_id: rent.User.user_id } }
      );
    }

    // Check if product exists for this warehouse or create it
    let product;
    try {
      product = await stripe.products.retrieve(`warehouse_${rent.Warehouse.warehouse_id}`);
    } catch {
      product = await stripe.products.create({
        id: `warehouse_${rent.Warehouse.warehouse_id}`,
        name: `Warehouse ${rent.Warehouse.code}`,
        description: `${rent.Warehouse.description || 'Warehouse rental'} - Size: ${rent.Warehouse.size}`,
        metadata: {
          warehouse_id: rent.Warehouse.warehouse_id,
          code: rent.Warehouse.code,
          size: rent.Warehouse.size
        }
      });
    }

    // Create or retrieve price for the product
    let price;
    try {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1
      });
      
      // Check if we actually got a price back
      if (prices.data && prices.data.length > 0) {
        price = prices.data[0];
      } else {
        // If no price exists, create one
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(rent.Warehouse.monthly_price * 100),
          currency: 'mxn',
          recurring: {
            interval: 'month'
          }
        });
      }
    } catch (error) {
      console.error('Price creation error:', error);
      // Always create a new price if there's an error
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(rent.Warehouse.monthly_price * 100),
        currency: 'mxn',
        recurring: {
          interval: 'month'
        }
      });
    }

    // Verify we have a price before creating subscription
    if (!price || !price.id) {
      throw new Error('Failed to create or retrieve price');
    }

// First, modify the subscription creation and response
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: price.id }],
  payment_settings: {
    payment_method_types: ['card'],
    save_default_payment_method: 'on_subscription'
  }
});

// Get the invoice and payment intent separately
const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);

let client_secret = null;

if (invoice.payment_intent) {
  const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);
  client_secret = paymentIntent.client_secret;
}

// Create payment record
const payment = await Payment.create({
  rent_id: rent_id,
  amount: rent.Warehouse.monthly_price,
  payment_date: new Date(),
  payment_method: 'stripe',
  status: 'pending',
  stripe_customer_id: customerId,
  stripe_subscription_id: subscription.id
});

// Update warehouse status to occupied
await Warehouse.update(
  { status: 'occupied' },
  { where: { warehouse_id: rent.Warehouse.warehouse_id } }
);

res.status(201).json({
  payment,
  subscription_id: subscription.id,
  client_secret: client_secret
});
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Then, modify the webhook handler to properly handle raw body
export const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    // Ensure we're using the raw body
    const event = stripe.webhooks.constructEvent(
      req.body, // Express raw body
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Rest of the webhook handler remains the same
    switch (event.type) {
      case 'invoice.paid':
        await Payment.update(
          { status: 'paid' },
          { 
            where: { 
              stripe_subscription_id: event.data.object.subscription 
            }
          }
        );
        break;

      case 'invoice.payment_failed':
        await Payment.update(
          { status: 'failed' },
          { 
            where: { 
              stripe_subscription_id: event.data.object.subscription 
            }
          }
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: error.message });
  }
};