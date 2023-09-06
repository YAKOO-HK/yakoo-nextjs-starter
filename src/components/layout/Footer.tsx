import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('flex justify-center bg-neutral-700 px-4 py-2 text-white md:justify-end', className)}>
      <div>
        <div className="mb-1 flex items-center justify-center space-x-6 text-xs leading-loose md:justify-end md:text-sm">
          <a
            href="https://www.yakoo.com.hk/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Privacy Policy
          </a>
          <Separator orientation="vertical" className="h-[1rem] bg-current" />
          <a
            href="https://www.yakoo.com.hk/web-accessibility/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Web Accessibility
          </a>
        </div>
        <p className="text-center text-xs md:text-right">
          Copyright © 2023 Yakoo Technology Limited. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
