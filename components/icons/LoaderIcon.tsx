
import React from 'react';

export const LoaderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-6.5l-2.12 2.12M7.62 16.38l-2.12 2.12M16.38 7.62l2.12-2.12M5.5 5.5l2.12 2.12"
    />
  </svg>
);
