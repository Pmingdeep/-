import React from 'react';
import { ScheduleEvent, getEventTypeColor, getEventTypeLabel } from '../types';
import { MapPin, Clock } from 'lucide-react';

interface EventCardProps {
  event: ScheduleEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  
  const timeStr = startDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = endDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${getEventTypeColor(event.type).split(' ')[0].replace('bg-', 'bg-')}`}></div>
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit mb-2 ${getEventTypeColor(event.type)}`}>
            {getEventTypeLabel(event.type)}
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {event.title}
            </h3>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
        {event.description || "暂无详细描述"}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-50 pt-3 mt-auto">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-4 h-4" />
          <span>{timeStr} - {endTimeStr}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-4 h-4" />
          <span className="truncate max-w-[100px]">{event.location}</span>
        </div>
      </div>
    </div>
  );
};