'use client';

import * as React from 'react';
import jsFileDownload from 'js-file-download';
import { DownloadIcon } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';

export interface FileDownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  url: string;
  filename: string;
  mime?: string;
}

const FileDownloadButton = React.forwardRef<HTMLButtonElement, FileDownloadButtonProps>(function (
  { url, filename, mime, disabled, children, ...props },
  ref
) {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      variant="ghost"
      disabled={disabled || loading}
      {...props}
      ref={ref}
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const response = await fetch(url, {});
          if (response.ok) {
            const blob = await response.blob();
            jsFileDownload(blob, filename, mime);
          } else {
            console.log('Failed to download file', response.status, response.statusText);
          }
        } catch (e) {
          console.log('Failed to download file', e);
        } finally {
          setLoading(false);
        }
      }}
    >
      {children ?? <DownloadIcon className="size-4" />}
    </Button>
  );
});
FileDownloadButton.displayName = 'FileDownloadButton';

export { FileDownloadButton };
