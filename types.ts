export enum EventType {
  CONCERT = 'concert',
  CLASS = 'class',
  MEETING = 'meeting',
  TRAVEL = 'travel',
  PERSONAL = 'personal',
  OTHER = 'other'
}

export interface User {
  id: string;
  name: string;
  role: string; // e.g., "Student", "Artist", "CEO"
  avatar: string;
  bio: string;
  themeColor: string;
}

export interface ScheduleEvent {
  id: string;
  userId: string;
  title: string;
  type: EventType;
  startTime: string; // ISO string
  endTime: string; // ISO string
  location: string;
  description?: string;
}

// Helper to get color for event type
export const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case EventType.CONCERT: return 'bg-purple-100 text-purple-800 border-purple-200';
    case EventType.CLASS: return 'bg-blue-100 text-blue-800 border-blue-200';
    case EventType.MEETING: return 'bg-orange-100 text-orange-800 border-orange-200';
    case EventType.TRAVEL: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case EventType.PERSONAL: return 'bg-pink-100 text-pink-800 border-pink-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getEventTypeLabel = (type: EventType): string => {
  switch (type) {
    case EventType.CONCERT: return '演唱会 / 演出';
    case EventType.CLASS: return '课程';
    case EventType.MEETING: return '会议 / 商务';
    case EventType.TRAVEL: return '差旅';
    case EventType.PERSONAL: return '私人行程';
    default: return '其他';
  }
};