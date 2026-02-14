import React, { useState, useEffect } from "react";
import { Search, Filter, UserPlus, GraduationCap, MoreVertical, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

// Define the interface to accept the onAdd function from the Dashboard
interface StudentModuleProps {
  onAdd: () => void;
}

const StudentModule = ({ onAdd }: StudentModuleProps) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('students' as any)
        .select(`*, classes (class_name), sections (section_name)`);
      
      if (!error) setStudents(data || []);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Student Directory</h2>
          <p className="text-muted-foreground text-sm">Manage student records and admissions.</p>
        </div>
        
        {/* FIXED BUTTON: Added onClick={onAdd} and matched your red screenshot style */}
        <Button 
          onClick={onAdd} 
          className="bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-lg h-11 px-6 rounded-lg transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          <span className="font-semibold text-lg">Admit New Student</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50/50 border-red-100 border-l-4 border-l-red-500">
          <CardHeader className="py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-red-600 uppercase tracking-wider">Total Students</CardTitle>
            <GraduationCap className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{students.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-slate-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 border-slate-200 focus:ring-red-500" placeholder="Search by name or admission no..." />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-700">Admission No</TableHead>
                <TableHead className="font-bold text-slate-700">Student Name</TableHead>
                <TableHead className="font-bold text-slate-700">Class/Section</TableHead>
                <TableHead className="font-bold text-slate-700">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400">Loading student database...</TableCell></TableRow>
              ) : (
                students.map((student: any) => (
                  <TableRow key={student.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-xs font-bold text-red-600">{student.admission_no}</TableCell>
                    <TableCell className="font-medium text-slate-800">{student.first_name} {student.last_name}</TableCell>
                    <TableCell className="text-slate-600">{student.classes?.class_name} - {student.sections?.section_name}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border-none hover:bg-green-100">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:text-red-600 transition-colors"><MoreVertical className="h-4 w-4" /></Button>
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

export default StudentModule;