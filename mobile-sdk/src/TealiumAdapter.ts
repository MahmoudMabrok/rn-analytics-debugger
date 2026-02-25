import { AnalyticsProvider } from './AnalyticsProvider';
import { AnalyticsDebugger } from './AnalyticsDebugger';

export interface TealiumTrackRequest {
    type: string;
    eventName?: string;
    viewName?: string;
    data?: Record<string, any>;
    [key: string]: any;
}

export interface TealiumInstance {
    track: (request: TealiumTrackRequest) => void;
    [key: string]: any;
}

/**
 * Wraps an existing Tealium instance so that all `.track()` calls
 * are automatically intercepted and logged to the debugger.
 *
 * Client code does NOT change — they keep calling `tealium.track()` as before.
 *
 * Usage:
 *   import { wrapTealium } from 'rn-analytics-debugger';
 *   const tealium = wrapTealium(originalTealiumInstance);
 *   // Now pass `tealium` everywhere — all calls are automatically captured.
 */
export function wrapTealium(instance: TealiumInstance): TealiumInstance {
    const originalTrack = instance.track.bind(instance);

    instance.track = (request: TealiumTrackRequest) => {
        const eventType = (request.type || '').toUpperCase();
        const isView = eventType === 'VIEW';
        const name = isView ? request.viewName : request.eventName;

        // Log to debugger
        AnalyticsDebugger.getInstance().logEvent({
            name: name || 'Unknown',
            type: isView ? 'view' : 'event',
            payload: request.data || request,
            provider: 'Tealium',
        });

        // Forward to original Tealium SDK
        try {
            originalTrack(request);
        } catch (e: any) {
            AnalyticsDebugger.getInstance().logEvent({
                name: 'Tealium Error',
                type: 'error',
                payload: { error: e.message, originalRequest: request },
                provider: 'Tealium',
            });
        }
    };

    return instance;
}

/**
 * TealiumAdapter class for cases where you want to use the
 * AnalyticsProvider interface directly (e.g. for future adapters).
 */
export class TealiumAdapter implements AnalyticsProvider {
    readonly name = 'Tealium';
    private tealium?: TealiumInstance;

    constructor(tealiumInstance?: TealiumInstance) {
        this.tealium = tealiumInstance;
    }

    trackEvent(eventName: string, payload?: Record<string, any>) {
        AnalyticsDebugger.getInstance().logEvent({
            name: eventName,
            type: 'event',
            payload,
            provider: this.name,
        });

        try {
            if (this.tealium) {
                this.tealium.track({ type: 'EVENT', eventName, data: payload });
            }
        } catch (e: any) {
            AnalyticsDebugger.getInstance().logEvent({
                name: 'Tealium Error',
                type: 'error',
                payload: { error: e.message },
                provider: this.name,
            });
        }
    }

    trackView(viewName: string, payload?: Record<string, any>) {
        AnalyticsDebugger.getInstance().logEvent({
            name: viewName,
            type: 'view',
            payload,
            provider: this.name,
        });

        try {
            if (this.tealium) {
                this.tealium.track({ type: 'VIEW', viewName, data: payload });
            }
        } catch (e: any) {
            AnalyticsDebugger.getInstance().logEvent({
                name: 'Tealium Error',
                type: 'error',
                payload: { error: e.message },
                provider: this.name,
            });
        }
    }
}
