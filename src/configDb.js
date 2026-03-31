// Config DB client — stores dashboard configurations in a separate Supabase instance.
// Table lives in dashboard_config schema; RPCs in public schema (SECURITY DEFINER).
import { storageGet, storageSet } from './storage.js';

const CONFIG_DB_URL = 'https://ash-infra-vm.eastus.cloudapp.azure.com';
const CONFIG_DB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzM1Njg5NjAwLCJleHAiOjE4OTM0NTYwMDB9.yLBvNnhPQk0WIq82mIdsvoIwnjpOylqo8dxk6VmgYP0';

// --- Nanoid (no dependency) ---
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function nanoid(size = 12) {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  let id = '';
  for (let i = 0; i < size; i++) id += ALPHABET[bytes[i] & 63];
  return id;
}

// --- RPC caller ---
function callConfigRpc(fnName, params) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  return fetch(CONFIG_DB_URL + '/rest/v1/rpc/' + fnName, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': CONFIG_DB_ANON_KEY,
      'Authorization': 'Bearer ' + CONFIG_DB_ANON_KEY,
    },
    body: JSON.stringify(params),
    signal: controller.signal,
  })
    .then(res => {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Config DB RPC ' + fnName + ' returned ' + res.status);
      return res.text();
    })
    .then(text => text ? JSON.parse(text) : null);
}

// --- CRUD operations ---

export function fetchConfig(id) {
  return callConfigRpc('get_dashboard_config', { p_id: id });
}

export function createConfig({ name, connectionJson, tabsJson }) {
  const id = nanoid(12);
  const editSecret = nanoid(21);
  return callConfigRpc('create_dashboard_config', {
    p_id: id,
    p_edit_secret: editSecret,
    p_name: name || null,
    p_connection_json: connectionJson,
    p_tabs_json: tabsJson,
  }).then(() => ({ id, editSecret }));
}

export function updateConfig(id, editSecret, { tabsJson, name }) {
  const params = { p_id: id, p_edit_secret: editSecret };
  if (tabsJson !== undefined) params.p_tabs_json = tabsJson;
  if (name !== undefined) params.p_name = name;
  return callConfigRpc('update_dashboard_config', params);
}

export function deleteConfig(id, editSecret) {
  return callConfigRpc('delete_dashboard_config', { p_id: id, p_edit_secret: editSecret });
}

// --- Edit secret (localStorage) ---

export function getEditSecret(configId) {
  return storageGet('configEditSecret_' + configId);
}

export function setEditSecret(configId, secret) {
  storageSet('configEditSecret_' + configId, secret);
}

export function isCreator(configId) {
  return !!getEditSecret(configId);
}
