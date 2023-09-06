'use client';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-xl">Oops... Something went wrong!</h2>
      <Button
        onClick={() => reset()} // Attempt to recover by trying to re-render the segment
      >
        Try again
      </Button>
    </div>
  );
}
