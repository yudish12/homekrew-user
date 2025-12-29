import { AppSettings } from "../app-settings";

export interface AppSettingsStore {
    settings: AppSettings | null;
    loading: boolean;
    error: string | null;
}

