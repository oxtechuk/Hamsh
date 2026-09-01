import { create } from "zustand";
import type { ISettingsData } from "../interfaces/ISettingsData";

declare global {
  interface Window {
    __INITIAL_SETTINGS__?: ISettingsData;
    __IS_ADMIN__?: boolean;
  }
}

const initialSettings =
  typeof window !== "undefined" && window.__INITIAL_SETTINGS__
    ? window.__INITIAL_SETTINGS__
    : null;

interface ISettingsStore {
  settings: ISettingsData | null;
  loaded: boolean;
  loading: boolean;
  setSettings: (data: ISettingsData) => void;
  setLoading: (loading: boolean) => void;
}

export const useSettingsStore = create<ISettingsStore>((set) => ({
  settings: initialSettings,
  loaded: Boolean(initialSettings),
  loading: false,
  setSettings: (data) => set({ settings: data, loaded: true, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
