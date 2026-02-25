import { BaseEvent, DebuggerConfig, EventType } from './types';
import { EventStore } from './EventStore';

export class AnalyticsDebugger {
    private static instance: AnalyticsDebugger;
    private store: EventStore;
    private config: DebuggerConfig;
    private ws: WebSocket | null = null;

    private constructor() {
        // Default configuration
        this.config = {
            enabled: false, // Disabled by default, wait for _DEV_ check or explicit enable
            maxEvents: 1000,
            desktopSync: false,
        };
        this.store = new EventStore(this.config.maxEvents);
    }

    public static getInstance(): AnalyticsDebugger {
        if (!AnalyticsDebugger.instance) {
            AnalyticsDebugger.instance = new AnalyticsDebugger();
        }
        return AnalyticsDebugger.instance;
    }

    public init(config: Partial<DebuggerConfig>) {
        this.config = { ...this.config, ...config };

        // Attempt Desktop Sync connection if enabled
        if (this.config.enabled && this.config.desktopSync && this.config.desktopIp) {
            this.connectWebSocket();
        }
    }

    public enableMobileUI(enabled: boolean) {
        this.config.enabled = enabled;
        // Disconnect websocket if disabled
        if (!enabled && this.ws) {
            this.ws.close();
            this.ws = null;
        } else if (enabled && this.config.desktopSync && this.config.desktopIp) {
            this.connectWebSocket();
        }
    }

    public isEnabled(): boolean {
        return this.config.enabled;
    }

    public getStore(): EventStore {
        return this.store;
    }

    public logEvent(data: Omit<BaseEvent, 'id' | 'timestamp'>) {
        if (!this.config.enabled) return;

        const event: BaseEvent = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            ...data,
        };

        this.store.addEvent(event);
        this.syncToDesktop(event);
    }

    private connectWebSocket() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        try {
            const port = this.config.desktopPort || 8080;
            this.ws = new WebSocket(`ws://${this.config.desktopIp}:${port}`);
            this.ws.onopen = () => {
                console.log('[AnalyticsDebugger] Connected to Desktop WebSocket');
            };
            this.ws.onerror = (e) => {
                console.error('[AnalyticsDebugger] WebSocket error', e);
            };
        } catch (e) {
            console.error('[AnalyticsDebugger] Exception connecting WebSocket', e);
        }
    }

    private syncToDesktop(event: BaseEvent) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(event));
        }
    }
}

export const enableMobileUI = (enabled: boolean) => AnalyticsDebugger.getInstance().enableMobileUI(enabled);
