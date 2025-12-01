import React from 'react';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onNew: () => void;
};

const NewIncidentButton: React.FC<Props> = ({ onNew }) => {
  return (
    <Button className="inline-flex items-center gap-2" onClick={onNew}>
      <Flame className="h-4 w-4" />
      New incident
    </Button>
  );
};

export default NewIncidentButton;
