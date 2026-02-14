import React, { useState, useEffect } from "react";
import { GraduationCap, Award, FileSpreadsheet, Search, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// Added onAdd prop to connect with AdminDashboard
const ExamModule = ({ onAdd }: { onAdd: () => void }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExamData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exam_marks' as any)
      .select(`
        marks_obtained,
        max_marks,
        students (first_name, last_name, admission_no),
        exam_types (name)
      `);
    
    if (!error) setExams(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExamData();
  }, []);

  // Logic to calculate stats for the cards
  const passCount = exams.filter((e: any) => (e.marks_obtained / e.max_marks) >= 0.33).length;
  const passPercentage = exams.length > 0 ? ((passCount / exams.length) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Examinations & Grading</h2>
          <p className="text-muted-foreground text-sm">Monitor student performance and session results.</p>
        </div>
        {/* Linked to Dashboard Drawer */}
        <Button onClick={onAdd} className="bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-md">
          <Award className="w-4 h-4 mr-2" /> Add Marks
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.4%</div>
            <p className="text-[10px] text-green-600 font-medium">+2.1% from last term</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#E11D48] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pass Percentage</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-[#E11D48]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passPercentage}%</div>
            <p className="text-[10px] text-muted-foreground">Total {exams.length} records</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Performer</CardTitle>
            <GraduationCap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {exams.length > 0 ? `${exams[0].students?.first_name} ${exams[0].students?.last_name[0]}.` : "N/A"}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Distinction level</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold">Student Details</TableHead>
                <TableHead className="font-semibold">Examination</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Percentage</TableHead>
                <TableHead className="text-right font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E11D48] mb-2" />
                    <p className="text-muted-foreground">Compiling gradebook...</p>
                  </TableCell>
                </TableRow>
              ) : exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                    No examination records found.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam: any, idx) => {
                  const percentage = (exam.marks_obtained / exam.max_marks) * 100;
                  const isPassed = percentage >= 33;
                  
                  return (
                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="font-bold text-slate-800">{exam.students?.first_name} {exam.students?.last_name}</div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">{exam.students?.admission_no}</div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-600">{exam.exam_types?.name}</TableCell>
                      <TableCell className="font-semibold">
                        {exam.marks_obtained} <span className="text-slate-300 font-normal">/</span> {exam.max_marks}
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-[100px] space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={isPassed ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-red-100 text-red-700 hover:bg-red-100 border-none"}>
                          {isPassed ? "PASSED" : "FAILED"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamModule;