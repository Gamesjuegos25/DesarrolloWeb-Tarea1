// src/components/FormField.tsx
import type { ReactNode, CSSProperties } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

function FormField({ label, children, style, className }: FormFieldProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default FormField;