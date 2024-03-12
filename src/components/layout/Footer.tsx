import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('flex justify-center bg-neutral-700 px-4 py-2 text-white md:justify-end', className)}>
      <div>
        <div className="mb-1 flex items-center justify-center space-x-6 text-xs leading-loose md:justify-end md:text-sm">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Separator orientation="vertical" className="h-4 bg-current" />
          <Link href="/web-accessibility" className="hover:underline">
            Web Accessibility
          </Link>
        </div>
        <p className="text-center text-xs md:text-right">
          Powered by <a href="https://github.com/YAKOO-HK/yakoo-nextjs-starter">yakoo-nextjs-starter</a>.
        </p>
      </div>
    </footer>
  );
}
