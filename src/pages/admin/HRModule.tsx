import React, { useState, useEffect } from "react";
import { Users, Briefcase, Banknote, Plus, Search, Loader2, MoreVertical, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

// Added onAdd prop to connect with AdminDashboard drawer
const HRModule = ({ onAdd }: { onAdd: () => void }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('staff_profiles' as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setStaff(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter((member: any) => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Human Resources</h2>
          <p className="text-muted-foreground text-sm">Manage staff records, designations, and payroll.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-slate-200 hover:bg-slate-50">
            <Briefcase className="w-4 h-4 mr-2" /> Designations
          </Button>
          {/* CONNECTED TO DASHBOARD: triggers the "Add Staff Member" form */}
          <Button 
            onClick={onAdd}
            className="flex-1 md:flex-none bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Staff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#E11D48] shadow-sm">
          <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-[#E11D48]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{staff.length}</div>
            <p className="text-[10px] text-green-600 font-medium">Active personnel</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Payroll</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$0.00</div>
            <p className="text-[10px] text-muted-foreground italic">Next cycle: 1st March</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">94%</div>
            <p className="text-[10px] text-muted-foreground font-medium">Average this week</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10 focus-visible:ring-[#E11D48]" 
              placeholder="Search staff by name or employee ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold">Staff Member</TableHead>
                <TableHead className="font-bold">Designation</TableHead>
                <TableHead className="font-bold">Employee ID</TableHead>
                <TableHead className="font-bold">Joining Date</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E11D48] mb-2" />
                    <p className="text-muted-foreground">Fetching employee directory...</p>
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                    No staff members found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((member: any) => (
                  <TableRow key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                          {member.first_name[0]}{member.last_name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{member.first_name} {member.last_name}</div>
                          <div className="text-[10px] text-muted-foreground">{member.email || 'No email set'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium">
                        {member.designation || 'General Staff'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono font-bold text-red-500">{member.employee_id}</code>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {member.joining_date ? new Date(member.joining_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="hover:text-[#E11D48] hover:bg-red-50 font-bold">Pay</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRModule;