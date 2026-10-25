import React from 'react';

/**
 * ResolvaLogo Component
 * Renders the official Resolva speech-bubble logo with checkmark and green accent dot.
 * The inner speech bubble and verification tick are scaled up and centered
 * for maximum visibility and presence inside the signature dark square.
 */
export default function ResolvaLogo({
  className,
  size = 'sm', // 'sm' (24px container, 16px svg) | 'lg' (48px container, 32px svg)
  withContainer = false,
  containerClassName,
  ...props
}) {
  const defaultContainerClass =
    size === 'lg'
      ? 'w-12 h-12 rounded-[8px] bg-[#14110F] flex items-center justify-center shrink-0'
      : 'w-6 h-6 rounded-[6px] bg-[#14110F] flex items-center justify-center shrink-0';

  const defaultSvgClass = size === 'lg' ? 'w-8 h-8' : 'w-4 h-4';

  const resolvedSvgClass = className || defaultSvgClass;
  const resolvedContainerClass = containerClassName || defaultContainerClass;

  const svgContent = (
    <svg
      viewBox="0 0 160 160"
      className={resolvedSvgClass}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(80, 80) scale(1.24) translate(-80, -78)">
        {/* Speech Bubble */}
        <path
          d="M56 36H104A22 22 0 0 1 126 58V88A22 22 0 0 1 104 110H72L50 132V110H56A22 22 0 0 1 34 88V58A22 22 0 0 1 56 36Z"
          fill="#FFFFFF"
        />
        {/* Verification Tick */}
        <polyline
          points="57,74 73,89 104,57"
          fill="none"
          stroke="#14110F"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Active AI / Verification Accent Dot */}
        <circle
          cx="124"
          cy="38"
          r="14"
          fill="#10A36B"
          stroke="#14110F"
          strokeWidth="4"
        />
      </g>
    </svg>
  );

  if (withContainer) {
    return <div className={resolvedContainerClass}>{svgContent}</div>;
  }

  return svgContent;
}
