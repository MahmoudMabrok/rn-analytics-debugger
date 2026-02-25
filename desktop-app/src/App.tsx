import { useState, useEffect } from 'react';
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

function App() {
  const [events, setEvents] = useState<BaseEvent[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleEvent = (_event: any, message: string) => {
      try {
        const parsed = JSON.parse(message) as BaseEvent;
        setEvents((prev) => [parsed, ...prev].slice(0, 1000));
      } catch (e) {
        console.error('Failed to parse event', e);
      }
    };

    ipcRenderer.on('analytics-event', handleEvent);
    return () => {
      ipcRenderer.removeListener('analytics-event', handleEvent);
    };
  }, []);

  const getTypeColor = (type: string) => {
    if (type === 'event') return '#007AFF';
    if (type === 'view') return '#34C759';
    return '#FF3B30';
  };

  const filtered = events.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: '#1E1E1E', color: '#FFF', minHeight: '100vh', padding: 20 }}>
      <h2>Analytics Debugger (Desktop)</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, background: '#333', color: '#fff', border: 'none', borderRadius: 4 }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8, background: '#333', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          <option value="all">All</option>
          <option value="event">Events</option>
          <option value="view">Views</option>
          <option value="error">Errors</option>
        </select>
        <button
          onClick={() => setEvents([])}
          style={{ padding: 8, background: '#cc0000', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(e => (
          <div key={e.id} style={{ background: '#252526', padding: 10, borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 5 }}>
              <span style={{ color: '#888' }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
              <span style={{ background: getTypeColor(e.type), padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                {e.type.toUpperCase()}
              </span>
              <strong>{e.name}</strong>
            </div>
            {e.payload && (
              <pre style={{ margin: 0, padding: 10, background: '#1E1E1E', borderRadius: 4, overflowX: 'auto', fontSize: 12 }}>
                {JSON.stringify(e.payload, null, 2)}
              </pre>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: '#888' }}>Waiting for events from Mobile app...</div>}
      </div>
    </div>
  );
}

export default App;
