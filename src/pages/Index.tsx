import React from 'react';
import { CrowdDataProvider } from '@/contexts/CrowdDataContext';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import AlertBanner from '@/components/dashboard/AlertBanner';
import LiveMonitoring from '@/components/dashboard/LiveMonitoring';
import AdvancedAlerts from '@/components/dashboard/AdvancedAlerts';
import Analytics from '@/components/dashboard/Analytics';
import Configuration from '@/components/dashboard/Configuration';
import SystemHealth from '@/components/dashboard/SystemHealth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, AlertTriangle, BarChart3, Settings, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AlertBanner />
        <div className="flex-1 p-4 overflow-y-auto">
          <Tabs defaultValue="live" className="h-full flex flex-col">
            <TabsList className="w-fit bg-secondary border border-border mb-4">
              <TabsTrigger value="live" className="text-xs gap-1.5 data-[state=active]:bg-card">
                <Monitor className="w-3.5 h-3.5" /> Live Monitoring
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs gap-1.5 data-[state=active]:bg-card">
                <AlertTriangle className="w-3.5 h-3.5" /> Alerts & Warnings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs gap-1.5 data-[state=active]:bg-card">
                <BarChart3 className="w-3.5 h-3.5" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="config" className="text-xs gap-1.5 data-[state=active]:bg-card">
                <Settings className="w-3.5 h-3.5" /> Configuration
              </TabsTrigger>
              <TabsTrigger value="health" className="text-xs gap-1.5 data-[state=active]:bg-card">
                <Activity className="w-3.5 h-3.5" /> System Health
              </TabsTrigger>
            </TabsList>
            <TabsContent value="live" className="flex-1"><LiveMonitoring /></TabsContent>
            <TabsContent value="alerts" className="flex-1"><AdvancedAlerts /></TabsContent>
            <TabsContent value="analytics" className="flex-1"><Analytics /></TabsContent>
            <TabsContent value="config" className="flex-1"><Configuration /></TabsContent>
            <TabsContent value="health" className="flex-1"><SystemHealth /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => (
  <CrowdDataProvider>
    <Dashboard />
  </CrowdDataProvider>
);

export default Index;
