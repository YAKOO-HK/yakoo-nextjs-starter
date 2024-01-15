'use client';

import { useEffect, useState } from 'react';
import { ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function useShowBackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // console.log({
      //   scrollY: window.scrollY,
      //   innerHeight: window.innerHeight,
      //   show: window.scrollY > window.innerHeight / 2,
      // });
      if (window.scrollY > window.innerHeight / 2) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return show;
}

export function BackToTopButton() {
  const showButton = useShowBackToTop();
  return (
    <button
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-full bg-primary p-2 text-primary-foreground shadow-sm shadow-primary/50 ring-offset-background transition-opacity duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        { 'opacity-100': showButton, 'pointer-events-none opacity-0': !showButton }
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
    >
      <span className="sr-only">Back to top</span>
      <ChevronUpIcon className="size-6" />
    </button>
  );
}
