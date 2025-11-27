import React from 'react';
import { User } from '../types';
import { LayoutDashboard, CalendarDays, Settings, LogOut, PlusCircle } from 'lucide-react';

interface SidebarProps {
  users: User[];
  activeUserId: string;
  onSwitchUser: (id: string) => void;
  onOpenAIModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ users, activeUserId, onSwitchUser, onOpenAIModal }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm fixed left-0 top-0 z-20 hidden md:flex">
      <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <CalendarDays className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">ChronoPlan</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">当前身份</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onSwitchUser(user.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  activeUserId === user.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.role}</p>
                </div>
                {activeUserId === user.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">功能</h2>
          <nav className="space-y-1">
             <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group">
               <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
               <span className="text-sm font-medium">概览面板</span>
             </button>
             <button 
                onClick={onOpenAIModal}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group mt-2 bg-indigo-50/50"
             >
               <PlusCircle className="w-5 h-5 text-indigo-500" />
               <span className="text-sm font-medium">AI 智能排程</span>
             </button>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">退出登录</span>
        </button>
      </div>
    </div>
  );
};