export type EventType = 'event' | 'view' | 'error';

export interface BaseEvent {
  id: string;
  timestamp: number;
  type: EventType;
  name: string;
  payload?: Record<string, any>;
  provider: string;
}

export interface DebuggerConfig {
  enabled: boolean;
  maxEvents?: number;
  desktopSync?: boolean;
  desktopIp?: string;
  desktopPort?: number;
}
