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


// everything below is not in use after the refactored api calls using tanstack query 
// Interceptor to handle token expiration and refresh
api.interceptors.request.use(
  async (config) => {
    const {
      access,
      authExpiry,
      refresh,
      refreshExpiry,
      setSession,
      clearSession,
    } = useSessionStore.getState(); // direct access to store values without hook

    let token = access;
    const currentTime = Math.floor(Date.now() / 1000);

    // Access token expired?
    if (token && authExpiry && currentTime > authExpiry) {
      console.log("Access token expired");

      // Refresh token still valid?
      if (refresh && refreshExpiry && currentTime < refreshExpiry) {
        console.log("Access token expired but refresh token is still valid");

        // Try to refresh
        const newToken = await refreshAuthToken();

        if (newToken) {
          token = newToken.access;
          setSession({
            access: newToken.access,
            authExpiry: newToken.authExpiry,
            refresh: newToken.refresh ?? refresh,
            refreshExpiry: newToken.refreshExpiry ?? refreshExpiry,
          });
        } else {
          console.log("Failed to refresh token. Logging out.");
          clearSession();
          logout();
          window.location.href = "/login";
          return Promise.reject(
            new Error("Session expired. Please log in again.")
          );
        }
      } else {
        // Both tokens expired
        console.log("Both access and refresh tokens are expired");
        clearSession();
        window.location.href = "/login";
        return Promise.reject(
          new Error("Session expired. Please log in again.")
        );
      }
    }

    // Attach token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No valid token found");
      clearSession();
    }
   
    if ((config.data instanceof FormData)) {
    //   config.headers["Content-Type"] = "application/json";
    // } else {
    
      if (config.headers["Content-Type"]) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
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
