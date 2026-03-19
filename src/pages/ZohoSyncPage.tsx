import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  RefreshCcw, 
  Database, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone
} from 'lucide-react';
import { zohoService, ZohoAccountSyncItem, ZohoSyncSummary } from '../services/zohoService';

const ZohoSyncPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ZohoAccountSyncItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [syncSummary, setSyncSummary] = useState<ZohoSyncSummary | null>(null);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await zohoService.getSyncList();
      if (res.success) {
        setAccounts(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch account list');
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Could not connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      const res = await zohoService.triggerReverseSync();
      if (res.success) {
        setSyncSummary(res.data);
        toast.success('Synchronization completed successfully!');
        fetchAccounts(); // Refresh the list
      } else {
        toast.error(res.message || 'Sync failed');
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error('Sync failed due to a network error');
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleAccount = (id: string) => {
    setExpandedAccountId(expandedAccountId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Zoho CRM Sync</h1>
          <p className="text-slate-400 mt-1">Manage and monitor your Zoho CRM data synchronization.</p>
        </div>
        
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
        >
          {isSyncing ? (
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          ) : (
            <RefreshCcw className={`w-5 h-5 mr-3 transition-transform duration-500 group-hover:rotate-180`} />
          )}
          <span>{isSyncing ? 'Syncing...' : 'Sync From Zoho'}</span>
        </button>
      </div>

      {/* Stats Summary Section */}
      {syncSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-500">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase">Accounts Synced</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{syncSummary.accounts.synced}</span>
                  <span className="text-xs text-slate-500">/ {syncSummary.accounts.totalFetched}</span>
                </div>
              </div>
            </div>
            {syncSummary.accounts.failed > 0 ? (
               <div className="text-red-400 text-sm bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 flex items-center gap-1">
                 <AlertCircle className="w-4 h-4" /> {syncSummary.accounts.failed} failed
               </div>
            ) : <CheckCircle2 className="text-emerald-400 w-5 h-5" />}
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase">Contacts Synced</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{syncSummary.contacts.synced}</span>
                  <span className="text-xs text-slate-500">/ {syncSummary.contacts.totalFetched}</span>
                </div>
              </div>
            </div>
            {syncSummary.contacts.failed > 0 ? (
               <div className="text-red-400 text-sm bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 flex items-center gap-1">
                 <AlertCircle className="w-4 h-4" /> {syncSummary.contacts.failed} failed
               </div>
            ) : <CheckCircle2 className="text-emerald-400 w-5 h-5" />}
          </div>
        </div>
      )}

      {/* Main List Table Area */}
      <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Database View
            </h2>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Total Accounts: <span className="text-indigo-400 text-sm">{accounts.length}</span>
            </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] gap-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-slate-400">Fetching sync status...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center p-8">
            <RefreshCcw className="w-10 h-10 text-slate-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
            <p className="text-slate-400">Press the sync button above to import your data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 whitespace-nowrap">
                  <th className="px-6 py-4">Account Details</th>
                  <th className="px-6 py-4">Zoho Reference</th>
                  <th className="px-6 py-4">Contacts Count</th>
                  <th className="px-6 py-4">Last Synced</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {accounts.map((acc) => (
                  <React.Fragment key={acc.id}>
                    <tr 
                      onClick={() => toggleAccount(acc.id)}
                      className={`hover:bg-white/5 transition-colors group cursor-pointer ${expandedAccountId === acc.id ? 'bg-white/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`transition-transform duration-300 ${expandedAccountId === acc.id ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                            <span className="text-indigo-400 font-bold">{acc.accountName.charAt(0)}</span>
                          </div>
                          <span className="font-semibold text-slate-200 group-hover:text-white">
                            {acc.accountName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-indigo-300">
                        {acc.zohoMetaData?.zohoId || 'Not Linked'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="px-2.5 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-bold border border-white/5">
                            {acc.ContactsCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                        {acc.zohoMetaData?.lastSyncAt ? new Date(acc.zohoMetaData.lastSyncAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                              {acc.zohoMetaData?.zohoId ? (
                                  <div className="p-1 px-3 bg-emerald-500/10 text-emerald-400 rounded-full text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1.5 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                      Synced
                                  </div>
                              ) : (
                                  <div className="p-1 px-3 bg-amber-500/10 text-amber-500 rounded-full text-[11px] font-bold border border-amber-500/20 flex items-center gap-1.5 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                      Pending
                                  </div>
                              )}
                          </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Contacts Row */}
                    {expandedAccountId === acc.id && (
                      <tr className="bg-slate-900/50 animate-in slide-in-from-top-2 duration-300">
                        <td colSpan={5} className="px-12 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {acc.Contacts && acc.Contacts.length > 0 ? (
                              acc.Contacts.map(contact => (
                                <div key={contact.id} className="bg-slate-800/60 border border-white/5 rounded-xl p-4 flex flex-col gap-2 hover:border-indigo-500/30 transition-colors group">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                                      {contact.firstName} {contact.lastName}
                                    </h4>
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                  </div>
                                  
                                  <div className="space-y-1 mt-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                      <Mail className="w-3 h-3 text-slate-500" />
                                      <span className="truncate">{contact.email || 'No Email'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                      <Phone className="w-3 h-3 text-slate-500" />
                                      <span>{contact.phone || 'No Phone'}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full py-4 text-center text-slate-500 text-sm italic">
                                No contacts associated with this account.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZohoSyncPage;
