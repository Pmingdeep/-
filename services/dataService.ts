import { User, ScheduleEvent, EventType } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Taylor Swift',
    role: '国际巨星',
    avatar: 'https://picsum.photos/200/200?random=1',
    bio: '正在进行 Eras Tour 全球巡演。',
    themeColor: 'purple'
  },
  {
    id: 'u2',
    name: '张三',
    role: '计算机系大三学生',
    avatar: 'https://picsum.photos/200/200?random=2',
    bio: '努力学习数据库原理，准备考研。',
    themeColor: 'blue'
  },
  {
    id: 'u3',
    name: 'Elon Musk',
    role: '科技大亨',
    avatar: 'https://picsum.photos/200/200?random=3',
    bio: '忙着造火箭和管理社交媒体。',
    themeColor: 'slate'
  }
];

const MOCK_EVENTS: ScheduleEvent[] = [
  // Taylor's Events
  {
    id: 'e1',
    userId: 'u1',
    title: 'Eras Tour - 东京站 Day 1',
    type: EventType.CONCERT,
    startTime: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(22, 0, 0, 0)).toISOString(),
    location: '东京巨蛋',
    description: '巡回演唱会第45场，记得带吉他。'
  },
  {
    id: 'e2',
    userId: 'u1',
    title: '新专辑录音',
    type: EventType.PERSONAL,
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Just rough time
    location: 'Electric Lady Studios',
    description: '录制 Midnight 后续曲目。'
  },
  // Zhang San's Events
  {
    id: 'e3',
    userId: 'u2',
    title: '数据库原理及应用 - 讲座',
    type: EventType.CLASS,
    startTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(9, 40, 0, 0)).toISOString(),
    location: '第三教学楼 302',
    description: 'MySQL索引优化章节。'
  },
  {
    id: 'e4',
    userId: 'u2',
    title: '高数复习',
    type: EventType.CLASS,
    startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    location: '图书馆 4F',
    description: '微积分下册复习。'
  },
  // Elon's Events
  {
    id: 'e5',
    userId: 'u3',
    title: 'Starship 发射会议',
    type: EventType.MEETING,
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    location: 'Starbase, Texas',
    description: '审查发动机静态点火数据。'
  }
];

// Service Class to simulate Database Operations
class DataService {
  private users: User[] = MOCK_USERS;
  private events: ScheduleEvent[] = MOCK_EVENTS;

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getEventsByUserId(userId: string): ScheduleEvent[] {
    return this.events
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  addEvent(event: Omit<ScheduleEvent, 'id'>): ScheduleEvent {
    const newEvent: ScheduleEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.events = [...this.events, newEvent];
    return newEvent;
  }

  deleteEvent(id: string): void {
    this.events = this.events.filter(e => e.id !== id);
  }
  
  // This is for AI generated bulk import
  addEvents(events: Omit<ScheduleEvent, 'id'>[]): void {
      events.forEach(e => this.addEvent(e));
  }
}

export const dataService = new DataService();