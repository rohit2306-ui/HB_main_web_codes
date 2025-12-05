import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
  colorClass?: string; // e.g. "text-blue-600 dark:text-blue-400"
  label?: string;
  labelVisible?: boolean;
  thickness?: number;
  overlay?: boolean; // new: render as centered full-screen overlay
  overlayClass?: string; // additional classes for overlay container
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  colorClass = 'text-blue-600 dark:text-blue-400',
  label = 'Loading...',
  labelVisible = false,
  thickness,
  overlay = false,
  overlayClass = '',
}) => {
  // resolve numeric size (px)
  const sizePx =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 16
      : size === 'lg'
      ? 48
      : 32; // md default

  const stroke = thickness ?? Math.max(2, Math.round(sizePx * 0.12));
  const half = sizePx / 2;
  const radius = half - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = Math.round(circumference * 0.25); // visible arc length

  const spinner = (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox={`0 0 ${sizePx} ${sizePx}`}
      className={`${colorClass} motion-reduce:animate-none animate-spin`}
      aria-hidden="true"
    >
      {/* subtle track */}
      <circle
        cx={half}
        cy={half}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        opacity="0.12"
      />

      {/* arc (rounded end) */}
      <circle
        className="rounded"
        cx={half}
        cy={half}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${arcLength} ${Math.max(1, Math.round(circumference - arcLength))}`}
        strokeDashoffset="0"
        style={{
          transformOrigin: '50% 50%',
        }}
      />
    </svg>
  );

  if (overlay) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={label}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm ${overlayClass}`}
      >
        <div className={`inline-flex flex-col items-center gap-2 p-4 rounded-lg bg-white/80 dark:bg-gray-900/80 shadow-md ${className}`}>
          {spinner}
          {labelVisible ? (
            <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
          ) : (
            <span className="sr-only">{label}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {spinner}

      {/* Optional visible text label (keeps sr-only by default) */}
      {labelVisible ? (
        <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;