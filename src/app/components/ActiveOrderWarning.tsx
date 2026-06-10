import { useEffect, useRef } from "react";

interface ActiveOrderWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToOrder: () => void;
  orderNumber?: string;
}

export function ActiveOrderWarning({
  isOpen,
  onReturnToOrder,
  orderNumber = "12345"
}: ActiveOrderWarningProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) btnRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aow-title"
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} />

      <div
        className="relative w-full max-w-[420px] flex flex-col items-center rounded-3xl overflow-hidden"
        style={{
          backgroundColor: '#111111',
          border: '2px solid #C9A84C',
          boxShadow: '0px 8px 40px rgba(201,168,76,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Верхняя полоса */}
        <div
          className="w-full py-4 flex items-center justify-center gap-3"
          style={{ backgroundColor: '#C9A84C' }}
        >
          <div className="animate-pulse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#1A1A1A" />
              <path d="M12 8v4M12 16h.01" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
            ⚠️ ВНИМАНИЕ
          </div>
        </div>

        {/* Основной контент */}
        <div className="w-full p-8 flex flex-col items-center">

          {/* Карточка активного заказа */}
          <div className="relative mb-6">
            <div
              className="w-64 h-40 rounded-2xl flex flex-col items-center justify-center relative"
              style={{
                backgroundColor: '#1A1A1A',
                border: '2px solid #C9A84C',
                boxShadow: '0 0 20px rgba(201,168,76,0.2)'
              }}
            >
              <div className="text-center">
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#C9A84C' }}>
                  ✅ АКТИВНЫЙ ЗАКАЗ
                </div>
                <div
                  className="px-4 py-2 rounded-lg inline-block"
                  style={{ backgroundColor: 'rgba(201,168,76,0.15)', fontSize: '32px', fontWeight: 700, color: '#F0D080' }}
                >
                  #{orderNumber}
                </div>
              </div>

              {/* Пульсирующий индикатор */}
              <div className="absolute -top-2 -right-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: '#C9A84C', opacity: 0.5 }} />
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C9A84C' }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1A1A1A' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Заголовок */}
          <div id="aow-title" className="text-center mb-6">
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#F0D080', marginBottom: '12px' }}>
              У вас уже есть<br />активный заказ!
            </div>
          </div>

          {/* Блок инструкции */}
          <div className="w-full mb-8">
            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(201,168,76,0.35)' }}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C9A84C' }}>
                  <span style={{ fontSize: '28px' }}>💳</span>
                </div>
              </div>
              <div className="flex-1">
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#F0D080' }}>
                  Уже оплатили?
                </div>
                <div style={{ fontSize: '15px', color: '#A0A0A0' }}>
                  Введите UTR код
                </div>
              </div>
              <div className="flex-shrink-0">
                <span style={{ fontSize: '36px' }}>🔢</span>
              </div>
            </div>
          </div>

          {/* Кнопка возврата */}
          <button
            ref={btnRef}
            onClick={onReturnToOrder}
            className="w-full h-20 rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: '#C9A84C',
              border: '3px solid #A07830',
              boxShadow: '0px 4px 16px rgba(201,168,76,0.45)'
            }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(26,26,26,0.3)' }}>
              <span style={{ fontSize: '30px' }}>←</span>
            </div>
            <div style={{ color: '#1A1A1A', textAlign: 'left' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>
                ВЕРНУТЬСЯ
              </div>
              <div style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.2 }}>
                к заказу #{orderNumber}
              </div>
            </div>
          </button>

          {/* Подсказка */}
          <div className="mt-4 flex flex-col items-center animate-bounce">
            <div style={{ fontSize: '28px' }}>☝️</div>
            <div style={{ fontSize: '14px', color: '#C9A84C', fontWeight: 600 }}>
              НАЖМИТЕ ЗДЕСЬ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
