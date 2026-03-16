import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import { accountService } from '../services/accountService';
import { useAuth } from '../store/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  X,
  Asterisk,
  Smartphone,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const ContactsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [useAccountAddress, setUseAccountAddress] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    secondaryEmail: '',
    gender: '',
    dateOfBirth: '',
    mailingStreet: '',
    mailingCity: '',
    mailingState: '',
    mailingZip: '',
    mailingCountry: '',
  });

  // Fetch Account Data to copy address from
  const { data: accountResponse } = useQuery({
    queryKey: ['account', user?.accountId],
    queryFn: () => accountService.getAccount(user?.accountId || ''),
    enabled: !!user?.accountId,
  });

  const accountData = accountResponse?.data;

  // Handle address toggle
  const toggleAccountAddress = (checked: boolean) => {
    setUseAccountAddress(checked);
    if (checked && accountData) {
      setFormData(prev => ({
        ...prev,
        mailingStreet: accountData.billingStreet || accountData.shippingStreet || '',
        mailingCity: accountData.billingCity || accountData.shippingCity || '',
        mailingState: accountData.billingState || accountData.shippingState || '',
        mailingZip: accountData.billingCode || accountData.shippingCode || '',
        mailingCountry: accountData.billingCountry || accountData.shippingCountry || ''
      }));
    }
  };

  // Fetch Contacts
  const { data: contactsResponse, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactService.getAllContacts(),
  });

  const contacts = contactsResponse?.data || [];

  const filteredContacts = contacts.filter(c => {
    const isCurrentUser = c.id === user?.id;
    const sameAccount = c.accountId === user?.accountId;
    const matchesSearch = `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // Exclude the logged-in user from the contacts list;
    // they edit their own profile via the Profile page instead.
    return sameAccount && !isCurrentUser && matchesSearch;
  });

  // Create/Update Mutation
  const mutation = useMutation({
    mutationFn: (data: any) => {
      const cleanData = {
        ...data,
        mobile: data.mobile || undefined,
        secondaryEmail: data.secondaryEmail || undefined,
        gender: data.gender || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
      };
      return isEditing
        ? contactService.updateContact(isEditing, cleanData)
        : contactService.createContact({ ...cleanData, accountId: user?.accountId || '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success(`Contact ${isEditing ? 'updated' : 'created'} successfully!`);
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  });

  const handleEdit = (contact: any) => {
    setIsEditing(contact.id);
    setFormData({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      mobile: contact.mobile || '',
      secondaryEmail: contact.secondaryEmail || '',
      gender: contact.gender || '',
      dateOfBirth: contact.dateOfBirth?.split('T')[0] || '',
      mailingStreet: contact.mailingStreet || '',
      mailingCity: contact.mailingCity || '',
      mailingState: contact.mailingState || '',
      mailingZip: contact.mailingZip || '',
      mailingCountry: contact.mailingCountry || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      mobile: '',
      secondaryEmail: '',
      gender: '',
      dateOfBirth: '',
      mailingStreet: '',
      mailingCity: '',
      mailingState: '',
      mailingZip: '',
      mailingCountry: '',
    });
    setUseAccountAddress(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Contacts</h1>
          <p className="text-slate-400">Manage your business relationships and user profiles.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 px-6">
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/20">
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Phone / Mobile</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-white/5 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-white/5 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-white/5 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-white/5 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-16 ml-auto bg-white/5 rounded"></div></td>
                  </tr>
                ))
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No contacts found matching your search.
                  </td>
                </tr>
              ) : filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-black text-indigo-400 border border-white/10 group-hover:border-indigo-500/40 transition-all">
                        {contact.firstName?.[0] || '?'}{contact.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{contact.firstName} {contact.lastName}</p>
                        <p className="text-xs text-slate-400 font-medium">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-500" /> {contact.phone || 'N/A'}</p>
                      {contact.mobile && <p className="text-[10px] text-slate-500 flex items-center gap-1.5"><Smartphone className="h-2.5 w-2.5" /> {contact.mobile}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-tighter">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">
                    {contact.createdAt ? format(new Date(contact.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contact)}
                        className="hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-full transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contact.id)}
                        className="hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-xl bg-slate-900 border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-white tracking-tight">{isEditing ? 'Edit Profile' : 'Create New Contact'}</h2>
                <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-full text-slate-500 hover:text-white"><X className="h-5 w-5" /></Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      FirstName <Asterisk className="h-3 w-3 text-indigo-500" />
                    </label>
                    <Input
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-slate-950/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      LastName <Asterisk className="h-3 w-3 text-indigo-500" />
                    </label>
                    <Input
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-slate-950/50 border-white/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      Email <Asterisk className="h-3 w-3 text-indigo-500" />
                    </label>
                    <Input
                      placeholder="primary@example.com"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-950/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      Secondary Email <span className="text-slate-600 text-[8px]">Optional</span>
                    </label>
                    <Input
                      placeholder="alt@example.com"
                      type="email"
                      value={formData.secondaryEmail}
                      onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                      className="bg-slate-950/50 border-white/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      Phone <Asterisk className="h-3 w-3 text-indigo-500" />
                    </label>
                    <Input
                      placeholder="+1..."
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-slate-950/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      Mobile <span className="text-slate-600 text-[8px]">Optional</span>
                    </label>
                    <Input
                      placeholder="+1..."
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="bg-slate-950/50 border-white/10"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" /> Mailing Address
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleAccountAddress(!useAccountAddress)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${useAccountAddress
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                    >
                      {useAccountAddress && <CheckCircle2 className="h-3 w-3" />}
                      Same as Account
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Street Address</label>
                      <Input
                        placeholder="123 Main St"
                        value={formData.mailingStreet}
                        onChange={(e) => setFormData({ ...formData, mailingStreet: e.target.value })}
                        className="bg-slate-950/50 border-white/10"
                        disabled={useAccountAddress}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City</label>
                        <Input
                          placeholder="City"
                          value={formData.mailingCity}
                          onChange={(e) => setFormData({ ...formData, mailingCity: e.target.value })}
                          className="bg-slate-950/50 border-white/10"
                          disabled={useAccountAddress}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
                        <Input
                          placeholder="State"
                          value={formData.mailingState}
                          onChange={(e) => setFormData({ ...formData, mailingState: e.target.value })}
                          className="bg-slate-950/50 border-white/10"
                          disabled={useAccountAddress}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ZIP / Postal</label>
                        <Input
                          placeholder="Code"
                          value={formData.mailingZip}
                          onChange={(e) => setFormData({ ...formData, mailingZip: e.target.value })}
                          className="bg-slate-950/50 border-white/10"
                          disabled={useAccountAddress}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country</label>
                        <Input
                          placeholder="Country"
                          value={formData.mailingCountry}
                          onChange={(e) => setFormData({ ...formData, mailingCountry: e.target.value })}
                          className="bg-slate-950/50 border-white/10"
                          disabled={useAccountAddress}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      Gender <span className="text-slate-600 text-[8px]">Optional</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 h-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                      Date of Birth <span className="text-slate-600 text-[8px]">Optional</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="bg-slate-950/50 border-white/10"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-8 pb-2">
                  <Button type="button" variant="ghost" onClick={closeModal} className="text-slate-400 hover:text-white">Cancel</Button>
                  <Button type="submit" isLoading={mutation.isPending} className="px-8 shadow-indigo-500/20">
                    {isEditing ? 'Update Profile' : 'Create Contact'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
