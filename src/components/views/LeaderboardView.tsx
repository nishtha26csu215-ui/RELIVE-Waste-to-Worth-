import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Medal, Award, TrendingUp, Sparkles, Recycle, Gift } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, points, totalWasteKg, totalItemsDonated, userProfile } = useApp();
  const [collegeFilter, setCollegeFilter] = useState<'all' | 'campus'>('all');

  const myEntry = {
    rank: 4,
    username: `${userProfile.name} (You)`,
    college: userProfile.city ? `${userProfile.address}, ${userProfile.city}` : userProfile.address,
    wasteRecycledKg: totalWasteKg,
    itemsDonated: totalItemsDonated,
    points: points,
    isCurrentUser: true,
  };

  const filteredEntries =
    collegeFilter === 'all'
      ? leaderboard.map((e) => (e.isCurrentUser ? myEntry : e))
      : leaderboard
          .map((e) => (e.isCurrentUser ? myEntry : e))
          .filter((e) => e.college.toLowerCase().includes('sector') || e.isCurrentUser);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <span>Community Sustainability League</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">Eco Champions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            RELIVE Eco Leaderboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Celebrating household and community green champions diverting waste and redistributing reusable items across neighborhoods.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setCollegeFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              collegeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Localities
          </button>
          <button
            onClick={() => setCollegeFilter('campus')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              collegeFilter === 'campus'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Neighborhood
          </button>
        </div>
      </div>

      {/* "Your Rank" Highlighted Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
              #{myEntry.rank}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                Your Current Rank
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {myEntry.username}
              </h3>
              <p className="text-xs text-slate-300">{myEntry.college}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-emerald-800/60">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Recycled
              </span>
              <span className="text-xl font-black text-white tabular-nums">
                {totalWasteKg} kg
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Donated
              </span>
              <span className="text-xl font-black text-white tabular-nums">
                {totalItemsDonated} items
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                RELIVE Pts
              </span>
              <span className="text-2xl font-black text-emerald-300 tabular-nums">
                {points.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Eco-Hero</th>
                <th className="py-4 px-6">Locality / Area</th>
                <th className="py-4 px-6 text-right">Waste Recycled</th>
                <th className="py-4 px-6 text-right">Items Donated</th>
                <th className="py-4 px-6 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEntries.map((entry) => {
                const isYou = entry.isCurrentUser;
                return (
                  <tr
                    key={entry.rank}
                    className={`transition-colors ${
                      isYou
                        ? 'bg-emerald-50/70 font-bold text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {entry.rank === 1 && (
                          <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
                        )}
                        {entry.rank === 2 && (
                          <Medal className="w-4 h-4 text-slate-400 fill-slate-400" />
                        )}
                        {entry.rank === 3 && (
                          <Medal className="w-4 h-4 text-amber-700 fill-amber-700" />
                        )}
                        <span className="tabular-nums font-extrabold text-sm">
                          #{entry.rank}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{entry.username}</span>
                        {isYou && (
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-500">{entry.college}</td>

                    <td className="py-4 px-6 text-right tabular-nums font-semibold text-slate-800">
                      {entry.wasteRecycledKg} kg
                    </td>

                    <td className="py-4 px-6 text-right tabular-nums font-semibold text-teal-800">
                      {entry.itemsDonated} units
                    </td>

                    <td className="py-4 px-6 text-right tabular-nums font-extrabold text-emerald-700 text-sm">
                      {entry.points.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
