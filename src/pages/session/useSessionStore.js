import { create } from "zustand";

const defaultProfile = {
  id: null,
  name: null,
  username: null,
  email: null,
  ph_no: null,
  country: null,
  is_active: null,
  is_supervisor: null,
  profile_pic: null,
  groups: null,
  permissions: null,
  channels: null,
  organization: {
    id: null,
    name: null,
    num: null,
    website: null,
    credit: null,
  },
};

const getEbxData = () => {
  const raw = localStorage.getItem("ebxdata");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const setEbxData = (data) => {
  localStorage.setItem("ebxdata", JSON.stringify(data));
};

export const useSessionStore = create((set) => {
  const ebxData = getEbxData();

  return {
    access: ebxData?.access ?? null,
    authExpiry: ebxData?.authExpiry ?? null,
    refresh: ebxData?.refresh ?? null,
    refreshExpiry: ebxData?.refreshExpiry ?? null,
    profile: ebxData?.profile ?? defaultProfile,

    setSession: (data) => {
      const updated = { ...getEbxData(), ...data };
      if (!updated.profile) updated.profile = defaultProfile;

      set({
        access: updated.access ?? null,
        authExpiry: updated.authExpiry ?? null,
        refresh: updated.refresh ?? null,
        refreshExpiry: updated.refreshExpiry ?? null,
        profile: updated.profile ?? defaultProfile,
      });

      setEbxData(updated);
    },

    clearSession: () => {
      const cleared = {
        access: null,
        authExpiry: null,
        refresh: null,
        refreshExpiry: null,
        profile: defaultProfile,
      };
      set(cleared);
      setEbxData({});
    },
  };
});
