import React from 'react';

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.749.654H5.89a.75.75 0 01-.749-.654L4.135 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9zM5.89 21.75h12.22a2.25 2.25 0 002.245-2.072l-1.004-13.006a.75.75 0 00-.749-.654H5.89a.75.75 0 00-.749.654L4.136 19.678a2.25 2.25 0 002.245 2.072z"
      clipRule="evenodd"
    />
  </svg>
);
