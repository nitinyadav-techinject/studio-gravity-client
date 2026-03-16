import { useAuth } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
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

const ProfilePage = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

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

                        <Button
                            variant="outline"
                            className="w-full mt-8 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
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
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
