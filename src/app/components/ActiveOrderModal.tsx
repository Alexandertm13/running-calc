import { useEffect, useRef } from "react";

interface ActiveOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToOrder: () => void;
}

export function ActiveOrderModal({ isOpen, onReturnToOrder }: ActiveOrderModalProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) btnRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aom-title"
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }} />

      <div
        className="relative w-[360px] flex flex-col items-center px-6 py-6 rounded-[16px]"
        style={{
          backgroundColor: '#1A1A1A',
          border: '2px solid #C9A84C',
          boxShadow: '0px 4px 24px rgba(201,168,76,0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Иконка */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#C9A84C' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
        </div>

        {/* Заголовок */}
        <h2
          id="aom-title"
          className="mt-4 text-center"
          style={{ color: '#F0D080', fontSize: '18px', lineHeight: '24px', fontWeight: 700 }}
        >
          У вас уже есть активный заказ!
        </h2>

        {/* Пояснительный текст */}
        <p
          className="mt-2 text-center"
          style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '20px' }}
        >
          Если вы уже оплатили, ↩️ вернитесь к заказу и введите UTR 🔢.
        </p>

        {/* Кнопка действия */}
        <button
          ref={btnRef}
          onClick={onReturnToOrder}
          className="mt-6 w-[280px] h-12 rounded-[12px] flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:opacity-80"
          style={{
            backgroundColor: '#C9A84C',
            color: '#1A1A1A',
            fontSize: '16px',
            fontWeight: 700,
            boxShadow: '0px 2px 10px rgba(201,168,76,0.45)'
          }}
        >
          ↩️ Вернуться к заказу
        </button>
      </div>
    </div>
  );
}
