export interface AnalyticsProvider {
    /**
     * Name of the provider (e.g., 'Tealium', 'Firebase')
     */
    readonly name: string;

    /**
     * Track a standard event
     */
    trackEvent(eventName: string, payload?: Record<string, any>): void;

    /**
     * Track a screen/page view
     */
    trackView(viewName: string, payload?: Record<string, any>): void;
}
