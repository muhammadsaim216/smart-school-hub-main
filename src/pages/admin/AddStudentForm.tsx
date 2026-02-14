import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, X } from "lucide-react";

interface AddStudentFormProps {
  onSuccess: () => void;
  onCancel?: () => void; // Added to allow closing the drawer/modal
}

const AddStudentForm = ({ onSuccess, onCancel }: AddStudentFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState<any[]>([]);
  
  // Form State
  const [studentData, setStudentData] = useState({
    first_name: "",
    last_name: "",
    admission_no: `ADM-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-gen
    parent_phone: "",
    class_id: "",
    status: "active" // Default status
  });

  // Fetch Classes for the dropdown
  useEffect(() => {
    const getClasses = async () => {
      const { data, error } = await supabase
        .from('classes' as any)
        .select('*')
        .order('class_name', { ascending: true });
      
      if (data) setClassList(data);
      if (error) console.error("Error fetching classes:", error);
    };
    getClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData.class_id) {
      toast({ title: "Required Field", description: "Please select a class.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('students' as any)
      .insert([studentData]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "Admission Successful", 
        description: `${studentData.first_name} has been added to the directory.`,
        className: "bg-green-50 border-green-200"
      });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5 p-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">First Name</Label>
            <Input 
              required 
              placeholder="e.g. John"
              className="focus-visible:ring-[#E11D48]"
              value={studentData.first_name} 
              onChange={e => setStudentData({...studentData, first_name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">Last Name</Label>
            <Input 
              required 
              placeholder="e.g. Doe"
              className="focus-visible:ring-[#E11D48]"
              value={studentData.last_name} 
              onChange={e => setStudentData({...studentData, last_name: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Admission Number</Label>
          <Input 
            disabled 
            className="bg-slate-50 border-dashed font-mono font-bold text-[#E11D48]"
            value={studentData.admission_no} 
          />
          <p className="text-[10px] text-muted-foreground italic">System generated unique ID</p>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Assign Class</Label>
          <Select onValueChange={(val) => setStudentData({...studentData, class_id: val})}>
            <SelectTrigger className="focus:ring-[#E11D48]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classList.length > 0 ? (
                classList.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>
                ))
              ) : (
                <div className="p-2 text-xs text-center text-muted-foreground">No classes found</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Parent / Guardian Phone</Label>
          <Input 
            required 
            type="tel" 
            placeholder="+1 (555) 000-0000"
            className="focus-visible:ring-[#E11D48]"
            value={studentData.parent_phone} 
            onChange={e => setStudentData({...studentData, parent_phone: e.target.value})} 
          />
        </div>

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="flex-[2] bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-lg transition-all active:scale-95" 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Confirm Admission
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;