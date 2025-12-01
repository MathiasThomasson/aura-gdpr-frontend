import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onNew: () => void;
};

const NewTomButton: React.FC<Props> = ({ onNew }) => {
  return (
    <Button className="inline-flex items-center gap-2" onClick={onNew}>
      <Shield className="h-4 w-4" />
      New TOM
    </Button>
  );
};

export default NewTomButton;
