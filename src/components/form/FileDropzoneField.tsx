import * as React from 'react';
import { filesize } from 'filesize';
import { UploadIcon } from 'lucide-react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FileDropzoneFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  isError?: boolean;
  dropzoneProps?: Omit<DropzoneOptions, 'onDropAccepted'>;
  value?: File[];
  onChange: (files: File[]) => void;
  name: string;
}

export const FileDropzoneField = ({
  id,
  name,
  value = [],
  onChange,
  dropzoneProps = {},
  isError,
  className,
  ...props
}: FileDropzoneFieldProps) => {
  const genId = React.useId();
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    ...dropzoneProps,
    onDropAccepted: onChange,
  });

  return (
    <div
      {...getRootProps()}
      {...props}
      className={cn('flex flex-col items-center justify-center rounded-md border border-border p-4', {
        'border-destructive': isError,
      })}
    >
      <input {...getInputProps()} name={name} id={id || genId} />
      {value?.length > 0 ? (
        value?.map((file, index) => (
          <div key={`${index}-${file.name}`} className="space-between mb-2 flex w-full flex-row items-end gap-2">
            <p>{file.name}</p>
            <p className="text-sm">({filesize(file.size) as string})</p>
          </div>
        ))
      ) : (
        <>
          <UploadIcon />
          <p className="mb-2">Select a file or drag here</p>
        </>
      )}
      <div className="space-1 flex flex-row">
        <Button onClick={open} type="button">
          Browse
        </Button>
        {value?.[0] ? (
          <Button onClick={() => onChange([])} variant="ghost" type="button">
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
};
