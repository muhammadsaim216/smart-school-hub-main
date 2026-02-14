import React, { useState, useEffect } from "react";
import { Plus, BookOpen, Calendar, Layers, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AcademicModule = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    const { data: sessionData } = await supabase.from('academic_sessions' as any).select('*');
    const { data: classData } = await supabase.from('classes' as any).select('*');
    if (sessionData) setSessions(sessionData);
    if (classData) setClasses(classData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Academic Core</h2>
        <p className="text-muted-foreground">Manage the structural foundation of your school.</p>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>

        {/* Module 6: Academic Sessions */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Academic Sessions</CardTitle>
                <CardDescription>Configure years like 2025-2026</CardDescription>
              </div>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Session</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <p className="text-sm text-center py-8 text-muted-foreground">No sessions created yet.</p>
                ) : (
                  sessions.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">{s.year_name}</span>
                      </div>
                      {s.is_active && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Module 7: Classes */}
        <TabsContent value="classes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Class Management</CardTitle>
                <CardDescription>Define grades from Nursery to 12th</CardDescription>
              </div>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Class</Button>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classes.map((c: any) => (
                  <div key={c.id} className="p-4 border rounded-xl bg-muted/20 flex items-center gap-3">
                    <Layers className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{c.class_name}</span>
                  </div>
                ))}
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Module 7: Sections */}
        <TabsContent value="sections">
           <Card>
            <CardHeader>
              <CardTitle>Section Management</CardTitle>
              <CardDescription>Sub-divide classes (e.g., Grade 10-A)</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <Hash className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a class to manage its sections.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicModule;