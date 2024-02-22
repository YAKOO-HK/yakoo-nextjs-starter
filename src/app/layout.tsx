import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './Providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Yakoo NextJS Starter',
  description: 'NextJS 13 AppDir Starter Template with shadcn-ui',
  keywords: ['Yakoo', 'NextJS', 'Starter Template', 'shadcn-ui'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={inter.variable}>
        <Providers>
          {children}
          <Toaster />
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-0 right-0 z-[99999] bg-teal-200 px-2 py-1 text-sm text-teal-900">
              Breakpoint:
              <span className="ml-1 font-bold sm:hidden">xs</span>
              <span className="ml-1 hidden font-bold sm:inline-block md:hidden">sm</span>
              <span className="ml-1 hidden font-bold md:inline-block lg:hidden">md</span>
              <span className="ml-1 hidden font-bold lg:inline-block xl:hidden">lg</span>
              <span className="ml-1 hidden font-bold xl:inline-block 2xl:hidden">xl</span>
              <span className="ml-1 hidden font-bold 2xl:inline-block">2xl</span>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
