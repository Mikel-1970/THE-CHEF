import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export function PrimaryButton({ children, onClick, type = 'button', disabled = false, icon = true }: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  icon?: boolean;
}) {
  return (
    <button className="primary-button" type={type} onClick={onClick} disabled={disabled}>
      <span>{children}</span>
      {icon && <ArrowRight size={19} />}
    </button>
  );
}
