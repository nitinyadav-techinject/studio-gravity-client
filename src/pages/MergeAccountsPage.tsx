import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';
import { 
  GitMerge, 
  Search, 
  AlertCircle, 
  Loader2,
  Mail,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

const MergeAccountsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [masterAccount, setMasterAccount] = useState<any>(null);
    const [selectedDuplicates, setSelectedDuplicates] = useState<any[]>([]);

    const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const res = await accountService.getAccounts();
            if (!res.success) throw new Error(res.message);
            return res.data || [];
        }
    });

    const mergeMutation = useMutation({
        mutationFn: (data: any) => accountService.mergeAccounts(data),
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Merge initiated successfully!');
                setMasterAccount(null);
                setSelectedDuplicates([]);
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            } else {
                toast.error(res.message || 'Merge failed');
            }
        },
        onError: (err: any) => {
            toast.error(err.message || 'An error occurred during merge');
        }
    });

    const filteredAccounts = accountsData?.filter(acc => 
        acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const toggleDuplicate = (account: any) => {
        if (selectedDuplicates.some(d => d.id === account.id)) {
            setSelectedDuplicates(prev => prev.filter(d => d.id !== account.id));
        } else {
            setSelectedDuplicates(prev => [...prev, account]);
        }
    };

    const handleMerge = () => {
        if (!masterAccount) {
            toast.error('Please select a master account');
            return;
        }
        if (selectedDuplicates.length === 0) {
            toast.error('Please select at least one duplicate account');
            return;
        }

        const data = {
            masterAccountId: masterAccount.id,
            duplicateAccountIds: selectedDuplicates.map(d => d.id)
        };

        mergeMutation.mutate(data);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Merge Accounts</h1>
                    <p className="text-slate-400 mt-1 text-sm md:text-base">
                        Select a master account and multiple duplicates to merge them in Zoho CRM.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Account Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search accounts..."
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {isLoadingAccounts ? (
                                <div className="p-12 text-center">
                                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Loading accounts...</p>
                                </div>
                            ) : filteredAccounts.length === 0 ? (
                                <div className="p-12 text-center">
                                    <AlertCircle className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">No accounts found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {filteredAccounts.map((account) => {
                                        const isMaster = masterAccount?.id === account.id;
                                        const isDuplicate = selectedDuplicates.some(d => d.id === account.id);

                                        return (
                                            <div 
                                                key={account.id}
                                                className={`p-4 flex items-center justify-between transition-all group ${
                                                    isMaster ? 'bg-indigo-500/10' : isDuplicate ? 'bg-amber-500/10' : 'hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                                                        isMaster ? 'bg-indigo-500 text-white' : isDuplicate ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'
                                                    }`}>
                                                        {account.accountName[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                                                            {account.accountName}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                                            {account.email && (
                                                                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                                    <Mail className="h-3 w-3" />
                                                                    <span className="truncate max-w-[150px]">{account.email}</span>
                                                                </div>
                                                            )}
                                                            {account.phone && (
                                                                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                                    <Phone className="h-3 w-3" />
                                                                    <span>{account.phone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {!isMaster && !isDuplicate && (
                                                        <>
                                                            <button
                                                                onClick={() => setMasterAccount(account)}
                                                                className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white text-[11px] font-bold rounded-lg transition-all"
                                                            >
                                                                MASTER
                                                            </button>
                                                            <button
                                                                onClick={() => toggleDuplicate(account)}
                                                                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white text-[11px] font-bold rounded-lg transition-all"
                                                            >
                                                                DUPLICATE
                                                            </button>
                                                        </>
                                                    )}
                                                    {(isMaster || isDuplicate) && (
                                                        <button
                                                            onClick={() => {
                                                                if (isMaster) setMasterAccount(null);
                                                                else toggleDuplicate(account);
                                                            }}
                                                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Loader2 className="h-4 w-4 animate-spin-slow" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Summary & Action */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <GitMerge className="h-5 w-5 text-indigo-500" />
                            <h2 className="font-bold">Merge Summary</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Master Account</label>
                                {masterAccount ? (
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                            {masterAccount.accountName[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{masterAccount.accountName}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{masterAccount.id}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-white/10 rounded-xl p-4 text-center">
                                        <p className="text-xs text-slate-600">No master account selected</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Duplicate Accounts ({selectedDuplicates.length})</label>
                                <div className="space-y-2">
                                    {selectedDuplicates.map(account => (
                                        <div key={account.id} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                    {account.accountName[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{account.accountName}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{account.id}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleDuplicate(account)}
                                                className="text-slate-500 hover:text-red-400 p-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {selectedDuplicates.length === 0 && (
                                        <div className="border border-dashed border-white/10 rounded-xl p-4 text-center">
                                            <p className="text-xs text-slate-600">No duplicates selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleMerge}
                            disabled={!masterAccount || selectedDuplicates.length === 0 || mergeMutation.isPending}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                !masterAccount || selectedDuplicates.length === 0 || mergeMutation.isPending
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-indigo-500/25'
                            }`}
                        >
                            {mergeMutation.isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Merging...</span>
                                </>
                            ) : (
                                <>
                                    <GitMerge className="h-5 w-5" />
                                    <span>Merge Accounts</span>
                                </>
                            )}
                        </button>

                        <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 space-y-2">
                            <div className="flex gap-2 items-start">
                                <AlertCircle className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Merging will combine all related records (contacts, deals, etc.) into the master account. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MergeAccountsPage;

// Helper icons
const X = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
