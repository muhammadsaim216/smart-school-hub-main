import React, { useState, useEffect } from "react";
import { Plus, School, Globe, Palette, Shield, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SchoolsModule = () => {
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Stats State
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSubs: 0,
    totalStudents: 0
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    email: "",
    color: "#3b82f6"
  });

  // Fetch real stats from Supabase on load
  useEffect(() => {
    const fetchStats = async () => {
      const { count: schoolCount } = await supabase.from('schools' as any).select('*', { count: 'exact', head: true });
      // Note: activeSubs and totalStudents would fetch from their respective tables once built
      setStats(prev => ({ ...prev, totalSchools: schoolCount || 0 }));
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('schools'as any )
        .insert([
          { 
            name: formData.name, 
            subdomain: formData.subdomain,
            primary_color: formData.color,
            // admin_email would usually be handled via an Edge Function to create a user
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: `${formData.name} has been onboarded successfully.`,
      });
      
      setIsAddingSchool(false);
      // Refresh Stats
      setStats(prev => ({ ...prev, totalSchools: prev.totalSchools + 1 }));
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schools Management</h2>
          <p className="text-muted-foreground">Onboard and configure multi-tenant school instances.</p>
        </div>
        <Button onClick={() => setIsAddingSchool(!isAddingSchool)} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Onboard New School
        </Button>
      </div>

      {isAddingSchool && (
        <Card className="border-primary/50 bg-primary/5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle>School Registration</CardTitle>
            <CardDescription>Enter the details to create a new school tenant.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input 
                    id="schoolName" 
                    required
                    placeholder="e.g. International Excellence School" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain / ID</Label>
                  <div className="flex">
                    <Input 
                      id="subdomain" 
                      required
                      placeholder="excellence-school" 
                      className="rounded-r-none" 
                      value={formData.subdomain}
                      onChange={(e) => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-sm">
                      .smartschool.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Admin Email</Label>
                  <Input 
                    id="contact" 
                    type="email" 
                    required
                    placeholder="admin@school.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Branding Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 p-1 h-10" 
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                    />
                    <Input 
                      placeholder="#3b82f6" 
                      className="font-mono" 
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingSchool(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create School Tenant
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Schools</CardDescription>
            <CardTitle className="text-2xl font-bold">{stats.totalSchools}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Subscriptions</CardDescription>
            <CardTitle className="text-2xl font-bold">{stats.activeSubs}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students (Global)</CardDescription>
            <CardTitle className="text-2xl font-bold">{stats.totalStudents}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default SchoolsModule;