import React, { forwardRef, MouseEventHandler, ReactNode, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, InputProps } from './input';

function EyeIconButton({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      role="button"
      className={cn(
        'absolute right-3 top-1/2 flex -translate-y-1/2 rounded-sm p-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  wrapperClassName?: string;
  endAdornmentClassName?: string;
}
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { wrapperClassName, endAdornmentClassName, ...props },
  ref
) {
  const [type, setType] = useState<'text' | 'password'>('password');
  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input {...props} ref={ref} type={type} />
      <EyeIconButton
        onClick={() => setType(type === 'password' ? 'text' : 'password')}
        className={endAdornmentClassName}
      >
        {type === 'password' ? (
          <>
            <EyeIcon className="size-5" />
            <span className="sr-only">Show input</span>
          </>
        ) : (
          <>
            <EyeOffIcon className="size-5" />
            <span className="sr-only">Mask input</span>
          </>
        )}
      </EyeIconButton>
    </div>
  );
});

export { PasswordInput };
