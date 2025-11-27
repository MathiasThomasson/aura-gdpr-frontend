import React from 'react';
import { Switch } from '@/components/ui/switch';

type Props = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const NotificationToggle: React.FC<Props> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between rounded-md border border-border p-4">
    <div>
      <p className="text-sm font-medium">{label}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
  </div>
);

export default NotificationToggle;
