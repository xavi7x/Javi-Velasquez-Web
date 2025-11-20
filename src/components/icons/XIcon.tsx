import * as React from 'react';

export function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.5 19.5l-1.5-2.125-7.8-10.875H5.4l5.8 8.1 1.5 2.125 8.1 11.375h3.4l-6.4-8.9z" />
    </svg>
  );
}
