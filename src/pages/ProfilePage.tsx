import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import { accountService } from '../services/accountService';
import {
    User as UserIcon,
    Mail,
    Phone,
    Shield,
    Clock,
    LogOut,
    Smartphone,
    Heart,
    Calendar,
    Building,
    MapPin,
    CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch account info
    const { data: accountResponse, isLoading: accountLoading } = useQuery({
        queryKey: ['account', user?.accountId],
        queryFn: () => accountService.getAccount(user?.accountId || ''),
        enabled: !!user?.accountId,
    });

    const account = accountResponse?.data;

    const [form, setForm] = useState(() => ({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        mobile: user?.mobile ?? '',
        secondaryEmail: user?.secondaryEmail ?? '',
        gender: user?.gender ?? '',
        dateOfBirth: user?.dateOfBirth ?? '',
        mailingStreet: (user as any)?.mailingStreet ?? '',
        mailingCity: (user as any)?.mailingCity ?? '',
        mailingState: (user as any)?.mailingState ?? '',
        mailingZip: (user as any)?.mailingZip ?? '',
        mailingCountry: (user as any)?.mailingCountry ?? '',
        // Account fields
        accountName: account?.accountName ?? '',
        accountEmail: account?.email ?? '',
        accountPhone: account?.phone ?? '',
        billingStreet: account?.billingStreet ?? '',
        billingCity: account?.billingCity ?? '',
        billingState: account?.billingState ?? '',
        billingCode: account?.billingCode ?? '',
        billingCountry: account?.billingCountry ?? '',
        shippingStreet: account?.shippingStreet ?? '',
        shippingCity: account?.shippingCity ?? '',
        shippingState: account?.shippingState ?? '',
        shippingCode: account?.shippingCode ?? '',
        shippingCountry: account?.shippingCountry ?? '',
    }));

    // Update form when account data loads
    useEffect(() => {
        if (account) {
            setForm(prev => ({
                ...prev,
                accountName: account.accountName ?? '',
                accountEmail: account.email ?? '',
                accountPhone: account.phone ?? '',
                billingStreet: account.billingStreet ?? '',
                billingCity: account.billingCity ?? '',
                billingState: account.billingState ?? '',
                billingCode: account.billingCode ?? '',
                billingCountry: account.billingCountry ?? '',
                shippingStreet: account.shippingStreet ?? '',
                shippingCity: account.shippingCity ?? '',
                shippingState: account.shippingState ?? '',
                shippingCode: account.shippingCode ?? '',
                shippingCountry: account.shippingCountry ?? '',
            }));
        }
    }, [account]);

    if (!user) return null;

    const handleChange = (field: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setForm(prev => ({ ...prev, [field]: e.target.value }));
        };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            
            // 1. Update Contact Profile
            const contactResponse = await contactService.updateContact(user.id, {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                mobile: form.mobile || undefined,
                secondaryEmail: form.secondaryEmail || undefined,
                gender: (form.gender || undefined) as any,
                dateOfBirth: form.dateOfBirth || undefined,
                mailingStreet: form.mailingStreet || undefined,
                mailingCity: form.mailingCity || undefined,
                mailingState: form.mailingState || undefined,
                mailingZip: form.mailingZip || undefined,
                mailingCountry: form.mailingCountry || undefined,
            });

            // 2. Update Account Information if account exists
            if (user.accountId) {
                await accountService.updateAccount(user.accountId, {
                    email: form.accountEmail || null,
                    phone: form.accountPhone || null,
                    billingStreet: form.billingStreet || null,
                    billingCity: form.billingCity || null,
                    billingState: form.billingState || null,
                    billingCode: form.billingCode || null,
                    billingCountry: form.billingCountry || null,
                    shippingStreet: form.shippingStreet || null,
                    shippingCity: form.shippingCity || null,
                    shippingState: form.shippingState || null,
                    shippingCode: form.shippingCode || null,
                    shippingCountry: form.shippingCountry || null,
                } as any);
                queryClient.invalidateQueries({ queryKey: ['account', user.accountId] });
            }

            if (contactResponse.data) {
                updateUser({
                    ...user,
                    ...contactResponse.data,
                });
            } else {
                updateUser({
                    ...user,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phone: form.phone,
                    mobile: form.mobile || null,
                    secondaryEmail: form.secondaryEmail || null,
                    gender: (form.gender || null) as any,
                    dateOfBirth: form.dateOfBirth || null,
                });
            }
            toast.success('Profile and Account updated');
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Card */}
                <Card className="w-full md:w-80 shrink-0 border-white/5 bg-slate-900/50 backdrop-blur-xl">
                    <CardContent className="pt-8 pb-6 flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 p-1">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-white">
                                    {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <h2 className="mt-6 text-xl font-bold text-white tracking-tight">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-indigo-400 text-sm font-medium mt-1 capitalize">{user.role || 'Customer'}</p>

                        <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                            <div className="text-center">
                                <p className="text-lg font-bold text-white">1.2k</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Contacts</p>
                            </div>
                            <div className="text-center border-l border-white/5">
                                <p className="text-lg font-bold text-white">48</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Accounts</p>
                            </div>
                        </div>

                        <div className="w-full mt-8 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 border-slate-500/40 text-slate-200 hover:bg-slate-500/10 hover:border-slate-400/60"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                onClick={logout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Info */}
                <div className="flex-1 space-y-6">
                    <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="h-5 w-5 text-indigo-500" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!isEditing ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Full Name</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <UserIcon className="h-4 w-4 text-slate-400" />
                                            <span>{user.firstName} {user.lastName}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Phone</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span>{user.phone || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Secondary Email</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <span>{user.secondaryEmail || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mobile</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Smartphone className="h-4 w-4 text-slate-400" />
                                            <span>{user.mobile || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gender</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Heart className="h-4 w-4 text-slate-400" />
                                            <span className="capitalize">{user.gender || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date of Birth</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            <span>{user.dateOfBirth ? format(new Date(user.dateOfBirth), 'PPP') : 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Role</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Shield className="h-4 w-4 text-slate-400" />
                                            <span className="capitalize">{user.role || 'Customer'}</span>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 pt-4 border-t border-white/5">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Mailing Address</p>
                                        <div className="flex items-start gap-2 text-white/80">
                                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                            <div className="text-sm">
                                                <p>{(user as any).mailingStreet || 'Street not provided'}</p>
                                                <p className="text-xs text-slate-400">
                                                    {(user as any).mailingCity || 'City'}, {(user as any).mailingState || 'State'} {(user as any).mailingZip || 'ZIP'}
                                                </p>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{(user as any).mailingCountry || 'Country'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="First name"
                                            value={form.firstName}
                                            onChange={handleChange('firstName')}
                                            required
                                        />
                                        <Input
                                            label="Last name"
                                            value={form.lastName}
                                            onChange={handleChange('lastName')}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange('email')}
                                            required
                                        />
                                        <Input
                                            label="Secondary email"
                                            type="email"
                                            value={form.secondaryEmail}
                                            onChange={handleChange('secondaryEmail')}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Phone"
                                            value={form.phone}
                                            onChange={handleChange('phone')}
                                            required
                                        />
                                        <Input
                                            label="Mobile"
                                            value={form.mobile}
                                            onChange={handleChange('mobile')}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className="flex flex-col gap-1 text-xs">
                                            <span className="text-slate-300">Gender</span>
                                            <select
                                                value={form.gender}
                                                onChange={handleChange('gender')}
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 h-9 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </label>
                                        <Input
                                            label="Date of birth"
                                            type="date"
                                            value={form.dateOfBirth ?? ''}
                                            onChange={handleChange('dateOfBirth')}
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-white/5 space-y-4">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Edit Mailing Address</p>
                                        <Input
                                            label="Street"
                                            value={form.mailingStreet}
                                            onChange={(e) => setForm({ ...form, mailingStreet: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="City"
                                                value={form.mailingCity}
                                                onChange={(e) => setForm({ ...form, mailingCity: e.target.value })}
                                            />
                                            <Input
                                                label="State"
                                                value={form.mailingState}
                                                onChange={(e) => setForm({ ...form, mailingState: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="ZIP Code"
                                                value={form.mailingZip}
                                                onChange={(e) => setForm({ ...form, mailingZip: e.target.value })}
                                            />
                                            <Input
                                                label="Country"
                                                value={form.mailingCountry}
                                                onChange={(e) => setForm({ ...form, mailingCountry: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setForm({
                                                    firstName: user.firstName ?? '',
                                                    lastName: user.lastName ?? '',
                                                    email: user.email ?? '',
                                                    phone: user.phone ?? '',
                                                    mobile: user.mobile ?? '',
                                                    secondaryEmail: user.secondaryEmail ?? '',
                                                    gender: user.gender ?? '',
                                                    dateOfBirth: user.dateOfBirth ?? '',
                                                    mailingStreet: (user as any).mailingStreet ?? '',
                                                    mailingCity: (user as any).mailingCity ?? '',
                                                    mailingState: (user as any).mailingState ?? '',
                                                    mailingZip: (user as any).mailingZip ?? '',
                                                    mailingCountry: (user as any).mailingCountry ?? '',
                                                    accountName: account?.accountName ?? '',
                                                    accountEmail: account?.email ?? '',
                                                    accountPhone: account?.phone ?? '',
                                                    billingStreet: account?.billingStreet ?? '',
                                                    billingCity: account?.billingCity ?? '',
                                                    billingState: account?.billingState ?? '',
                                                    billingCode: account?.billingCode ?? '',
                                                    billingCountry: account?.billingCountry ?? '',
                                                    shippingStreet: account?.shippingStreet ?? '',
                                                    shippingCity: account?.shippingCity ?? '',
                                                    shippingState: account?.shippingState ?? '',
                                                    shippingCode: account?.shippingCode ?? '',
                                                    shippingCountry: account?.shippingCountry ?? '',
                                                });
                                            }}
                                            className="text-slate-400 hover:text-white"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={saving}>
                                            {saving ? 'Saving...' : 'Save changes'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Section */}
                    {user.accountId && (
                        <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-white">
                                    <Building className="h-5 w-5 text-indigo-500" />
                                    Account & Business Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {!isEditing ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account Name</p>
                                                <p className="text-sm text-white font-medium">{account?.accountName || 'No account name'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account ID</p>
                                                <code className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                                    {user.accountId}
                                                </code>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account Email</p>
                                                <p className="text-sm text-white flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-500" /> {account?.email || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account Phone</p>
                                                <p className="text-sm text-white flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-500" /> {account?.phone || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-indigo-400">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Billing Address</span>
                                                </div>
                                                <div className="space-y-1.5 pl-6 border-l border-indigo-500/20">
                                                    <p className="text-sm text-white">{account?.billingStreet || 'Street not set'}</p>
                                                    <p className="text-xs text-slate-400">{account?.billingCity}, {account?.billingState} {account?.billingCode}</p>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{account?.billingCountry}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Shipping Address</span>
                                                </div>
                                                <div className="space-y-1.5 pl-6 border-l border-emerald-500/20">
                                                    <p className="text-sm text-white">{account?.shippingStreet || 'Street not set'}</p>
                                                    <p className="text-xs text-slate-400">{account?.shippingCity}, {account?.shippingState} {account?.shippingCode}</p>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{account?.shippingCountry}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Email</label>
                                                <Input
                                                    type="email"
                                                    value={form.accountEmail}
                                                    onChange={(e) => setForm({ ...form, accountEmail: e.target.value })}
                                                    placeholder="business@email.com"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Phone</label>
                                                <Input
                                                    value={form.accountPhone}
                                                    onChange={(e) => setForm({ ...form, accountPhone: e.target.value })}
                                                    placeholder="Business Phone"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-indigo-400">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Billing Address</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <Input
                                                        label="Street"
                                                        value={form.billingStreet}
                                                        onChange={(e) => setForm({ ...form, billingStreet: e.target.value })}
                                                    />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input
                                                            label="City"
                                                            value={form.billingCity}
                                                            onChange={(e) => setForm({ ...form, billingCity: e.target.value })}
                                                        />
                                                        <Input
                                                            label="State"
                                                            value={form.billingState}
                                                            onChange={(e) => setForm({ ...form, billingState: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input
                                                            label="ZIP Code"
                                                            value={form.billingCode}
                                                            onChange={(e) => setForm({ ...form, billingCode: e.target.value })}
                                                        />
                                                        <Input
                                                            label="Country"
                                                            value={form.billingCountry}
                                                            onChange={(e) => setForm({ ...form, billingCountry: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-emerald-400">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Shipping Address</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setForm(prev => ({
                                                            ...prev,
                                                            shippingStreet: prev.billingStreet,
                                                            shippingCity: prev.billingCity,
                                                            shippingState: prev.billingState,
                                                            shippingCode: prev.billingCode,
                                                            shippingCountry: prev.billingCountry,
                                                        }))}
                                                        className="text-[9px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                                                    >
                                                        Copy Billing
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <Input
                                                        label="Street"
                                                        value={form.shippingStreet}
                                                        onChange={(e) => setForm({ ...form, shippingStreet: e.target.value })}
                                                    />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input
                                                            label="City"
                                                            value={form.shippingCity}
                                                            onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                                                        />
                                                        <Input
                                                            label="State"
                                                            value={form.shippingState}
                                                            onChange={(e) => setForm({ ...form, shippingState: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input
                                                            label="ZIP Code"
                                                            value={form.shippingCode}
                                                            onChange={(e) => setForm({ ...form, shippingCode: e.target.value })}
                                                        />
                                                        <Input
                                                            label="Country"
                                                            value={form.shippingCountry}
                                                            onChange={(e) => setForm({ ...form, shippingCountry: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-white">
                                <Clock className="h-5 w-5 text-indigo-500" />
                                System Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">System ID</p>
                                <code className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded">
                                    {user.id}
                                </code>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Role</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-tighter ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                    {user.role || 'customer'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
