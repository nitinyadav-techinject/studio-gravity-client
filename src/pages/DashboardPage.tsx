import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <Card className="hover:border-indigo-500/30 transition-colors">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
          {change} {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        </div>
      </div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Welcome back, <span className="text-indigo-500">{user?.firstName || 'User'}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Contacts" value="1,284" change="+12.5%" trend="up" icon={Users} />
        <StatCard title="Active Projects" value="43" change="+5.2%" trend="up" icon={Activity} />
        <StatCard title="Avg. Response" value="2.4h" change="-10%" trend="up" icon={Clock} />
        <StatCard title="Revenue Growth" value="+24%" change="+8.1%" trend="up" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">New contact signed up</p>
                    <p className="text-xs text-slate-400 mt-0.5">Alex Johnson from TechFlow Inc. joined your network</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">2h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">API Server</span>
              <span className="text-xs font-bold text-emerald-500">OPERATIONAL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Database</span>
              <span className="text-xs font-bold text-emerald-500">OPERATIONAL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Zoho Sync</span>
              <span className="text-xs font-bold text-amber-500">PENDING</span>
            </div>
            <div className="pt-4 border-t border-white/5">
              <Button variant="outline" className="w-full">View System Logs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
