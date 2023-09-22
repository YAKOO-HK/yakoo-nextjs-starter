'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from './ui/button';

function BackButton(props: ButtonProps) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        router.back();
      }}
      {...props}
    />
  );
}

export default BackButton;
