import React, { useState } from 'react';
import { Order } from '../../types';
import { db, ReturnTicket } from '../../services/db/repository';
import { useStore } from '../../store/useStore';
import {
  RotateCcw,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';


interface ReturnRequestModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: (ticket: ReturnTicket) => void;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({ order, onClose, onSuccess }) => {
  const addToast = useStore((state) => state.addToast);

  // Selected items mapping: { itemId: quantityToReturn }
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (order.items.length > 0) {
      initial[order.items[0].id || 'item_0'] = 1;
    }
    return initial;
  });

  const [reason, setReason] = useState<string>('Size / Fit Mismatch');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [refundMethod, setRefundMethod] = useState<'original_payment' | 'store_credit'>('store_credit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check 14-day policy window
  const orderDate = new Date(order.createdAt).getTime();
  const daysSinceOrder = Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24));
  const isWithinWindow = daysSinceOrder <= 14;

  const returnReasons = [
    'Size / Fit Mismatch',
    'Garment Defect / Flaw',
    'Incorrect Item Delivered',
    'Fabric / Color Not as Expected',
    'Changed Mind / Other',
  ];

  // Calculate return refund amount
  const calculateRefundAmount = () => {
    let subtotal = 0;
    order.items.forEach((item, idx) => {
      const key = item.id || `item_${idx}`;
      const qty = selectedItems[key] || 0;
      if (qty > 0) {
        subtotal += item.price * qty;
      }
    });

    if (refundMethod === 'store_credit') {
      return Math.round(subtotal * 1.1); // 10% VIP Bonus
    }
    return subtotal;
  };

  const handleToggleItem = (key: string, maxQty: number) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = maxQty;
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const selectedKeys = Object.keys(selectedItems);
    if (selectedKeys.length === 0) {
      addToast('error', 'No Items Selected', 'Please select at least one garment to return.');
      return;
    }

    if (!isWithinWindow) {
      addToast('error', 'Policy Window Expired', 'Returns are accepted within 14 days of delivery.');
      return;
    }

    setIsSubmitting(true);

    const itemsToReturn = order.items
      .map((item, idx) => {
        const key = item.id || `item_${idx}`;
        const qty = selectedItems[key] || 0;
        return {
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: qty,
          price: item.price,
        };
      })
      .filter((i) => i.quantity > 0);

    const returnTicket: ReturnTicket = {
      id: `RET-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      createdAt: new Date().toISOString(),
      items: itemsToReturn,
      reason,
      additionalNotes: additionalNotes.trim() || undefined,
      refundMethod,
      status: 'requested',
      refundAmount: calculateRefundAmount(),
    };

    await db.orders.createReturnRequest(returnTicket);

    setIsSubmitting(false);
    addToast('success', 'Return Dispatched', `Return request ${returnTicket.id} created successfully.`);
    onSuccess(returnTicket);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vw, 1.5rem)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 'min(620px, calc(100vw - 20px))',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'clamp(1.2rem, 3vw, 2.25rem)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              <RotateCcw size={14} />
              <span>Complimentary White-Glove Returns</span>
            </div>
            <h3 className="font-display" style={{ fontSize: '1.4rem', color: '#fff', marginTop: '0.25rem' }}>
              Request Return or Exchange
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Order Reference: <strong style={{ color: 'var(--accent-gold)' }}>{order.orderNumber}</strong>
            </span>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* 14-Day Return Policy Badge */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: isWithinWindow ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: isWithinWindow ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: isWithinWindow ? '#10b981' : '#f87171',
          }}
        >
          {isWithinWindow ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>
            {isWithinWindow
              ? `14-Day Luxury Fitting Guarantee Active (${14 - daysSinceOrder} days remaining).`
              : 'The 14-day complimentary return window for this order has expired.'}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Item Selection */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>
              Select Pieces to Return
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items.map((item, idx) => {
                const key = item.id || `item_${idx}`;
                const isSelected = selectedItems[key] !== undefined;

                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleItem(key, item.quantity)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />

                    <img
                      src={item.imageUrl || item.image || ''}
                      alt={item.productName}
                      style={{ width: '42px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Size: {item.size} · {item.colorName} · Qty: {item.quantity}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Reason for Return
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-light)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              {returnReasons.map((r) => (
                <option key={r} value={r} style={{ background: '#121214', color: '#fff' }}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Refund Method Options */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Refund Preference
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => setRefundMethod('store_credit')}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: refundMethod === 'store_credit' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  background: refundMethod === 'store_credit' ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800 }}>
                  <Sparkles size={13} />
                  <span>VIP Store Credit</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                  +10% Bonus Credit
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Instant digital atelier voucher
                </div>
              </div>

              <div
                onClick={() => setRefundMethod('original_payment')}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: refundMethod === 'original_payment' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  background: refundMethod === 'original_payment' ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  Original Payment
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                  Source Account
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  3-5 business days upon inspection
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Additional Notes for Couturier (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Size was slightly tight across chest, would like replacement in Size L..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-light)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Refund Estimate Banner */}
          <div style={{ padding: '1rem', background: 'rgba(212, 175, 55, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Estimated Refund Total:</span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--accent-gold)' }}>
              ₹{calculateRefundAmount().toLocaleString('en-IN')}
            </strong>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={isSubmitting || !isWithinWindow || Object.keys(selectedItems).length === 0}
              className="btn btn-gold"
              style={{ flex: 1, padding: '0.75rem' }}
            >
              <span>{isSubmitting ? 'Processing Dispatch...' : 'Confirm Return Request'}</span>
              <ArrowRight size={15} />
            </button>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ padding: '0.75rem 1.25rem' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
