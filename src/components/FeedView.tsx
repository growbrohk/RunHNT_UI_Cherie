import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FeedActivity {
  id: number;
  created_at: string;
  team_name: string;
  scan: string;
  treasure_name_zh: string;
  points_earned: number;
}

const FeedView: React.FC = () => {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('feed_view')
        .select('id, created_at, team_name, scan, treasure_name_zh, points_earned')
        .order('created_at', { ascending: true })
        .limit(150);

      if (error) {
        console.error('Error fetching feed data:', error);
        setError('Failed to load activity feed. Check your connection or database setup.');
        toast({
          title: 'Error',
          description: 'Failed to load activity feed.',
          variant: 'destructive',
        });
        setActivities([]);
      } else {
        setActivities((data as FeedActivity[]) || []);
      }

      setIsLoading(false);
    };

    fetchFeed();
  }, []);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(); // you can tweak this later
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">FEED</h1>
        <button className="text-gray-500 hover:text-green-600 p-1 rounded-full transition">
          <Filter className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-3" />
            <p>Loading activity feed...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-red-500">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && activities.length === 0 && !error && (
          <div className="p-16 text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No activity yet.</h2>
            <p>Start hunting to see the feed populate!</p>
          </div>
        )}

        {!isLoading && activities.length > 0 && !error && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 border-b">ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 border-b">
                    created_at
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 border-b">
                    team_name
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 border-b">
                    scan
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 border-b">
                    treasure_name_zh
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-600 border-b">
                    points_earned
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
                  // same color logic if you still want color per team (optional)
                  const teamColorHash = activity.team_name
                    .split('')
                    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
                  const teamColor = `hsl(${teamColorHash % 360}, 70%, 50%)`;

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-b text-gray-700">{activity.id}</td>
                      <td className="px-3 py-2 border-b text-gray-500">
                        {formatDateTime(activity.created_at)}
                      </td>
                      <td className="px-3 py-2 border-b font-semibold" style={{ color: teamColor }}>
                        {activity.team_name}
                      </td>
                      <td className="px-3 py-2 border-b text-gray-800">{activity.scan}</td>
                      <td className="px-3 py-2 border-b text-gray-600">
                        {activity.treasure_name_zh}
                      </td>
                      <td className="px-3 py-2 border-b text-right font-bold text-green-600">
                        {activity.points_earned}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedView;
