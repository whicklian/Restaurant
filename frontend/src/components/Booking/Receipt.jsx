import React from 'react';

const Receipt = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => window.print();
  const isTable = booking.type === 'Table';

  const totalItems = booking.items && booking.items.length > 0 ? booking.items : [];

  const occasionLabels = {
    birthday: '🎂 Birthday', anniversary: '💍 Anniversary',
    date: '💑 Date Night', business: '💼 Business', none: null
  };

  return (
    <div className="lightbox active" onClick={onClose} style={{ zIndex: 3000 }}>
      <div
        className="receipt-modal"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '92%',
          background: 'var(--surface)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          border: '1px solid var(--border-light)'
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: 'var(--accent)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '14px', right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none', borderRadius: '50%',
              width: '32px', height: '32px',
              color: 'white', cursor: 'pointer', fontSize: '1rem'
            }}
          ><i className="fas fa-times"></i></button>

          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.8rem'
          }}>
            <i className={`fas ${isTable ? 'fa-chair' : 'fa-building'}`} style={{ color: 'white' }}></i>
          </div>

          <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>
            {isTable ? 'Table Reservation' : 'Premises Booking'}
          </h2>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '20px', padding: '0.3rem 0.9rem', marginTop: '0.7rem'
          }}>
            <i className="fas fa-check-circle" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}></i>
            <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>{booking.status}</span>
          </div>
        </div>

        {/* ── Content ── */}
        <div id="printable-receipt" style={{ padding: '1.8rem', color: 'var(--text-primary)', background: 'var(--surface)' }}>

          {/* Receipt ID */}
          <div style={{
            textAlign: 'center', marginBottom: '1.5rem',
            padding: '0.6rem 1rem',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px dashed var(--border-light)'
          }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Receipt ID</p>
            <p style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '1rem', color: 'var(--accent)', letterSpacing: '2px' }}>
              {booking.receiptId}
            </p>
          </div>

          {/* Customer + Date row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '1rem', marginBottom: '1.2rem',
            paddingBottom: '1.2rem',
            borderBottom: '1px dashed var(--border-light)'
          }}>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Customer</p>
              <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{booking.fullName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Date</p>
              <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Booking Details grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTable ? '1fr 1fr 1fr 1fr' : '1fr 1fr',
            gap: '0.8rem', marginBottom: '1.2rem',
            paddingBottom: '1.2rem',
            borderBottom: '1px dashed var(--border-light)'
          }}>
            {isTable && (
              <>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '0.7rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Time</p>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{booking.time || 'N/A'}</p>
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '0.7rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Guests</p>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{booking.guests || 'N/A'}</p>
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '0.7rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Table</p>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent)' }}>
                    #{booking.tableNumber || (Math.floor(booking.receiptId?.charCodeAt(5) % 20) + 1)}
                  </p>
                </div>
              </>
            )}
            <div style={{ background: 'var(--accent-light)', borderRadius: '10px', padding: '0.7rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: '600' }}>Status</p>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent)' }}>✓ {booking.status}</p>
            </div>
          </div>

          {/* Occasion badge */}
          {booking.occasion && booking.occasion !== 'none' && occasionLabels[booking.occasion] && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--accent-light)', color: 'var(--accent)',
              borderRadius: '20px', padding: '0.4rem 1rem',
              fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.2rem'
            }}>
              {occasionLabels[booking.occasion]}
            </div>
          )}

          {/* Pre-ordered Items */}
          {totalItems.length > 0 && (
            <div style={{ marginBottom: '1.2rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.7rem', fontWeight: '600' }}>
                <i className="fas fa-utensils" style={{ marginRight: '0.4rem', color: 'var(--accent)' }}></i>Pre-ordered Items
              </p>
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                border: '1px solid var(--border-light)'
              }}>
                {totalItems.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    padding: '0.35rem 0',
                    borderBottom: idx < totalItems.length - 1 ? '1px solid var(--border-light)' : 'none',
                    color: 'var(--text-primary)'
                  }}>
                    <span>
                      <span style={{ color: 'var(--accent)', fontWeight: '700', marginRight: '0.4rem' }}>{item.quantity}×</span>
                      {item.title || item.name}
                    </span>
                    <span style={{ fontWeight: '700', color: 'var(--accent)' }}>
                      KSH {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.requests && booking.requests.trim() && (
            <div style={{
              padding: '0.8rem 1rem',
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              marginBottom: '1.2rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)'
            }}>
              <i className="fas fa-comment-alt" style={{ color: 'var(--accent)', marginRight: '0.4rem' }}></i>
              <em>{booking.requests}</em>
            </div>
          )}

          {/* Total */}
          <div style={{
            padding: '1.2rem',
            background: 'var(--accent-light)',
            borderRadius: '12px',
            border: '2px solid var(--accent)'
          }}>
            {isTable ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <span>Base Reservation Fee</span>
                  <span style={{ fontWeight: '600' }}>KSH {(booking.reservationFee || 1500).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <span>Pre-order Total ({totalItems.length} items)</span>
                  <span style={{ fontWeight: '600' }}>KSH {(booking.amount - (booking.reservationFee || 1500)).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px dashed var(--accent)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                    Grand Total
                  </p>
                  <p style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--accent)' }}>
                    KSH {parseFloat(booking.amount || 0).toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
                    Payment Total
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Event premises booking</p>
                </div>
                <p style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--accent)' }}>
                  KSH {parseFloat(booking.amount || 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Signature Block - Sugar Coated Design */}
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '1.8rem',
            borderTop: '2px solid rgba(193, 123, 75, 0.2)', /* Soft accent border */
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            position: 'relative'
          }}>
            {/* Background watermark icon */}
            <i className="fas fa-leaf" style={{
              position: 'absolute',
              top: '20px', left: '40%',
              fontSize: '4rem',
              color: 'rgba(193, 123, 75, 0.04)',
              transform: 'rotate(15deg)',
              pointerEvents: 'none'
            }}></i>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ 
                margin: 0, 
                color: 'var(--accent)', 
                fontFamily: '"Playfair Display", serif', 
                fontWeight: '600', 
                letterSpacing: '1px',
                fontSize: '1.4rem'
              }}>
                SavoryBites
              </h3>
              <p style={{ 
                margin: '0.3rem 0 0', 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                fontFamily: 'serif'
              }}>
                An experience to savor.
              </p>
            </div>
            
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, minWidth: '130px' }}>
              <div style={{ 
                fontFamily: '"Alex Brush", "Dancing Script", cursive', 
                fontSize: '2.8rem', 
                color: 'var(--accent)', 
                marginBottom: '-0.8rem', 
                transform: 'rotate(-8deg)',
                textShadow: '1px 1px 2px rgba(193, 123, 75, 0.1)',
                fontWeight: 'normal'
              }}>
                Reagan
              </div>
              <div style={{ 
                width: '100%', 
                height: '2px', 
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', 
                margin: '0 auto 0.4rem',
                opacity: 0.6
              }}></div>
              <p style={{ 
                margin: 0, 
                fontWeight: '800', 
                fontSize: '0.9rem', 
                color: 'var(--text-primary)',
                letterSpacing: '0.5px'
              }}>
                Reagan Omondi
              </p>
              <p style={{ 
                margin: '2px 0 0', 
                fontSize: '0.65rem', 
                color: 'var(--text-muted)', 
                textTransform: 'uppercase', 
                letterSpacing: '2px',
                fontWeight: '600'
              }}>
                Senior Chef
              </p>
            </div>
          </div>

        </div>

        {/* ── Actions ── */}
        <div style={{
          display: 'flex', gap: '0.8rem',
          padding: '1.2rem 1.8rem',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)'
        }}>
          <button
            onClick={handlePrint}
            style={{
              flex: 1, padding: '0.8rem', borderRadius: '10px',
              background: 'var(--surface)', color: 'var(--text-primary)',
              border: '1px solid var(--border-light)', cursor: 'pointer',
              fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'
            }}
          >
            <i className="fas fa-print" style={{ marginRight: '0.5rem' }}></i>Print
          </button>
          <button
            onClick={onClose}
            className="btn"
            style={{ flex: 2, borderRadius: '10px', padding: '0.8rem', fontSize: '0.9rem' }}
          >
            <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>Done
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt {
            position: absolute; left: 0; top: 0;
            width: 100%; padding: 2rem;
            background: white !important; color: black !important;
          }
          #printable-receipt * { color: black !important; background: #f5f5f5 !important; }
        }
      `}</style>
    </div>
  );
};

export default Receipt;
