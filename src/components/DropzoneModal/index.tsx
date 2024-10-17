import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  content: string;
  onSubmit: (files: File[]) => void;
  accept?: Accept;
};

export default function DropzoneModal({ content, onSubmit, accept }: Props) {
  const [open, setOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onSubmit(acceptedFiles);
      setOpen(false);
    },
    [onSubmit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {content}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files here or click to select files
          </DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            {isDragActive
              ? 'Drop the files here'
              : 'Drag files here or click to select'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
