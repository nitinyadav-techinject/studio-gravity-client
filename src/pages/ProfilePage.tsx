import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { contactService } from '../services/contactService';
import {
    User as UserIcon,
    Mail,
    Phone,
    Briefcase,
    Shield,
    Clock,
    LogOut,
    Smartphone,
    Heart,
    Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(() => ({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        mobile: user?.mobile ?? '',
        secondaryEmail: user?.secondaryEmail ?? '',
        gender: user?.gender ?? '',
        dateOfBirth: user?.dateOfBirth ?? '',
    }));

    if (!user) return null;

    const handleChange = (field: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setForm(prev => ({ ...prev, [field]: e.target.value }));
        };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await contactService.updateContact(user.id, {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                mobile: form.mobile || undefined,
                secondaryEmail: form.secondaryEmail || undefined,
                gender: form.gender || undefined,
                dateOfBirth: form.dateOfBirth || undefined,
            });
            if (response.data) {
                // keep accountId and ids from existing user, merge editable fields
                updateUser({
                    ...user,
                    ...response.data,
                });
            } else {
                // fallback: update from local form
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
            toast.success('Profile updated');
            setIsEditing(false);
            // Optional: refresh page or refetch profile from backend if you want AuthContext to stay in sync
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
                        <p className="text-indigo-400 text-sm font-medium mt-1">Administrator</p>

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
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Designation</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Briefcase className="h-4 w-4 text-slate-400" />
                                            <span>System Administrator</span>
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

                    <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-indigo-500" />
                                Security & Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account ID</p>
                                <code className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                    {user.accountId}
                                </code>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">System ID</p>
                                <code className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded">
                                    {user.id}
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
