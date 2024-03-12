import { type Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Page Not Found (404)',
  robots: {
    index: false,
    follow: false,
  },
};
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container prose prose-neutral my-4 min-h-40">
        <h1 className={cn(typographyVariants({ variant: 'h2' }))}>Page Not Found (404)</h1>
        <p>Could not find requested resource.</p>
      </main>
      <Footer />
    </>
  );
}
