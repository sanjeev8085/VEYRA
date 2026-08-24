import { CustomerNotification, Order } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'veyra_customer_notifications';

// Initial curated luxury notification seed
const SEED_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif_welcome_01',
    type: 'promotion_broadcast',
    channel: 'email',
    title: 'Welcome to the VEYRA Haute Couture Atelier',
    message: 'Enjoy complimentary express shipping and 15% off your maiden bespoke order with code VEYRA15.',
    recipientName: 'Valued Customer',
    recipientEmail: 'client@veyra.luxury',
    isRead: false,
    sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    metadata: {
      promoCode: 'VEYRA15',
      discountPercent: 15,
    },
  },
  {
    id: 'notif_shipped_demo',
    type: 'order_shipped',
    channel: 'in_app',
    title: 'Garment Dispatched: Order #VYR-88219',
    message: 'Your Unstructured Atelier Blazer has passed 7-point hand inspection and is en route via BlueDart Air Express.',
    recipientName: 'Valued Customer',
    isRead: false,
    sentAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    metadata: {
      orderNumber: 'VYR-88219',
      trackingNumber: 'BLUEDART-IND-994827',
      courierName: 'BlueDart Express',
      trackingUrl: '#/track-order?trackingNumber=BLUEDART-IND-994827',
    },
  },
];

type NotificationListener = (notifications: CustomerNotification[]) => void;
const listeners = new Set<NotificationListener>();

const emitChange = (notifications: CustomerNotification[]) => {
  listeners.forEach((listener) => listener(notifications));
};

export const getNotifications = (userId?: string): CustomerNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      return SEED_NOTIFICATIONS;
    }
    const parsed: CustomerNotification[] = JSON.parse(raw);
    if (userId) {
      return parsed.filter((n) => !n.userId || n.userId === userId);
    }
    return parsed;
  } catch {
    return SEED_NOTIFICATIONS;
  }
};

const saveNotifications = (notifications: CustomerNotification[]) => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    emitChange(notifications);
  } catch (err) {
    console.warn('[Notification Service] Save error:', err);
  }
};

export const subscribeToNotifications = (listener: NotificationListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const markAsRead = (notificationId: string): void => {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n));
  saveNotifications(updated);
};

export const markAllAsRead = (): void => {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, isRead: true }));
  saveNotifications(updated);
};

export const deleteNotification = (notificationId: string): void => {
  const current = getNotifications();
  const updated = current.filter((n) => n.id !== notificationId);
  saveNotifications(updated);
};

/**
 * Generates photorealistic luxury HTML email content for preview in the email dispatcher simulator
 */
