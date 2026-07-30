import React from 'react';

const VI_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const RANGE = 7;

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function generateDays(center: Date): Date[] {
  return Array.from({ length: RANGE * 2 + 1 }, (_, i) => {
    const d = new Date(center);
    d.setDate(d.getDate() + (i - RANGE));
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface DaySelectorProps {
  value: Date;
  onChange: (date: Date) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ value, onChange }) => {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const days = React.useMemo(() => generateDays(today), [today]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const todayRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const container = scrollRef.current;
    const todayEl = todayRef.current;
    if (container && todayEl) {
      container.scrollLeft =
        todayEl.offsetLeft - container.clientWidth / 2 + todayEl.clientWidth / 2;
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {days.map((day, idx) => {
        const isActive = isSameDay(day, value);
        const isToday = isSameDay(day, today);
        return (
          <button
            key={idx}
            ref={isToday ? todayRef : undefined}
            type="button"
            onClick={() => onChange(day)}
            className={`flex h-[4.25rem] w-14 shrink-0 flex-col items-center justify-center border ${
              isActive
                ? 'border-sgs-black bg-sgs-black text-white'
                : 'border-sgs-border bg-sgs-white text-sgs-black'
            }`}
          >
            <span
              className={`font-display text-[10px] font-bold tracking-[0.12em] ${
                isActive ? 'text-sgs-orange' : 'text-sgs-gray'
              }`}
            >
              {VI_DAYS[day.getDay()]}
            </span>
            <span className="mt-1 font-display text-[18px] font-bold leading-none">
              {String(day.getDate()).padStart(2, '0')}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
