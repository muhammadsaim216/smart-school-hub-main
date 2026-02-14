import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Calendar, Loader2, Info, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// Added onAdd prop to connect with AdminDashboard drawer
const NoticeModule = ({ onAdd }: { onAdd: () => void }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements' as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setNotices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Communication Hub</h2>
          <p className="text-muted-foreground text-sm">Broadcast news, events, and alerts to the school community.</p>
        </div>
        {/* CONNECTED TO DASHBOARD: triggers the "Post Announcement" form */}
        <Button 
          onClick={onAdd}
          className="bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-lg transition-all active:scale-95 w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Post Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <Bell className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase">Recent</p>
              <p className="text-2xl font-bold text-blue-900">{notices.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20 bg-white border rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E11D48] mb-2" />
            <p className="text-muted-foreground">Fetching bulletin board...</p>
          </div>
        ) : notices.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No Announcements</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Keep your students and staff updated by posting your first notice.
            </p>
          </Card>
        ) : (
          notices.map((n: any) => (
            <Card key={n.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
              <div className="h-1 bg-[#E11D48]/10 w-full" />
              <CardHeader className="flex flex-row items-start justify-between gap-4 py-4">
                <div className="flex flex-row items-center gap-4">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <Megaphone className="w-5 h-5 text-[#E11D48]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">{n.title}</CardTitle>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> 
                        {new Date(n.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 text-[10px] font-bold uppercase">
                        {n.target_audience || 'All'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {n.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeModule;