import React, { forwardRef } from "react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={`h-4 w-4 rounded border-neutral-300 text-red-500 focus:ring-red-500 ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
