'use client';

import { ReactNode, useCallback, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, ButtonProps } from './ui/button';

export interface ConfirmButtonProps extends ButtonProps {
  message?: ReactNode;
  onConfirm: () => Promise<unknown> | unknown;
  titleText?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
}
const ConfirmButton = ({
  message,
  onConfirm,
  titleText = 'Are you sure to continue?',
  cancelText = 'Cancel',
  confirmText = 'Continue',
  disabled,
  ...props
}: ConfirmButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [onConfirm]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button {...props} disabled={disabled || loading} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titleText}</AlertDialogTitle>
        </AlertDialogHeader>
        {message ? <div>{message}</div> : null}
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmButton;
