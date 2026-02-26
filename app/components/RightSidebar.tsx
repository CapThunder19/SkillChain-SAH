'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Bell, Settings, Users, ChevronRight } from 'lucide-react';

export default function RightSidebar() {
  const { connected, publicKey } = useWallet();

  const activityData = [
    { month: 'Jan', hours: 2.5 },
    { month: 'Feb', hours: 3.2 },
    { month: 'Aug', hours: 4.1 },
    { month: 'Sep', hours: 3.8 },
    { month: 'Oct', hours: 2.9 },
    { month: 'Nov', hours: 3.5 },
    { month: 'Dec', hours: 4.2 },
  ];

  const maxHours = Math.max(...activityData.map(d => d.hours));

  return (
    <aside className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-[var(--border)] p-6 overflow-y-auto z-50 hidden lg:block">
      {/* Header */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={20} className="text-gray-600" />
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>

      {/* User Profile */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 mb-6">
        {connected ? (
          <>
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md">
                {publicKey?.toString().slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
              </h3>
            </div>

            {/* Friends */}
            <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-200">
              <Users size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600">274 Friends</span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </>
        ) : (
          <div className="text-center">
            <WalletMultiButton />
          </div>
        )}
      </div>

      {/* Activity Chart */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 mb-6">
        <div className="mb-5">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Activity</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-3xl font-bold text-gray-900">3.5h</p>
            <select className="text-xs text-gray-500 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none">
              <option>Year</option>
              <option>Month</option>
              <option>Week</option>
            </select>
          </div>
          <span className="inline-flex items-center text-xs text-emerald-600 font-semibold">
            ✨ Great result!
          </span>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-1.5 h-28">
          {activityData.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-lg transition-all"
                  style={{
                    height: `${(data.hours / maxHours) * 100}%`,
                    background: index === activityData.length - 1
                      ? 'linear-gradient(to top, #a78bfa, #60a5fa, #34d399, #fbbf24)'
                      : '#d1d5db',
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">My courses</h3>
        
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-rose-200 to-pink-300 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-sm">💻</span>
                <span className="text-xs font-medium text-gray-700">IT & Software</span>
              </div>
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-xs font-bold text-gray-900">⭐ 4.8</span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
              Flutter Masterclass (Dart, APIs, Firebase & More)
            </h4>
            <p className="text-xs text-gray-700 font-medium">5,530 students</p>
            <div className="flex -space-x-2 mt-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-200 to-amber-300 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-sm">💼</span>
                <span className="text-xs font-medium text-gray-700">Business</span>
              </div>
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-xs font-bold text-gray-900">⭐ 4.9</span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
              Business Writing Essentials
            </h4>
            <p className="text-xs text-gray-700 font-medium">1,683 students</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
