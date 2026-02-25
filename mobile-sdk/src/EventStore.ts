import { BaseEvent } from './types';

export class EventStore {
    private events: BaseEvent[] = [];
    private listeners: Set<(events: BaseEvent[]) => void> = new Set();
    private maxEvents: number;

    constructor(maxEvents: number = 1000) {
        this.maxEvents = maxEvents;
    }

    addEvent(event: BaseEvent) {
        this.events.unshift(event); // Add to beginning
        if (this.events.length > this.maxEvents) {
            this.events.pop(); // Remove oldest
        }
        this.notifyListeners();
    }

    getEvents(): BaseEvent[] {
        return this.events;
    }

    clearEvents() {
        this.events = [];
        this.notifyListeners();
    }

    subscribe(listener: (events: BaseEvent[]) => void): () => void {
        this.listeners.add(listener);
        listener(this.events); // Initial call with current events
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach((listener) => listener(this.events));
    }
}
