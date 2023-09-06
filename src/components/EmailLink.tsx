import React from 'react';
import { cn } from '@/lib/utils';

export interface EmailLinkProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'href'> {
  email: string;
}

const EmailLink = React.forwardRef(function (
  { email, className, children, ...props }: EmailLinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  return (
    <a href={`mailto:${email}`} className={cn('text-primary hover:underline', className)} {...props} ref={ref}>
      {children || email}
    </a>
  );
});
EmailLink.displayName = 'EmailLink';

export { EmailLink };
