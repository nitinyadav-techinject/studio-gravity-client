import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import { Card, CardContent } from '../components/ui/Card';
import {
    Users,
    Search,
    Mail,
    Shield,
    ChevronRight,
    Filter,
    UserCheck,
    Building2,
    Phone,
    MapPin,
    X,
    Calendar,
    Briefcase,
    Heart
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';

const UsersListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data: contactsResponse, isLoading } = useQuery({
        queryKey: ['contacts'],
        queryFn: () => contactService.getAllContacts(),
    });

    const contacts = contactsResponse?.data || [];

    const filteredContacts = contacts.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.mailingCity}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Users Directory</h1>
                    <p className="text-slate-400 mt-1">Manage all registered users and their detailed profiles.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button size="sm" className="gap-2">
                        <UserCheck className="h-4 w-4" /> Active Users: {contacts.length}
                    </Button>
                </div>
            </div>

            <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone or city..."
                            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Showing {filteredContacts.length} results</p>
                </div>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-6"><div className="h-12 w-48 bg-white/5 rounded-lg"></div></td>
                                            <td className="px-6 py-6"><div className="h-10 w-32 bg-white/5 rounded-lg"></div></td>
                                            <td className="px-6 py-6"><div className="h-10 w-32 bg-white/5 rounded-lg"></div></td>
                                            <td className="px-6 py-6"><div className="h-6 w-20 bg-white/5 rounded-full"></div></td>
                                            <td className="px-6 py-6"><div className="h-8 w-8 ml-auto bg-white/5 rounded-full"></div></td>
                                        </tr>
                                    ))
                                ) : filteredContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="h-10 w-10 text-slate-700" />
                                                <p className="text-slate-500 font-medium">No users found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/40 transition-all duration-300">
                                                    <span className="text-lg font-bold text-indigo-400">
                                                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                        {contact.firstName} {contact.lastName}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-indigo-400/80 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                                        <Shield className="h-3 w-3" /> Member
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 space-y-1.5">
                                            <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                                                <Mail className="h-3.5 w-3.5 text-slate-500" />
                                                {contact.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                                <Phone className="h-3.5 w-3.5 text-slate-500" />
                                                {contact.phone || 'No Phone'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <MapPin className="h-4 w-4 text-slate-500" />
                                                <span className="text-xs font-medium">
                                                    {contact.mailingCity ? `${contact.mailingCity}, ${contact.mailingCountry}` : 'Address not set'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full hover:bg-indigo-500/20 text-slate-500 hover:text-indigo-400"
                                                onClick={() => setSelectedUser(contact)}
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed User Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <Card className="w-full max-w-2xl bg-slate-900 border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 text-white hover:bg-black/20 rounded-full"
                                onClick={() => setSelectedUser(null)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="px-8 pb-8">
                            <div className="relative -mt-12 mb-6 flex justify-between items-end">
                                <div className="h-24 w-24 rounded-2xl bg-slate-900 border-4 border-slate-900 overflow-hidden shadow-xl">
                                    <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-black text-white">
                                        {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-white/10">Edit Profile</Button>
                                    <Button size="sm">Message</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{selectedUser.firstName} {selectedUser.lastName}</h2>
                                        <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] mt-1">System Administrator</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Mail className="h-4 w-4 text-indigo-500" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{selectedUser.email}</span>
                                                {selectedUser.secondaryEmail && <span className="text-[10px] text-slate-500 italic">Alt: {selectedUser.secondaryEmail}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Phone className="h-4 w-4 text-indigo-500" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Work: {selectedUser.phone || 'N/A'}</span>
                                                {selectedUser.mobile && <span className="text-sm font-medium">Mobile: {selectedUser.mobile}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium italic">Joined March 2024</span>
                                                {selectedUser.dateOfBirth && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Born: {format(new Date(selectedUser.dateOfBirth), 'MMM dd, yyyy')}</span>}
                                            </div>
                                        </div>
                                        {selectedUser.gender && (
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <Heart className="h-4 w-4 text-pink-500" />
                                                <span className="text-sm font-medium capitalize">{selectedUser.gender}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <MapPin className="h-3 w-3 text-indigo-500" /> Mailing Address
                                        </h3>
                                        <div className="text-sm text-slate-300 space-y-1">
                                            <p>{selectedUser.mailingStreet || 'Street not set'}</p>
                                            <p>{selectedUser.mailingCity}{selectedUser.mailingState ? `, ${selectedUser.mailingState}` : ''} {selectedUser.mailingZip}</p>
                                            <p className="font-bold text-slate-400">{selectedUser.mailingCountry}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Briefcase className="h-3 w-3 text-indigo-500" /> Bio / Notes
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed italic">
                                            {selectedUser.description || 'No biography or system notes available for this user.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UsersListPage;
