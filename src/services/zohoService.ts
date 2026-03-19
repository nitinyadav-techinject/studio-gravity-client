import api from "./api";

export interface ZohoAccountSyncItem {
  id: string;
  accountName: string;
  zohoMetaData: {
    zohoId: string | null;
    lastSyncAt: string | null;
  } | null;
  contactsCount: string | number;
}

export interface ZohoSyncSummary {
  accounts: {
    totalFetched: number;
    synced: number;
    failed: number;
  };
  contacts: {
    totalFetched: number;
    synced: number;
    failed: number;
  };
}

export const zohoService = {
  getSyncList: async () => {
    const response = await api.get("/zoho/sync/list");
    return response.data;
  },

  triggerReverseSync: async () => {
    const response = await api.post("/zoho/sync/reverse");
    return response.data;
  },
};
