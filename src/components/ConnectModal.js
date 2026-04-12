// Connect to Database modal — test Supabase/dash-api connection, then
// persist a new config and redirect. Extracted from Analyzer_Demo.js.

import { createConfig, setEditSecret } from '../configDb.js';

const SUPABASE_FIELDS = [
  { key: 'supabaseUrl', label: 'Supabase URL', placeholder: 'https://your-project.supabase.co' },
  { key: 'apiKey', label: 'API Key (anon)', placeholder: 'eyJhbGciOi...', password: true },
  { key: 'dataset', label: 'Table (schema.table)', placeholder: 'public_analytics.fct_job_metrics' },
];

const FASTAPI_FIELDS = [
  { key: 'apiUrl', label: 'API URL', placeholder: 'https://your-server.com/dash-api' },
  { key: 'apiSecret', label: 'API Secret', placeholder: 'your-secret', password: true },
  { key: 'connection', label: 'Connection Name', placeholder: 'zbt' },
  { key: 'dataset', label: 'Table (schema.table)', placeholder: 'analytics.signals' },
];

export function ConnectModal({
  styles, isDarkMode,
  connectForm, setConnectForm,
  connectError, setConnectError,
  connectSaving, setConnectSaving,
  setShowConnectModal,
}) {
  const isSupabase = connectForm.connectionType !== 'fastapi';
  const fields = isSupabase ? SUPABASE_FIELDS : FASTAPI_FIELDS;
  const canSubmit = isSupabase
    ? connectForm.supabaseUrl && connectForm.apiKey && connectForm.dataset
    : connectForm.apiUrl && connectForm.apiSecret && connectForm.connection && connectForm.dataset;

  const handleConnect = async () => {
    setConnectError('');
    setConnectSaving(true);
    try {
      let connectionJson, testData;
      if (isSupabase) {
        const testRes = await fetch(connectForm.supabaseUrl.replace(/\/+$/, '') + '/rest/v1/rpc/query_dataset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': connectForm.apiKey, 'Authorization': 'Bearer ' + connectForm.apiKey },
          body: JSON.stringify({ p_table: connectForm.dataset, p_action: 'schema' }),
        });
        if (!testRes.ok) throw new Error('Connection failed (HTTP ' + testRes.status + '). Check your URL and API key.');
        testData = await testRes.json();
        if (testData.error) throw new Error(testData.error);
        connectionJson = { supabaseUrl: connectForm.supabaseUrl.replace(/\/+$/, ''), apiKey: connectForm.apiKey, dataset: connectForm.dataset };
      } else {
        const testRes = await fetch(connectForm.apiUrl.replace(/\/+$/, '') + '/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + connectForm.apiSecret },
          body: JSON.stringify({ connection: connectForm.connection, table: connectForm.dataset, action: 'schema' }),
        });
        if (!testRes.ok) {
          const errBody = await testRes.json().catch(() => ({}));
          throw new Error(errBody.detail || 'Connection failed (HTTP ' + testRes.status + ')');
        }
        testData = await testRes.json();
        if (testData.error) throw new Error(testData.error);
        connectionJson = { connectionType: 'fastapi', apiUrl: connectForm.apiUrl.replace(/\/+$/, ''), apiSecret: connectForm.apiSecret, connection: connectForm.connection, dataset: connectForm.dataset };
      }
      const tabsJson = [{ id: 'tab_1', name: connectForm.dataset, dataset: connectForm.dataset, metricConfig: null }];
      const result = await createConfig({ name: connectForm.dataset, connectionJson, tabsJson });
      setEditSecret(result.id, result.editSecret);
      window.location.hash = '#/' + result.id;
      window.location.reload();
    } catch (err) {
      setConnectError(err.message);
    }
    setConnectSaving(false);
  };

  return (
    <div style={styles.shareModal} onClick={e => { if (e.target === e.currentTarget) setShowConnectModal(false); }}>
      <div style={{ ...styles.shareModalContent, maxWidth: '440px' }}>
        <div style={styles.shareModalHeader}>
          <div style={styles.shareModalTitle}>Connect to Database</div>
          <button style={styles.shareModalClose} onClick={() => setShowConnectModal(false)}>×</button>
        </div>
        <div style={{ padding: '4px 0 16px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', padding: '2px', borderRadius: '8px', background: isDarkMode ? '#1f2937' : '#f3f4f6' }}>
            {[{ value: 'supabase', label: 'Supabase' }, { value: 'fastapi', label: 'Direct Postgres' }].map(opt => (
              <button key={opt.value}
                onClick={() => setConnectForm(prev => ({ ...prev, connectionType: opt.value }))}
                style={{
                  flex: 1, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  border: 'none',
                  background: connectForm.connectionType === opt.value ? (isDarkMode ? '#374151' : '#ffffff') : 'transparent',
                  color: connectForm.connectionType === opt.value ? (isDarkMode ? '#f3f4f6' : '#111827') : (isDarkMode ? '#9ca3af' : '#6b7280'),
                  boxShadow: connectForm.connectionType === opt.value ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >{opt.label}</button>
            ))}
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
            {isSupabase
              ? <>Requires the <code style={{ fontSize: '11px', padding: '1px 4px', borderRadius: '3px', background: isDarkMode ? '#1f2937' : '#f3f4f6' }}>query_dataset</code> RPC function (see setup.sql).</>
              : 'Connect via dash-api proxy to any Postgres database.'}
          </p>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: isDarkMode ? '#d1d5db' : '#374151' }}>{f.label}</label>
              <input
                type={f.password ? 'password' : 'text'}
                value={connectForm[f.key]}
                onChange={e => setConnectForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                  color: isDarkMode ? '#f3f4f6' : '#111827', outline: 'none',
                }}
              />
            </div>
          ))}
          {connectError && (
            <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '12px' }}>{connectError}</div>
          )}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowConnectModal(false)}
              style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                background: 'transparent', color: isDarkMode ? '#d1d5db' : '#374151',
              }}
            >Cancel</button>
            <button
              disabled={connectSaving || !canSubmit}
              onClick={handleConnect}
              style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600,
                border: 'none',
                background: !canSubmit ? (isDarkMode ? '#374151' : '#e5e7eb') : '#6366f1',
                color: !canSubmit ? (isDarkMode ? '#6b7280' : '#9ca3af') : '#ffffff',
                transition: 'background-color 0.15s ease',
              }}
            >{connectSaving ? 'Connecting...' : 'Connect & Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
