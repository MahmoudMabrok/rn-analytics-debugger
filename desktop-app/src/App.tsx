import { useState, useEffect, useRef } from 'react';
import './App.css';
const { ipcRenderer } = window.require('electron');

interface BaseEvent {
  id: string;
  timestamp: number;
  type: 'event' | 'view' | 'error';
  name: string;
  payload?: any;
  provider: string;
}

type FilterType = 'all' | 'event' | 'view' | 'error';

function App() {
  const [events, setEvents] = useState<BaseEvent[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [wsStatus, setWsStatus] = useState<'waiting' | 'connected' | 'disconnected'>('waiting');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const handleEvent = (_event: any, message: string) => {
      if (pausedRef.current) return;
      try {
        const parsed = JSON.parse(message) as BaseEvent;
        setEvents((prev) => [parsed, ...prev].slice(0, 1000));
      } catch (e) {
        console.error('Failed to parse event', e);
      }
    };

    const handleStatus = (_event: any, status: string) => {
      setWsStatus(status as any);
    };

    ipcRenderer.on('analytics-event', handleEvent);
    ipcRenderer.on('ws-status', handleStatus);
    return () => {
      ipcRenderer.removeListener('analytics-event', handleEvent);
      ipcRenderer.removeListener('ws-status', handleStatus);
    };
  }, []);

  const getTypeColor = (type: string) => {
    if (type === 'event') return '#3B82F6';
    if (type === 'view') return '#10B981';
    return '#EF4444';
  };

  const getStatusInfo = () => {
    if (wsStatus === 'connected') return { color: '#10B981', text: '● Connected' };
    if (wsStatus === 'disconnected') return { color: '#EF4444', text: '● Disconnected' };
    return { color: '#F59E0B', text: '● Waiting for device...' };
  };

  const filtered = events.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusInfo = getStatusInfo();
  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Events', value: 'event' },
    { label: 'Views', value: 'view' },
    { label: 'Errors', value: 'error' },
  ];

  const counts = {
    all: events.length,
    event: events.filter(e => e.type === 'event').length,
    view: events.filter(e => e.type === 'view').length,
    error: events.filter(e => e.type === 'error').length,
  };

  return (
    <div className="app">
      {/* Draggable Title Bar */}
      <div className="titlebar">
        <div className="titlebar-drag" />
        <div className="titlebar-content">
          <div className="app-title">
            <span className="app-icon">📊</span>
            <span>Analytics Debugger</span>
          </div>
          <div className="ws-status" style={{ color: statusInfo.color }}>
            {statusInfo.text}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="filter-group">
          {filterButtons.map(f => (
            <button
              key={f.value}
              className={`filter-btn ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              <span className="filter-count">{counts[f.value]}</span>
            </button>
          ))}
        </div>

        <div className="action-group">
          <button
            className={`action-btn ${isPaused ? 'paused' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button className="action-btn danger" onClick={() => setEvents([])}>
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Event List */}
      <div className="event-list" ref={listRef}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📡</div>
            <h3>No events yet</h3>
            <p>Waiting for events from your React Native app...</p>
            <p className="empty-hint">
              Make sure your mobile app is initialized with <code>desktopSync: true</code> and pointing to this machine's IP.
            </p>
          </div>
        ) : (
          filtered.map(e => (
            <div
              key={e.id}
              className={`event-card ${expandedId === e.id ? 'expanded' : ''}`}
              onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
            >
              <div className="event-header">
                <span className="event-time">
                  {new Date(e.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="event-type-badge" style={{ backgroundColor: getTypeColor(e.type) }}>
                  {e.type.toUpperCase()}
                </span>
                <span className="event-name">{e.name}</span>
                <span className="event-provider">{e.provider}</span>
                <span className="event-expand-icon">{expandedId === e.id ? '▾' : '▸'}</span>
              </div>
              {expandedId === e.id && e.payload && (
                <div className="event-payload">
                  <pre>{JSON.stringify(e.payload, null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <span>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
        <span>WebSocket :8080</span>
        {isPaused && <span className="paused-indicator">⏸ PAUSED</span>}
      </div>
    </div>
  );
}

export default App;
