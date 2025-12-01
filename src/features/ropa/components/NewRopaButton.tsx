import React from 'react';
import { FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onNew: () => void;
};

const NewRopaButton: React.FC<Props> = ({ onNew }) => {
  return (
    <Button className="inline-flex items-center gap-2" onClick={onNew}>
      <FilePlus2 className="h-4 w-4" />
      New processing activity
    </Button>
  );
};

export default NewRopaButton;
