import sgMail from '@sendgrid/mail';
import { Rent, User, Warehouse, Notification } from "../models/index.js";

export const getRents = async (req, res) => {
  try {
    const rents = await Rent.findAll({
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Warehouse }
      ]
    });
    res.json(rents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRentById = async (req, res) => {
  try {
    const rent = await Rent.findByPk(req.params.id, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Warehouse }
      ]
    });
    if (!rent) {
      return res.status(404).json({ message: "Rent not found" });
    }
    res.json(rent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRent = async (req, res) => {
  try {
    const rent = await Rent.create(req.body);
    
    // Obtener información del usuario y bodega para la notificación
    const user = await User.findByPk(req.body.user_id);
    const warehouse = await Warehouse.findByPk(req.body.warehouse_id);
    
    // Enviar notificación por correo electrónico
    await sendRentNotificationEmail(user, warehouse, rent);
    
    // Registrar notificación en la base de datos
    await Notification.create({
      notification_type: 'rent_confirmation',
      sent_date: new Date(),
      status: 'sent',
      user_id: user.user_id,
      warehouse_id: warehouse.warehouse_id
    });
    
    res.status(201).json(rent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


async function sendRentNotificationEmail(user, warehouse, rent) {
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
   } catch (error) {
     console.error('Error al enviar notificación por correo:', error);
   }
 }

export const updateRentStatus = async (req, res) => {
  try {
    const rent = await Rent.findByPk(req.params.id);
    if (!rent) {
      return res.status(404).json({ message: "Rent not found" });
    }
    await rent.update({ status: req.body.status });
    if (req.body.status === 'finished') {
      await Warehouse.update(
        { status: 'available' },
        { where: { warehouse_id: rent.warehouse_id } }
      );
    }
    res.json(rent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRent = async (req, res) => {
  try {
    const rent = await Rent.findByPk(req.params.id);
    if (!rent) {
      return res.status(404).json({ message: "Rent not found" });
    }
    await Warehouse.update(
      { status: 'available' },
      { where: { warehouse_id: rent.warehouse_id } }
    );
    await rent.destroy();
    res.json({ message: "Rent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};