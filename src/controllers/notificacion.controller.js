import sgMail from '@sendgrid/mail';
import Notification from '../models/notifications.js';


async function sendRentNotification(user, warehouse, rent) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: user.email,
    from: 'no-reply@rentabodega.com',
    subject: 'Confirmación de renta de bodega',
    text: `Hola ${user.first_name}, has rentado la bodega ${warehouse.name} exitosamente.\n\nDetalles:\n- Fecha de inicio: ${rent.start_date}\n- Fecha de fin: ${rent.end_date}\n- Precio total: $${rent.total_price}\n\nGracias por tu preferencia.`,
    html: `<strong>Hola ${user.first_name},</strong><p>Has rentado la bodega ${warehouse.name} exitosamente.</p><p><strong>Detalles:</strong></p><ul><li>Fecha de inicio: ${rent.start_date}</li><li>Fecha de fin: ${rent.end_date}</li><li>Precio total: $${rent.total_price}</li></ul><p>Gracias por tu preferencia.</p>`
  };
  
  try {
    await sgMail.send(msg);
    await Notification.create({
      notification_type: 'rent_confirmation',
      sent_date: new Date(),
      status: 'sent',
      user_id: user.user_id,
      warehouse_id: warehouse.warehouse_id
    });
  } catch (error) {
    console.error('Error al enviar notificación de renta:', error);
  }
}

async function sendEvictionNotification(user, warehouse) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: user.email,
    from: 'no-reply@rentabodega.com',
    subject: 'Notificación de desalojo de bodega',
    text: `Hola ${user.first_name}, tu renta de la bodega ${warehouse.name} ha finalizado.\n\nPor favor desocupa la bodega antes de la fecha acordada.\n\nGracias por tu preferencia.`,
    html: `<strong>Hola ${user.first_name},</strong><p>Tu renta de la bodega ${warehouse.name} ha finalizado.</p><p>Por favor desocupa la bodega antes de la fecha acordada.</p><p>Gracias por tu preferencia.</p>`
  };
  
  try {
    await sgMail.send(msg);
    await Notification.create({
      notification_type: 'eviction_notice',
      sent_date: new Date(),
      status: 'sent',
      user_id: user.user_id,
      warehouse_id: warehouse.warehouse_id
    });
  } catch (error) {
    console.error('Error al enviar notificación de desalojo:', error);
  }
}

async function sendLatePaymentNotification(user, warehouse, rent) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: user.email,
    from: 'no-reply@rentabodega.com',
    subject: 'Recordatorio de pago pendiente',
    text: `Hola ${user.first_name}, tienes un pago pendiente por la renta de la bodega ${warehouse.name}.\n\nPor favor realiza el pago lo antes posible para evitar cargos adicionales.\n\nDetalles:\n- Fecha límite: ${rent.payment_due_date}\n- Monto pendiente: $${rent.total_price}\n\nGracias por tu preferencia.`,
    html: `<strong>Hola ${user.first_name},</strong><p>Tienes un pago pendiente por la renta de la bodega ${warehouse.name}.</p><p>Por favor realiza el pago lo antes posible para evitar cargos adicionales.</p><p><strong>Detalles:</strong></p><ul><li>Fecha límite: ${rent.payment_due_date}</li><li>Monto pendiente: $${rent.total_price}</li></ul><p>Gracias por tu preferencia.</p>`
  };
  
  try {
    await sgMail.send(msg);
    await Notification.create({
      notification_type: 'late_payment',
      sent_date: new Date(),
      status: 'sent',
      user_id: user.user_id,
      warehouse_id: warehouse.warehouse_id
    });
  } catch (error) {
    console.error('Error al enviar notificación de pago atrasado:', error);
  }
}

export default {
  sendRentNotification,
  sendEvictionNotification,
  sendLatePaymentNotification
};