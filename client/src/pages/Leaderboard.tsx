import { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Award } from 'lucide-react';

interface LeaderboardEntry {
  userId: number;
  userName: string;
  totalPoints: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  userRank: number;
  currentStreak: number;
}

interface UserAchievement {
  id: number;
  name: string;
  description: string;
  badgeIcon: string;
  pointsReward: number;
  unlockedAt: string;
}

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  achievements: UserAchievement[];
  rank: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'friends' | 'weekly'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaderboard
        const leaderRes = await fetch(`/api/leaderboard?filter=${filter}`);
        const leaderData = await leaderRes.json();
        setLeaderboard(leaderData);

        // Fetch user stats
        const statsRes = await fetch('/api/user/stats');
        const statsData = await statsRes.json();
        setUserStats(statsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Leaderboard</h1>
          <p className="text-slate-600">Compete with other learners and earn achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {(['all', 'friends', 'weekly'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {f === 'all' ? 'All Time' : f === 'friends' ? 'Friends' : 'This Week'}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">Student</th>
                    <th className="px-6 py-4 text-center">Streak 🔥</th>
                    <th className="px-6 py-4 text-center">Lessons</th>
                    <th className="px-6 py-4 text-center">Courses</th>
                    <th className="px-6 py-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-slate-50 transition-colors ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {entry.userRank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {entry.userRank === 2 && <Trophy className="w-5 h-5 text-gray-400" />}
                          {entry.userRank === 3 && <Trophy className="w-5 h-5 text-orange-600" />}
                          <span className="font-bold text-lg text-slate-900">#{entry.userRank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{entry.userName}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold">{entry.currentStreak}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-900">{entry.lessonsCompleted}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-900">{entry.coursesCompleted}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-lg text-blue-600">{entry.totalPoints}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Stats Sidebar */}
          <div>
            {userStats && (
              <div className="space-y-6">
                {/* Stats Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-lg shadow-md p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold mb-2">#{userStats.rank}</div>
                    <p className="text-blue-100">Your Rank</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Total Points</span>
                      <span className="font-bold text-lg">{userStats.totalPoints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Current Streak</span>
                      <span className="font-bold text-lg flex items-center gap-1">
                        <Flame className="w-4 h-4" /> {userStats.currentStreak}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Longest Streak</span>
                      <span className="font-bold text-lg">{userStats.longestStreak}</span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Your Achievements
                  </h3>
                  <div className="space-y-3">
                    {userStats.achievements.length > 0 ? (
                      userStats.achievements.map(achievement => (
                        <div key={achievement.id} className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{achievement.badgeIcon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{achievement.name}</p>
                              <p className="text-xs text-slate-600">{achievement.description}</p>
                              <p className="text-xs text-blue-600 font-semibold mt-1">
                                +{achievement.pointsReward} points
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-600 text-sm">Complete lessons and practice tests to unlock achievements!</p>
                    )}
                  </div>
                </div>

                {/* How to Earn Points */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    How to Earn Points
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Complete a lesson: 10 points</li>
                    <li>• Pass a practice test: 25 points</li>
                    <li>• Perfect score (100%): 50 points</li>
                    <li>• 7-day streak: 75 points</li>
                    <li>• Complete a course: 200 points</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
