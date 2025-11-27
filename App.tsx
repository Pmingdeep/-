import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { EventCard } from './components/EventCard';
import { AIScheduleModal } from './components/AIScheduleModal';
import { dataService } from './services/dataService';
import { generateSmartSchedule } from './services/geminiService';
import { User, ScheduleEvent, EventType } from './types';
import { Menu, Plus, Calendar, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');

  // Initialization
  useEffect(() => {
    const loadedUsers = dataService.getUsers();
    setUsers(loadedUsers);
    if (loadedUsers.length > 0) {
      setActiveUserId(loadedUsers[0].id);
    }
  }, []);

  // Fetch events when active user changes
  useEffect(() => {
    if (activeUserId) {
      const userEvents = dataService.getEventsByUserId(activeUserId);
      setEvents(userEvents);
    }
  }, [activeUserId]);

  const activeUser = users.find(u => u.id === activeUserId);

  const handleAIResponse = async (prompt: string) => {
    if (!activeUser) return;
    
    setIsGenerating(true);
    try {
      // 1. Generate events using Gemini
      const generatedEvents = await generateSmartSchedule(prompt, `Role: ${activeUser.role}, Bio: ${activeUser.bio}`);
      
      // 2. Add userId to events and save to "database"
      const eventsWithUser = generatedEvents.map((e: any) => ({
        ...e,
        userId: activeUserId
      }));
      
      dataService.addEvents(eventsWithUser);
      
      // 3. Refresh view
      const updatedEvents = dataService.getEventsByUserId(activeUserId);
      setEvents(updatedEvents);
      setIsAIModalOpen(false);
    } catch (error) {
      alert('生成失败，请检查 API Key 或重试');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Group events by date for better display
  const groupedEvents = events.reduce((acc, event) => {
    if (filterType !== 'all' && event.type !== filterType) return acc;
    
    const dateKey = new Date(event.startTime).toLocaleDateString('zh-CN', { 
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  const handleSwitchUser = (id: string) => {
      setActiveUserId(id);
      setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:translate-x-0 md:relative md:flex md:flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar 
            users={users} 
            activeUserId={activeUserId} 
            onSwitchUser={handleSwitchUser} 
            onOpenAIModal={() => {
                setIsAIModalOpen(true);
                setIsSidebarOpen(false);
            }} 
         />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                <Menu className="w-6 h-6" />
            </button>
            
            {activeUser && (
                <div className="flex items-center space-x-3">
                    <img src={activeUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">{activeUser.name}</h1>
                        <p className="text-sm text-gray-500 mt-1">{activeUser.role}</p>
                    </div>
                </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
             {/* Filter Dropdown (Simplified) */}
             <div className="relative hidden sm:block">
                 <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as EventType | 'all')}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                     <option value="all">所有类型</option>
                     {Object.values(EventType).map(t => (
                         <option key={t} value={t}>{t}</option>
                     ))}
                 </select>
                 <Filter className="w-4 h-4 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
             </div>

            <button 
                onClick={() => setIsAIModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center"
            >
                <Plus className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">新增行程</span>
                <span className="sm:hidden">新增</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 max-w-7xl mx-auto">
          
          {/* Stats / Bio Card */}
          {activeUser && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">关于 {activeUser.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{activeUser.bio}</p>
              </div>
          )}

          {/* Events Grid */}
          {Object.keys(groupedEvents).length === 0 ? (
              <div className="text-center py-20">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">暂无行程安排</h3>
                  <p className="text-gray-500 mt-1 mb-6">数据库中没有找到当前用户的行程记录。</p>
                  <button 
                    onClick={() => setIsAIModalOpen(true)}
                    className="text-indigo-600 font-medium hover:text-indigo-800"
                  >
                      使用 AI 快速生成 →
                  </button>
              </div>
          ) : (
            <div className="space-y-8">
                {Object.entries(groupedEvents).map(([date, dayEvents]) => (
                <div key={date}>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                        {date}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(dayEvents as ScheduleEvent[]).map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                    </div>
                </div>
                ))}
            </div>
          )}
        </main>
      </div>

      <AIScheduleModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIResponse}
        isLoading={isGenerating}
      />
    </div>
  );
};

export default App;