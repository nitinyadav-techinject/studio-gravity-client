import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  X,
  Building,
  Mail,
  MapPin,
  User as UserIcon,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Account, Contact } from '../types/account';

const AccountsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState<string | null>(null);

  const [accountFormData, setAccountFormData] = useState({
    accountName: '',
    email: '',
    phone: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingCode: '',
    billingCountry: '',
    description: '',
  });

  const [contactFormData, setContactFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    role: 'customer' as 'admin' | 'customer',
  });

  // Fetch Accounts
  const { data: accountsResponse, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  const accounts = accountsResponse?.data || [];

  // Fetch Contacts for Selected Account
  const { data: contactsResponse, isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts', selectedAccountId],
    queryFn: () => accountService.getContactsByAccountId(selectedAccountId!),
    enabled: !!selectedAccountId,
  });

  const contacts = contactsResponse?.data || [];

  const filteredAccounts = accounts.filter(acc =>
    acc.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutations
  const accountMutation = useMutation({
    mutationFn: (data: any) =>
      isEditingAccount
        ? accountService.updateAccount(isEditingAccount, data)
        : accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success(`Account ${isEditingAccount ? 'updated' : 'created'} successfully!`);
      closeAccountModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Operation failed'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account deleted successfully');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Delete failed'),
  });

  const contactMutation = useMutation({
    mutationFn: (data: any) =>
      isEditingContact
        ? accountService.updateContact(isEditingContact, data)
        : Promise.reject('Create contact not implemented in this view, use Contacts page'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', selectedAccountId] });
      toast.success('Contact updated successfully!');
      closeContactModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Operation failed'),
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => accountService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', selectedAccountId] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Delete failed'),
  });

  const handleEditAccount = (account: Account) => {
    setIsEditingAccount(account.id);
    setAccountFormData({
      accountName: account.accountName || '',
      email: account.email || '',
      phone: account.phone || '',
      billingStreet: account.billingStreet || '',
      billingCity: account.billingCity || '',
      billingState: account.billingState || '',
      billingCode: account.billingCode || '',
      billingCountry: account.billingCountry || '',
      description: account.description || '',
    });
    setIsAccountModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setIsEditingContact(contact.id);
    setContactFormData({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      mobile: contact.mobile || '',
      role: contact.role || 'customer',
    });
    setIsContactModalOpen(true);
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
    setIsEditingAccount(null);
    setAccountFormData({
      accountName: '', email: '', phone: '',
      billingStreet: '', billingCity: '', billingState: '', billingCode: '', billingCountry: '',
      description: '',
    });
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setIsEditingContact(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight text-white mb-2">Accounts</h1>
          <p className="text-slate-400">View and manage all organization accounts and their contacts.</p>
        </div>
        <Button onClick={() => setIsAccountModalOpen(true)} className="gap-2 px-6">
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Accounts List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl">
            <div className="p-4 border-b border-white/5 bg-slate-950/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
              {accountsLoading ? (
                <div className="p-8 text-center text-slate-500 animate-pulse">Loading accounts...</div>
              ) : filteredAccounts.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No accounts found.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredAccounts.map((account) => (
                    <div
                      key={account.id}
                      onClick={() => setSelectedAccountId(account.id)}
                      className={`p-4 cursor-pointer transition-all hover:bg-white/5 group ${selectedAccountId === account.id ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-white truncate group-hover:text-indigo-400 transition-colors">
                            {account.accountName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-2.5 w-2.5 text-slate-500" />
                            <span className="text-[10px] text-slate-500 truncate">{account.email || 'No email'}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditAccount(account); }}
                            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Account Details & Contacts */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedAccountId ? (
            <Card className="h-full min-h-[400px] border-dashed border-2 border-white/10 bg-transparent flex flex-center flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-slate-600">
                <Building className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Select an account</h3>
              <p className="text-slate-400 max-w-xs">Pick an account from the list to view details and manage contacts.</p>
            </Card>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              {/* Account Quick Header */}
              {accounts.find(a => a.id === selectedAccountId) && (
                (() => {
                  const account = accounts.find(a => a.id === selectedAccountId)!;
                  return (
                    <>
                      <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="h-24 bg-gradient-to-r from-indigo-600/30 to-purple-600/30"></div>
                        <div className="px-6 pb-6 -mt-12">
                          <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                            <div className="flex items-end gap-4">
                              <div className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-2xl">
                                <Building className="h-10 w-10 text-indigo-400" />
                              </div>
                              <div className="mb-2">
                                <h2 className="text-2xl font-black text-white tracking-tight">{account.accountName}</h2>
                                <p className="text-slate-400 flex items-center gap-2 text-sm">
                                  <MapPin className="h-3.5 w-3.5 text-indigo-500" /> 
                                  {account.billingCity ? `${account.billingCity}, ${account.billingCountry}` : 'Location not set'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mb-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditAccount(account)} className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white">
                                <Edit2 className="h-3.5 w-3.5" /> Edit Account
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                if(window.confirm('Delete account and all its contacts?')) deleteAccountMutation.mutate(account.id);
                              }} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                             <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                                <p className="text-sm text-white font-medium flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-500" /> {account.email || 'N/A'}</p>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                                <p className="text-sm text-white font-medium flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-500" /> {account.phone || 'N/A'}</p>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Billing Address</label>
                                <p className="text-sm text-white font-medium truncate">{account.billingStreet || 'N/A'}</p>
                             </div>
                          </div>
                        </div>
                      </Card>

                      <div className="flex items-center justify-between">
                         <h3 className="text-lg font-black text-white flex items-center gap-2">
                           <UserIcon className="h-5 w-5 text-indigo-500" /> 
                           Account Contacts 
                           <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] border border-indigo-500/20">{contacts.length}</span>
                         </h3>
                      </div>

                      <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/20">
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {contactsLoading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 animate-pulse">Loading contacts...</td></tr>
                              ) : contacts.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No contacts found for this account.</td></tr>
                              ) : (
                                contacts.map((contact) => (
                                  <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center font-black text-indigo-400 text-xs border border-white/10 group-hover:border-indigo-500/40 transition-all">
                                          {contact.firstName?.[0]}{contact.lastName?.[0]}
                                        </div>
                                        <div>
                                          <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors uppercase">{contact.firstName} {contact.lastName}</p>
                                          <p className="text-[10px] text-slate-500 font-medium">{contact.email}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-tighter ${contact.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                        {contact.role || 'customer'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <p className="text-[10px] text-slate-300 font-medium">{contact.phone || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end gap-1">
                                        <button
                                          onClick={() => handleEditContact(contact)}
                                          className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-all"
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if(window.confirm('Delete this contact?')) deleteContactMutation.mutate(contact.id);
                                          }}
                                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </>
                  );
                })()
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-xl bg-slate-900 border-white/5 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-white tracking-tight">{isEditingAccount ? 'Edit Account' : 'Create New Account'}</h2>
                <Button variant="ghost" size="icon" onClick={closeAccountModal} className="rounded-full text-slate-500 hover:text-white"><X className="h-5 w-5" /></Button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); accountMutation.mutate(accountFormData); }} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Name</label>
                  <Input
                    required
                    placeholder="Tech Flow Inc."
                    value={accountFormData.accountName}
                    onChange={(e) => setAccountFormData({ ...accountFormData, accountName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                    <Input
                      type="email"
                      placeholder="info@techflow.com"
                      value={accountFormData.email}
                      onChange={(e) => setAccountFormData({ ...accountFormData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={accountFormData.phone}
                      onChange={(e) => setAccountFormData({ ...accountFormData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billing Address</h3>
                  <Input
                    placeholder="Street Address"
                    value={accountFormData.billingStreet}
                    onChange={(e) => setAccountFormData({ ...accountFormData, billingStreet: e.target.value })}
                    className="mb-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={accountFormData.billingCity}
                      onChange={(e) => setAccountFormData({ ...accountFormData, billingCity: e.target.value })}
                    />
                    <Input
                      placeholder="State"
                      value={accountFormData.billingState}
                      onChange={(e) => setAccountFormData({ ...accountFormData, billingState: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                  <Button type="button" variant="ghost" onClick={closeAccountModal} className="text-slate-400 hover:text-white">Cancel</Button>
                  <Button type="submit" isLoading={accountMutation.isPending} className="px-8">{isEditingAccount ? 'Update Account' : 'Create Account'}</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Contact Modal (Partial Edit Only for now) */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-lg bg-slate-900 border-white/5 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-white tracking-tight">Edit Contact</h2>
                <Button variant="ghost" size="icon" onClick={closeContactModal} className="rounded-full text-slate-500 hover:text-white"><X className="h-5 w-5" /></Button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); contactMutation.mutate(contactFormData); }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                    <Input
                      required
                      value={contactFormData.firstName}
                      onChange={(e) => setContactFormData({ ...contactFormData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                    <Input
                      required
                      value={contactFormData.lastName}
                      onChange={(e) => setContactFormData({ ...contactFormData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Role</label>
                  <select
                    value={contactFormData.role}
                    onChange={(e) => setContactFormData({ ...contactFormData, role: e.target.value as any })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 h-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                  <Button type="button" variant="ghost" onClick={closeContactModal} className="text-slate-400 hover:text-white">Cancel</Button>
                  <Button type="submit" isLoading={contactMutation.isPending} className="px-8">Update Contact</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
