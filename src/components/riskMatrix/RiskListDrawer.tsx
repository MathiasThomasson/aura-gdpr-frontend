import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskItem } from '@/hooks/useRiskMatrix';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  riskLevel: 'low' | 'medium' | 'high' | null;
  items: RiskItem[];
  onClose: () => void;
};

const RiskListDrawer: React.FC<Props> = ({ open, riskLevel, items, onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-3xl bg-background shadow-2xl z-50 transform transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Risks</p>
            <h3 className="text-xl font-semibold capitalize">{riskLevel ? `${riskLevel} risk` : 'Risks'}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close risk list">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-3 overflow-auto h-[calc(100%-56px)]">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No items for this risk level.</div>
          ) : (
            items.map((item) => (
              <Card key={`${item.type}-${item.id}`}>
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                      <Badge className="capitalize">{item.risk}</Badge>
                      {item.source && <span>{item.source}</span>}
                    </div>
                  </div>
                  {item.link && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigate(item.link as string);
                        onClose();
                      }}
                    >
                      Open
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RiskListDrawer;
