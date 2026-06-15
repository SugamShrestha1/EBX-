import axios from "axios";
const BASE_URL = import.meta?.env?.VITE_API_BASE_URL;
import { useSessionStore } from "./pages/session/useSessionStore";
import config from "./config/config";
import { refreshAuthToken } from "./hooks/useAuthApi";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const APIAuthHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

export const APIAuthHeaders2 = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const APIMultipartHeaders2 = () => {
  const token = localStorage.getItem("token");
  return {
    // "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${access}`,
  };
};

export const APIAuthHeadersForFormData = () => {
  const { access } = useSessionStore.getState();

  if (!access) {
    console.warn('APIAuthHeadersForFormData: No token found in store');
    return {
      Accept: "application/json",
    };
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${access}`,
  };
};


export const smsReportAPIHeaders = () => {
  return {
    Accept: "*/*",
    "Content-Type": "application/json",
    "x-api-key": `${config?.smsReportAPIKey}`,
  };
}


// Interceptor to handle token expiration and refresh
api.interceptors.request.use(
  async (config) => {
    const { access, authExpiry, refresh, refreshExpiry, setSession, clearSession } = useSessionStore.getState();
    const currentTime = Math.floor(Date.now() / 1000);

    // ✅ Add 30 second buffer — refresh token BEFORE it expires
    const isAccessTokenExpired = access && authExpiry && currentTime > (authExpiry - 30);
    const isRefreshTokenValid = refresh && refreshExpiry && currentTime < refreshExpiry;

    if (isAccessTokenExpired) {
      if (isRefreshTokenValid) {
        try {
          // 🔁 Refresh token BEFORE calling the feature API
          const newTokenData = await refreshAuthToken();

          if (newTokenData?.access) {
            setSession({
              access: newTokenData.access,
              authExpiry: newTokenData.authExpiry,
              refresh: newTokenData.refresh ?? refresh,
              refreshExpiry: newTokenData.refreshExpiry ?? refreshExpiry,
            });

            // ✅ Attach fresh token — feature API call proceeds with new token
            config.headers.Authorization = `Bearer ${newTokenData.access}`;
          }
        } catch (error) {
          // ❌ Refresh failed — block the feature API call entirely
          clearSession();
          window.location.href = "/login";
          return Promise.reject(new Error("Session expired. Please log in again."));
        }
      } else {
        // ❌ Both tokens expired — block the feature API call entirely
        clearSession();
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    } else if (access) {
      // ✅ Token still valid — attach it directly
      config.headers.Authorization = `Bearer ${access}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refresh, refreshExpiry, setSession, clearSession } = useSessionStore.getState();
      const currentTime = Math.floor(Date.now() / 1000);

      // Try to refresh token if refresh token is still valid
      if (refresh && refreshExpiry && currentTime < refreshExpiry) {
        try {
          console.log("401 Error: Attempting token refresh...");
          const newTokenData = await refreshAuthToken();

          if (newTokenData?.access) {
            setSession({
              access: newTokenData.access,
              authExpiry: newTokenData.authExpiry,
              refresh: newTokenData.refresh ?? refresh,
              refreshExpiry: newTokenData.refreshExpiry ?? refreshExpiry,
            });

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokenData.access}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed on 401:", refreshError);
          clearSession();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        clearSession();
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired"));
      }
    }

    return Promise.reject(error);
  }
);

// Error handling function
const handleError = (error) => {
  if (error.response) {
  } else if (error.request) {
  } else {
  }
  throw error;
};

// Exports for making HTTP requests
export const get = async ({ endpoint, params = {}, responseType = "json" }) => {
  try {
    const response = await api.get(endpoint, {
      params,
      responseType, // Accept different response types (JSON, blob, text)
    });
    return responseType === "json" ? response.data : response; // Return raw response if not JSON
  } catch (error) {
    handleError(error);
    throw error; // Ensure error is caught in the calling function
  }
};

export const post = async ({
  endpoint,
  params = {},
  data = {},
  responseType = "json",
  headers = {},
}) => {
  try {
    const response = await api.post(endpoint, data, {
      headers: APIAuthHeaders(),
      responseType: responseType
    });
    if (response.status === 200) {
      return response.data;
    }
    return response;
  } catch (error) {

    handleError(error);
    throw error;
  }
};

export const getExport = async ({
  endpoint,
  params = {},
  responseType = "json",
}) => {

  try {
    const response = await api.get(endpoint, {
      params,
      headers: APIAuthHeaders2(),
    });
    return response;
  } catch (error) {
    handleError(error);
    throw error; // Ensure error is caught in the calling function
  }
};

export const postExport = async ({
  endpoint,
  params = {},
  data = {},
  responseType = "json",
}) => {

  try {
    const response = await api.post(endpoint, data, {
      responseType: responseType
    });
    if (response.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const put = async ({ endpoint, params = {}, data = {} }) => {
  const headers =
    data instanceof FormData
      ? APIMultipartHeaders2()
      : APIAuthHeaders2()
  try {
    const response = await api.put(endpoint, data, { headers });
    if (response.status === 200) {
      return response.data;
    }
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const patch = async ({ endpoint, params = {}, data = {} }) => {
  const isFormData = data instanceof FormData;

  const headers = isFormData
    ? APIAuthHeadersForFormData()
    : { "Content-Type": "application/json", ...APIAuthHeaders2() };

  try {
    const response = await api.patch(endpoint, data, { headers, params });
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const del = async ({ endpoint, params = {} }) => {
  try {
    const response = await api.delete(endpoint, { headers: APIAuthHeaders2() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default api;
