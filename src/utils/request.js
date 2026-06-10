// @ts-nocheck

import config from '../config/config';

// import { showNotification } from "./alert";


/** Parse JSON response */
function parseJSON(response) {
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param {object} response A response from a network request
 * @return {object|undefined} Returns either the response, or throws an error
 */
export async function checkStatus(response) {
  if (!response.ok) {
    let data = null;
    try {
      data = await response.json(); // read backend response
    } catch (e) {
      data = null; // fallback if response is empty or invalid JSON
    }

    // Throw an object mimicking Axios error
    throw {
      response: {
        status: response.status,
        data,
      },
    };
  }
  return response; // for 2xx
}

// async function checkStatus(response) {
//   if (!response.ok) {
//     console.log(response,'check status');
//     throw new Error(`Request failed with status: ${response.status}`);
//   }
//   return response;
// }
/**
 * Requests a URL, returning a promise
 *
 * @param {string} url The URL we want to request
 * @param {object} [options] The options we want to pass to "fetch"
 * @return {object} The response data
 */
export async function request(url, options) {
  try {
    const response = await fetch(url, options);
    await checkStatus(response); // Check if the status is OK
    return parseJSON(response); // Parse the JSON response
  } catch (error) {
    console.error("Request failed:-----", error?.details);
    // showNotification("error", "Error", "API Request Failed.");
    throw error; // Re-throw the error for the caller to handle
  }
}

const REFRESH_URL = `${config.baseURL}/api/v1/auth/token/refresh/`;

let refreshingPromise = null;

async function updateSessionStore(tokens) {
  try {
    const { useSessionStore } = await import('../pages/session/useSessionStore');
    useSessionStore.getState().setSession(tokens);
  } catch (error) {
    // Session store may not be available during bootstrapping; localStorage is still enough.
  }
}

async function refreshToken() {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    // No refresh token available — force user to login
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('ebxdata');
    window.location.href = '/login';
    return null;
  }

  let response;
  try {
    response = await fetchWithTimeout(REFRESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
    });
  } catch (err) {
    // Network error or timeout — clear and force login
    console.error('Refresh token request failed:', err);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('ebxdata');
    window.location.href = '/login';
    return null;
  }

  if (!response.ok) {
    // Refresh failed (invalid/expired refresh token) — clear storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('ebxdata');
    window.location.href = '/login';
    return null;
  }

  const payload = await response.json().catch(() => null);
  const data = payload?.data ?? payload;
  const access = data?.access ?? null;
  const newRefresh = data?.refresh ?? null;
  const authExpiry = data?.authExpiry ?? null;
  const refreshExpiry = data?.refreshExpiry ?? null;

  if (access) {
    localStorage.setItem('token', access);
  }
  if (newRefresh) {
    localStorage.setItem('refresh_token', newRefresh);
  }

  await updateSessionStore({
    access,
    refresh: newRefresh ?? localStorage.getItem('refresh_token'),
    authExpiry,
    refreshExpiry,
  });

  return data;
}

async function getRefreshedToken() {
  if (!refreshingPromise) {
    refreshingPromise = refreshToken().finally(() => {
      refreshingPromise = null;
    });
  }
  return refreshingPromise;
}

/**
 * A wrapper function for fetch with timeout support
 * @param {string} url The URL we want to request
 * @param {object} [options] The options we want to pass to "fetch"
 * @return {object} The response data
 */
export async function requestApi(url, options = {}) {
  const { timeout = 13000, headers = {}, noAuth = false, ...rest } = options;

  const buildHeaders = () => {
    const finalHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (!noAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        finalHeaders.Authorization = `Bearer ${token}`;
      }
    }

    return finalHeaders;
  };

  const doFetch = () =>
    fetchWithTimeout(url, { ...rest, headers: buildHeaders(), timeout });

  try {
    let response = await doFetch();

    if (!noAuth && response.status === 401) {
      const refreshed = await getRefreshedToken();
      if (!refreshed?.access) {
        throw { response: { status: 401, data: null } };
      }
      response = await fetchWithTimeout(url, {
        ...rest,
        headers: buildHeaders(),
        timeout,
      });
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw { response: { status: response.status, data } };
    }

    return response.json().catch(() => null);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Set timeout for the API call
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 13000 } = options; // Default timeout set to 6 seconds
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id); // Clear the timeout if the response is received before the timeout
    return response;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}
