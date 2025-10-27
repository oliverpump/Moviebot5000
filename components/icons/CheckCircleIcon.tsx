import React from 'react';

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}>
    <path 
      fillRule="evenodd" 
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.109 3.108-1.591-1.59a.75.75 0 0 0-1.061 1.06l2.122 2.12a.75.75 0 0 0 1.06 0l3.64-3.64Z" 
      clipRule="evenodd" 
    />
  </svg>
);