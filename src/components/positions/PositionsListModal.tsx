import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { positionsAPI } from '../../services/api';
import { toast } from 'sonner';
import { formatDate } from '../../lib/utils';

interface Position {
  id: string;
  name: string;
  seats: number;
  nominationOpens: string;
  nominationCloses: string;
  votingOpens: string;
  votingCloses: string;
  _count?: {
    candidates: number;
    votes: number;
  };
}

interface PositionsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPositionDeleted?: () => void;
  onSuccess?: () => void;
}

const PositionsListModal: React.FC<PositionsListModalProps> = ({ isOpen, onClose, onPositionDeleted, onSuccess }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPositions();
    }
  }, [isOpen]);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const data = await positionsAPI.getAll();
      setPositions(data);
    } catch (err: any) {
      toast.error('Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone if there are candidates or votes.`)) {
      return;
    }

    setDeleting(id);
    try {
      await positionsAPI.delete(id);
      toast.success('Position deleted successfully');
      fetchPositions();
      if (onPositionDeleted) {
        onPositionDeleted();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete position');
    } finally {
      setDeleting(null);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>All Positions ({positions.length})</CardTitle>
          <CardDescription>
            View and manage all election positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading positions...</p>
          ) : positions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No positions created yet</p>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{position.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                        <div>
                          <strong>Seats:</strong> {position.seats}
                        </div>
                        <div>
                          <strong>Candidates:</strong> {position._count?.candidates || 0}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          <strong>Nomination:</strong>{' '}
                          {formatDate(position.nominationOpens)} -{' '}
                          {formatDate(position.nominationCloses)}
                        </p>
                        <p>
                          <strong>Voting:</strong>{' '}
                          {formatDate(position.votingOpens)} -{' '}
                          {formatDate(position.votingCloses)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(position.id, position.name)}
                        disabled={deleting === position.id || (position._count?.candidates || 0) > 0 || (position._count?.votes || 0) > 0}
                      >
                        {deleting === position.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                  {(position._count?.candidates || 0) > 0 && (
                    <p className="text-xs text-slate-600 mt-2">
                      ⚠️ Cannot delete: Has {position._count?.candidates} candidate(s)
                    </p>
                  )}
                  {(position._count?.votes || 0) > 0 && (
                    <p className="text-xs text-slate-600 mt-2">
                      ⚠️ Cannot delete: Has {position._count?.votes} vote(s)
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PositionsListModal;

