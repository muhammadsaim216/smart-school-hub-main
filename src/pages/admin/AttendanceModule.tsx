import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AttendanceModule = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Track which student is currently being updated to show a spinner on the button
  const [processingId, setProcessingId] = useState<string | null>(null);
  // Store current day's attendance to highlight buttons
  const [dailyStatus, setDailyStatus] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    // 1. Fetch Students
    const { data: studentData } = await supabase.from('students' as any).select('*');
    
    // 2. Fetch existing attendance for the selected date
    const { data: attendanceData } = await supabase
      .from('attendance' as any)
      .select('student_id, status')
      .eq('date', attendanceDate);

    if (studentData) setStudents(studentData);
    
    // Create a map of student_id -> status for easy UI lookup
    const statusMap: Record<string, string> = {};
    attendanceData?.forEach((record: any) => {
      statusMap[record.student_id] = record.status;
    });
    setDailyStatus(statusMap);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [attendanceDate]);

  const markAttendance = async (studentId: string, status: string) => {
    setProcessingId(studentId);
    
    const { error } = await supabase
      .from('attendance' as any)
      .upsert({ 
        student_id: studentId, 
        date: attendanceDate, 
        status: status 
      }, { onConflict: 'student_id, date' });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Update local state so UI reflects the change immediately
      setDailyStatus(prev => ({ ...prev, [studentId]: status }));
    }
    setProcessingId(null);
  };

  const filteredStudents = students.filter((s: any) => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance Management</h2>
          <p className="text-muted-foreground text-sm">Daily roll call for {new Date(attendanceDate).toDateString()}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white border shadow-sm p-2 rounded-xl">
          <CalendarIcon className="w-4 h-4 text-[#E11D48]" />
          <input 
            type="date" 
            value={attendanceDate} 
            onChange={(e) => setAttendanceDate(e.target.value)} 
            className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer" 
          />
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pl-10 focus-visible:ring-[#E11D48]" 
          placeholder="Search student..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E11D48] mb-2" />
            <p className="text-muted-foreground">Loading class list...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">No students found.</p>
          </div>
        ) : (
          filteredStudents.map((student: any) => (
            <Card key={student.id} className="overflow-hidden border-slate-200 transition-all hover:shadow-md">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {student.first_name[0]}{student.last_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{student.first_name} {student.last_name}</p>
                    <p className="text-xs font-mono text-red-500">{student.admission_no}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant={dailyStatus[student.id] === 'present' ? 'default' : 'outline'} 
                    size="sm" 
                    disabled={processingId === student.id}
                    onClick={() => markAttendance(student.id, 'present')} 
                    className={`flex-1 sm:flex-none transition-all ${dailyStatus[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : 'hover:border-green-500 hover:text-green-600'}`}
                  >
                    {processingId === student.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />} 
                    Present
                  </Button>

                  <Button 
                    variant={dailyStatus[student.id] === 'absent' ? 'default' : 'outline'} 
                    size="sm" 
                    disabled={processingId === student.id}
                    onClick={() => markAttendance(student.id, 'absent')} 
                    className={`flex-1 sm:flex-none transition-all ${dailyStatus[student.id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : 'hover:border-red-500 hover:text-red-600'}`}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Absent
                  </Button>

                  <Button 
                    variant={dailyStatus[student.id] === 'late' ? 'default' : 'outline'} 
                    size="sm" 
                    disabled={processingId === student.id}
                    onClick={() => markAttendance(student.id, 'late')} 
                    className={`flex-1 sm:flex-none transition-all ${dailyStatus[student.id] === 'late' ? 'bg-amber-500 hover:bg-amber-600' : 'hover:border-amber-500 hover:text-amber-600'}`}
                  >
                    <Clock className="w-4 h-4 mr-1" /> Late
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceModule;