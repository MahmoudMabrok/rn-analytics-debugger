import { EventStore } from './EventStore';
import { BaseEvent } from './types';

describe('EventStore', () => {
    it('adds events and notifies subscribers', () => {
        const store = new EventStore(10);
        const mockListener = jest.fn();

        store.subscribe(mockListener);
        // initial call
        expect(mockListener).toHaveBeenCalledWith([]);

        const mockEvent: BaseEvent = {
            id: '1',
            timestamp: Date.now(),
            name: 'test_event',
            type: 'event',
            provider: 'TestProvider'
        };

        store.addEvent(mockEvent);

        expect(mockListener).toHaveBeenCalledWith([mockEvent]);
        expect(store.getEvents().length).toBe(1);
    });

    it('respects maxEvents limit', () => {
        const limit = 5;
        const store = new EventStore(limit);

        for (let i = 0; i < 10; i++) {
            store.addEvent({
                id: i.toString(),
                timestamp: Date.now(),
                name: `event_${i}`,
                type: 'event',
                provider: 'TestProvider'
            });
        }

        const events = store.getEvents();
        expect(events.length).toBe(limit);
        // Since it unshifts, the 5 most recent should be 9, 8, 7, 6, 5
        expect(events[0].name).toBe('event_9');
        expect(events[limit - 1].name).toBe('event_5');
    });

    it('clears events', () => {
        const store = new EventStore();
        store.addEvent({
            id: '1',
            timestamp: Date.now(),
            name: 'test_event',
            type: 'event',
            provider: 'TestProvider'
        });

        expect(store.getEvents().length).toBe(1);
        store.clearEvents();
        expect(store.getEvents().length).toBe(0);
    });
});