export const generateLuxuryEmailTemplate = (notification: CustomerNotification): string => {
  const { title, message, recipientName, metadata, sentAt } = notification;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #070709; color: #f6f5f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .email-container { max-width: 580px; margin: 20px auto; background: #121217; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; overflow: hidden; }
    .header { background: radial-gradient(circle at top, #231e1a 0%, #121217 100%); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .brand-title { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 0.18em; color: #d4af37; text-transform: uppercase; margin: 0; }
    .brand-sub { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #8c857b; margin-top: 6px; }
    .body { padding: 32px 28px; line-height: 1.65; font-size: 14px; color: #b8b0a5; }
    .salutation { font-size: 16px; font-weight: 600; color: #f6f5f3; margin-bottom: 14px; }
    .action-card { background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; padding: 18px; margin: 24px 0; text-align: center; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #d4af37, #8c6508); color: #ffffff !important; text-decoration: none; padding: 12px 26px; border-radius: 999px; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 14px; }
    .footer { background: #0a0a0d; padding: 24px; text-align: center; font-size: 11px; color: #6e6b73; border-top: 1px solid rgba(255, 255, 255, 0.06); }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="brand-title">VEYRA</h1>
      <div class="brand-sub">Haute Couture & 3D Atelier</div>
    </div>
    <div class="body">
      <div class="salutation">Dear ${recipientName || 'Patron of Elegance'},</div>
      <h2 style="font-size: 18px; color: #f6f5f3; margin: 0 0 12px 0;">${title}</h2>
      <p>${message}</p>
      
      ${
        metadata?.orderNumber
          ? `
        <div class="action-card">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #d4af37; font-weight: 700;">Order Reference: ${metadata.orderNumber}</div>
          ${metadata.trackingNumber ? `<div style="font-size: 13px; color: #f6f5f3; margin-top: 6px;">Carrier: <strong>${metadata.courierName || 'BlueDart Air'}</strong> • Waybill: <code>${metadata.trackingNumber}</code></div>` : ''}
          ${metadata.amount ? `<div style="font-size: 14px; font-weight: 700; color: #d4af37; margin-top: 6px;">Total: ₹${metadata.amount.toLocaleString('en-IN')}</div>` : ''}
          ${metadata.trackingUrl ? `<a href="${metadata.trackingUrl}" class="cta-btn">Track Consignment Live</a>` : ''}
        </div>
      `
          : ''
      }

      ${
        metadata?.promoCode
          ? `
        <div class="action-card">
          <div style="font-size: 11px; text-transform: uppercase; color: #8c857b;">Exclusive Atelier Privilege</div>
          <div style="font-size: 22px; font-weight: 800; color: #d4af37; letter-spacing: 0.12em; margin: 8px 0;">${metadata.promoCode}</div>
          <div style="font-size: 12px; color: #b8b0a5;">Enjoy ${metadata.discountPercent || 15}% privilege savings on your order.</div>
        </div>
      `
          : ''
      }

      <p style="margin-top: 24px; font-size: 12px; color: #8c857b;">
        Every VEYRA garment is meticulously created to elevate personal presence. Should you require bespoke adjustments or styling concierge, our atelier team is at your command.
      </p>
    </div>
    <div class="footer">
      <div>VEYRA Luxury Atelier • 18 Rue du Faubourg Saint-Honoré / Bandra Kurla Complex</div>
      <div style="margin-top: 6px;">Dispatched at: ${new Date(sentAt).toLocaleString('en-IN')} • Confidential Client Advisory</div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Triggers Order Placed notification
 */
export const notifyOrderPlaced = (order: Order): CustomerNotification => {
  const newNotif: CustomerNotification = {
    id: `notif_order_${Date.now()}`,
    userId: order.userId,
    recipientName: order.customerName,
    recipientEmail: order.customerEmail,
    type: 'order_placed',
    channel: 'email',
    title: `Order Confirmed: #${order.orderNumber}`,
    message: `Thank you for choosing VEYRA. Your order of ${order.items.length} bespoke item(s) totalling ₹${(order.totalAmount || order.total || 0).toLocaleString('en-IN')} has been placed.`,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount || order.total || 0,
      trackingUrl: `#/track-order?orderNumber=${order.orderNumber}`,
    },
    isRead: false,
    sentAt: new Date().toISOString(),
  };

  const current = getNotifications();
  saveNotifications([newNotif, ...current]);
  return newNotif;
};

/**
 * Triggers Payment Received confirmation
 */
export const notifyPaymentReceived = (order: Order): CustomerNotification => {
  const newNotif: CustomerNotification = {
    id: `notif_pay_${Date.now()}`,
    userId: order.userId,
    recipientName: order.customerName,
    recipientEmail: order.customerEmail,
    type: 'payment_received',
    channel: 'in_app',
    title: `Payment Verified: #${order.orderNumber}`,
    message: `Payment of ₹${(order.totalAmount || order.total || 0).toLocaleString('en-IN')} successfully verified via ${order.paymentMethod?.toUpperCase() || 'Card'}. Tailoring production initiated.`,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount || order.total || 0,
    },
    isRead: false,
    sentAt: new Date().toISOString(),
  };

  const current = getNotifications();
  saveNotifications([newNotif, ...current]);
  return newNotif;
};

/**
 * Triggers Order Shipped alert with live tracking
 */
export const notifyOrderShipped = (
  order: Order,
  trackingNumber = 'BLUEDART-IND-994821',
  courierName = 'BlueDart Air Express'
): CustomerNotification => {
  const newNotif: CustomerNotification = {
    id: `notif_ship_${Date.now()}`,
    userId: order.userId,
    recipientName: order.customerName,
    recipientEmail: order.customerEmail,
    type: 'order_shipped',
    channel: 'email',
    title: `Consignment Dispatched: #${order.orderNumber}`,
    message: `Your luxury package has been dispatched via ${courierName}. Waybill: ${trackingNumber}.`,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingNumber,
      courierName,
      trackingUrl: `#/track-order?trackingNumber=${trackingNumber}`,
    },
    isRead: false,
    sentAt: new Date().toISOString(),
  };

  const current = getNotifications();
  saveNotifications([newNotif, ...current]);
  return newNotif;
};

/**
 * Broadcasts a promotional announcement to all customers
 */
export const broadcastPromotion = (
  title: string,
  promoCode: string,
  discountPercent: number,
  description: string
): CustomerNotification => {
  const newNotif: CustomerNotification = {
    id: `notif_promo_${Date.now()}`,
    type: 'promotion_broadcast',
    channel: 'email',
    title: `Private Invitation: ${title}`,
    message: description || `Enjoy an exclusive privilege of ${discountPercent}% savings on all natural fiber atelier collections with code ${promoCode}.`,
    recipientName: 'Valued Patron',
    recipientEmail: 'patron@veyra.luxury',
    metadata: {
      promoCode,
      discountPercent,
    },
    isRead: false,
    sentAt: new Date().toISOString(),
  };

  const current = getNotifications();
  saveNotifications([newNotif, ...current]);
  return newNotif;
};
