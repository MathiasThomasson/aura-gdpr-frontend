import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onNew: () => void;
};

const NewCookieButton: React.FC<Props> = ({ onNew }) => (
  <Button className="inline-flex items-center gap-2" onClick={onNew}>
    <Plus className="h-4 w-4" />
    New cookie
  </Button>
);

export default NewCookieButton;
