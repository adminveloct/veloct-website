import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/** Arrow pointing right (Fill currentColor) */
export function ArrowRightIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M4 13H16.18L10.58 18.6L12 20L20 12L12 4L10.57 5.4L16.18 11H4V13Z" />
    </svg>
  );
}

/** Arrow pointing down (Scroll hint icon) */
export function ArrowDownIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M11 4V16.18L5.4 10.58L4 12L12 20L20 12L18.6 10.57L13 16.18V4H11Z" />
    </svg>
  );
}

/** Building / Address icon */
export function BuildingIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M3 21V7H7V3H17V11H21V21H13V17H11V21H3ZM5 19H7V17H5V19ZM5 15H7V13H5V15ZM5 11H7V9H5V11ZM9 15H11V13H9V15ZM9 11H11V9H9V11ZM9 7H11V5H9V7ZM13 15H15V13H13V15ZM13 11H15V9H13V11ZM13 7H15V5H13V7ZM17 19H19V17H17V19ZM17 15H19V13H17V15Z" />
    </svg>
  );
}

/** Phone / Telephone icon */
export function PhoneIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M19.95 21C17.8633 21 15.8033 20.5467 13.77 19.64C11.7367 18.7333 9.89 17.4467 8.23 15.78C6.56333 14.1133 5.27667 12.2633 4.37 10.23C3.46333 8.19667 3.00667 6.13667 3 4.05C3 3.75 3.1 3.5 3.3 3.3C3.5 3.1 3.75 3 4.05 3H8.1C8.33333 3 8.54333 3.08 8.73 3.24C8.91667 3.4 9.02333 3.58667 9.05 3.8L9.7 7.3C9.73333 7.56667 9.72667 7.79 9.68 7.97C9.63333 8.15 9.54 8.31 9.4 8.45L6.98 10.9C7.31333 11.52 7.71 12.1167 8.17 12.69C8.63 13.2633 9.13333 13.8167 9.68 14.35C10.2 14.87 10.7433 15.35 11.31 15.79C11.8767 16.23 12.4733 16.6333 13.1 17L15.45 14.65C15.5967 14.4967 15.7933 14.3833 16.04 14.31C16.2867 14.2367 16.5233 14.2167 16.75 14.25L20.2 14.95C20.4333 15.0167 20.6233 15.1367 20.77 15.31C20.9167 15.4833 20.9933 15.68 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21ZM6.03 9L7.68 7.35L7.25 5H5.03C5.11 5.68 5.22667 6.35333 5.38 7.02C5.53333 7.68667 5.75 8.34667 6.03 9ZM14.98 17.95C15.6267 18.2367 16.29 18.4633 16.97 18.63C17.65 18.7967 18.3267 18.9033 19 18.95V16.75L16.65 16.27L14.97 17.95H14.98Z" />
    </svg>
  );
}

/** Mail / Email icon */
export function MailIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M4 20C3.45333 20 2.98333 19.8033 2.59 19.41C2.19667 19.0167 2 18.5467 2 18V6C2 5.45333 2.19667 4.98333 2.59 4.59C2.98333 4.19667 3.45333 4 4 4H20C20.5533 4 21.0233 4.19667 21.41 4.59C21.8033 4.98333 22 5.45333 22 6V18C22 18.5467 21.8033 19.0167 21.41 19.41C21.0167 19.8033 20.5467 20 20 20H4ZM12 13L4 8V18H20V8L12 13ZM12 11L20 6H4L12 11Z" />
    </svg>
  );
}

// Alias for backward compatibility
export const MailPatternIcon = MailIcon;

/** Success / Check Circle icon */
export function CheckCircleIcon({ size = 40, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M36.6673 18.4671V20.0004C36.6653 23.5945 35.5015 27.0916 33.3495 29.9701C31.1976 32.8487 28.1728 34.9546 24.7262 35.9736C21.2797 36.9926 17.5961 36.8703 14.2248 35.6247C10.8535 34.3792 7.97508 32.0773 6.01892 29.0622C4.06276 26.0472 3.13364 22.4805 3.37011 18.8943C3.60659 15.308 4.996 11.8943 7.33112 9.16221C9.66624 6.43012 12.822 4.52606 16.3276 3.734C19.8333 2.94194 23.5011 3.30432 26.784 4.76709"
        strokeWidth="4.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36.6667 6.66602L20 23.3493L15 18.3493"
        strokeWidth="4.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Plus / Expand icon (Accordion) */
export function PlusIcon({
  size = 20,
  className = "",
  strokeWidth = 1.66667,
  ...props
}: IconProps & { strokeWidth?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M10 4.16406V15.8307"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16797 10H15.8346"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Minus / Collapse icon (Accordion) */
export function MinusIcon({
  size = 20,
  className = "",
  strokeWidth = 1.66667,
  ...props
}: IconProps & { strokeWidth?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M4.16699 10H15.8337"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
