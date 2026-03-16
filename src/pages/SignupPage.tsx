import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { accountService } from '../services/accountService';
import { contactService } from '../services/contactService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import {
    User,
    Building2,
    Mail,
    Lock,
    Phone,
    MapPin,
    Globe,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Asterisk,
    Smartphone,
    Calendar,
    Heart
} from 'lucide-react';

const SignupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [copyToBilling, setCopyToBilling] = useState(true);

    const [formData, setFormData] = useState({
        // Account & Security
        accountName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        mobile: '',
        secondaryEmail: '',
        gender: '',
        dateOfBirth: '',

        // Shipping Address
        shippingStreet: '',
        shippingCity: '',
        shippingState: '',
        shippingCode: '',
        shippingCountry: '',

        // Billing Address
        billingStreet: '',
        billingCity: '',
        billingState: '',
        billingCode: '',
        billingCountry: '',

        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCopyToggle = () => {
        const newVal = !copyToBilling;
        setCopyToBilling(newVal);
        if (newVal) {
            setFormData(prev => ({
                ...prev,
                billingStreet: prev.shippingStreet,
                billingCity: prev.shippingCity,
                billingState: prev.shippingState,
                billingCode: prev.shippingCode,
                billingCountry: prev.shippingCountry
            }));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Logical step navigation
        if (step === 1) {
            setStep(2);
            return;
        }

        if (step === 2) {
            if (copyToBilling) {
                // Sync and jump to final step
                setFormData(prev => ({
                    ...prev,
                    billingStreet: prev.shippingStreet,
                    billingCity: prev.shippingCity,
                    billingState: prev.shippingState,
                    billingCode: prev.shippingCode,
                    billingCountry: prev.shippingCountry
                }));
                setStep(4);
            } else {
                setStep(3);
            }
            return;
        }

        if (step === 3) {
            setStep(4);
            return;
        }

        // Final Submission (Step 4)
        setLoading(true);
        try {
            // 1. Create Account with Addresses
            const accountResponse = await accountService.createAccount({
                accountName: formData.accountName,
                email: formData.email,
                phone: formData.phone,
                shippingStreet: formData.shippingStreet,
                shippingCity: formData.shippingCity,
                shippingState: formData.shippingState,
                shippingCode: formData.shippingCode,
                shippingCountry: formData.shippingCountry,
                billingStreet: copyToBilling ? formData.shippingStreet : formData.billingStreet,
                billingCity: copyToBilling ? formData.shippingCity : formData.billingCity,
                billingState: copyToBilling ? formData.shippingState : formData.billingState,
                billingCode: copyToBilling ? formData.shippingCode : formData.billingCode,
                billingCountry: copyToBilling ? formData.shippingCountry : formData.billingCountry,
                description: formData.description
            });

            if (!accountResponse.success || !accountResponse.data) {
                throw new Error(accountResponse.message || 'Failed to create account');
            }

            const accountId = accountResponse.data.id;

            const cleanContactData = {
                accountId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                mobile: formData.mobile || undefined,
                secondaryEmail: formData.secondaryEmail || undefined,
                gender: formData.gender || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                mailingStreet: formData.shippingStreet,
                mailingCity: formData.shippingCity,
                mailingState: formData.shippingState,
                mailingZip: formData.shippingCode,
                mailingCountry: formData.shippingCountry,
                description: formData.description,
                isPrimaryContact: true
            };

            // 2. Create Contact linked to account with identical mailing address
            const contactResponse = await contactService.createContact(cleanContactData);

            if (!contactResponse.success) {
                throw new Error(contactResponse.message || 'Failed to create user profile');
            }

            toast.success('Registration complete! Welcome aboard.');
            navigate('/login');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || 'Signup failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const prevStep = () => {
        if (step === 4 && copyToBilling) setStep(2);
        else setStep(prev => prev - 1);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-1.5 p-1.5 px-3 rounded-full bg-slate-950/50 border border-white/5">
                        {[1, 2, 3, 4].map((i) => {
                            if (copyToBilling && i === 3) return null;
                            return (
                                <React.Fragment key={i}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step === i ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' :
                                        step > i ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {step > i ? <CheckCircle2 className="h-4 w-4" /> : i}
                                    </div>
                                    {i < 4 && (copyToBilling && i === 2 ? null : true) && (
                                        <div className={`w-8 h-px transition-all duration-300 ${step > i ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                <CardTitle className="text-2xl font-black text-white tracking-tight">
                    {step === 1 && "Account & Registry"}
                    {step === 2 && "Shipping Address"}
                    {step === 3 && "Billing Address"}
                    {step === 4 && "Final Details"}
                </CardTitle>
                <CardDescription className="text-slate-400">
                    {step === 1 && "Basic identifiers for your profile"}
                    {step === 2 && "Where should we send your packages?"}
                    {step === 3 && "Where should we send the receipts?"}
                    {step === 4 && "Just a few more words about you"}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
                <form onSubmit={handleFormSubmit} className="space-y-6">

                    {/* Step 1: Account & Registry */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-indigo-500" /> Account Name</div>
                                    <span className="text-indigo-500 flex items-center gap-0.5"><Asterisk className="h-2.5 w-2.5" /> Required</span>
                                </label>
                                <Input name="accountName" placeholder="Gravity Inc." required value={formData.accountName} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-indigo-500" /> First Name</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-indigo-500" /> Last Name</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-indigo-500" /> Primary Email</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-500" /> Secondary Email</div>
                                        <span className="text-slate-500 text-[8px]">Optional</span>
                                    </label>
                                    <Input name="secondaryEmail" type="email" placeholder="Alt email" value={formData.secondaryEmail} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-indigo-500" /> Phone</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="phone" placeholder="+1..." required value={formData.phone} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5 text-slate-500" /> Mobile</div>
                                        <span className="text-slate-500 text-[8px]">Optional</span>
                                    </label>
                                    <Input name="mobile" placeholder="+1..." value={formData.mobile} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-indigo-500" /> Password</div>
                                    <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                </label>
                                <Input name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Shipping Address */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-indigo-500" /> Street Address</div>
                                    <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                </label>
                                <Input name="shippingStreet" placeholder="Street name" required value={formData.shippingStreet} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-indigo-500" /> City</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="shippingCity" placeholder="City" required value={formData.shippingCity} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-indigo-500" /> State</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="shippingState" placeholder="State" required value={formData.shippingState} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-indigo-500" /> Zip Code</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="shippingCode" placeholder="Code" required value={formData.shippingCode} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-indigo-500" /> Country</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="shippingCountry" placeholder="Country" required value={formData.shippingCountry} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>

                            <div
                                onClick={handleCopyToggle}
                                className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 cursor-pointer hover:bg-indigo-500/10 transition-all group mt-6 shadow-sm"
                            >
                                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${copyToBilling ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20' : 'border-slate-700'
                                    }`}>
                                    {copyToBilling && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                </div>
                                <span className={`text-sm font-medium transition-colors ${copyToBilling ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                    Apply address to Account & Billing
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Billing Address */}
                    {step === 3 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-indigo-500" /> Billing Street</div>
                                    <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                </label>
                                <Input name="billingStreet" placeholder="Street" required value={formData.billingStreet} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-indigo-500" /> Billing City</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="billingCity" placeholder="City" required value={formData.billingCity} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-indigo-500" /> Billing State</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="billingState" placeholder="State" required value={formData.billingState} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-indigo-500" /> Billing Zip</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="billingCode" placeholder="Code" required value={formData.billingCode} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-indigo-500" /> Billing Country</div>
                                        <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                    </label>
                                    <Input name="billingCountry" placeholder="Country" required value={formData.billingCountry} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Final Details */}
                    {step === 4 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-indigo-500" /> Gender</div>
                                        <span className="text-slate-500 text-[8px]">Optional</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange as any}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 h-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-inter appearance-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-indigo-500" /> Date of Birth</div>
                                        <span className="text-slate-500 text-[8px]">Optional</span>
                                    </label>
                                    <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="bg-slate-950/50 border-white/10 h-11" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                                    <div>Bio / Description</div>
                                    <Asterisk className="h-2.5 w-2.5 text-indigo-500" />
                                </label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    placeholder="Tell us about yourself or your organization..."
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-inter"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-8">
                        {step > 1 ? (
                            <Button type="button" variant="ghost" onClick={prevStep} className="gap-2 text-slate-400 hover:text-white">
                                <ChevronLeft className="h-4 w-4" /> Go Back
                            </Button>
                        ) : (
                            <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
                                Sign In Instead
                            </Link>
                        )}

                        <Button type="submit" className="gap-2 px-10 h-12 shadow-indigo-500/20" isLoading={loading}>
                            {step < 4 && !(step === 2 && copyToBilling) ? (
                                <>Continue <ChevronRight className="h-4 w-4" /></>
                            ) : (
                                <>Finish & Join <ChevronRight className="h-4 w-4" /></>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SignupPage;
