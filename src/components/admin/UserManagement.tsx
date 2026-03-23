import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserWithRole } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, User, Shield, Loader2, UserPlus } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();

  // Form State
  const [userType, setUserType] = useState<"student" | "teacher" | "parent">("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    grade_level: "", // For students
    subject: "",     // For teachers
    student_id: "",  // For parents to link
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          ...profile,
          // Updated to support super_admin
          role: (userRole?.role as "admin" | "student" | "super_admin") || "student",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            user_type: userType,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ 
            user_id: authData.user.id, 
            role: userType === "student" ? "student" : "admin" 
          });

        if (roleError) throw roleError;

        toast({
          title: "User Created",
          description: `${formData.full_name} has been added as a ${userType}.`,
        });
        
        setIsAddUserOpen(false);
        fetchUsers();
      }
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Updated parameter type to include super_admin
  const handleRoleChange = async (userId: string, newRole: "admin" | "student" | "super_admin") => {
    setUpdatingUserId(userId);
    try {
      const { data: existingRole, error: checkError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingRole) {
        const { error: updateError } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("user_id", userId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole });
        if (insertError) throw insertError;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Role Updated",
        description: `User role has been changed to ${newRole}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E11D48] hover:bg-[#BE123C] gap-2">
              <UserPlus className="w-4 h-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new account for a student, teacher, or parent.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddUser} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>I want to add a...</Label>
                <Select value={userType} onValueChange={(v: any) => setUserType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@school.com" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>

              {userType === "student" && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <Label htmlFor="grade">Grade Level</Label>
                  <Input id="grade" placeholder="e.g. Grade 10" onChange={(e) => setFormData({...formData, grade_level: e.target.value})} />
                </div>
              )}

              {userType === "teacher" && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <Label htmlFor="subject">Primary Subject</Label>
                  <Input id="subject" placeholder="e.g. Mathematics" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>
              )}

              {userType === "parent" && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <Label htmlFor="student_id">Linked Student ID</Label>
                  <Input id="student_id" placeholder="Enter student's Unique ID" onChange={(e) => setFormData({...formData, student_id: e.target.value})} />
                </div>
              )}

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#E11D48] hover:bg-[#BE123C]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="User" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-medium text-foreground">{user.full_name || "No Name"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-secondary px-2 py-1 rounded">{user.user_id.slice(0, 8)}...</code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("en-PK")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" || user.role === "super_admin" ? "default" : "secondary"} className="gap-1">
                      {user.role === "admin" || user.role === "super_admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: any) => handleRoleChange(user.user_id, value)}
                      disabled={updatingUserId === user.user_id}
                    >
                      <SelectTrigger className="w-32">
                        {updatingUserId === user.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <SelectValue />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        {/* Only show Super Admin option for existing Super Admins */}
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total Users: <strong className="text-foreground">{users.length}</strong></span>
        <span>Admins: <strong className="text-foreground">{users.filter((u) => u.role === "admin").length}</strong></span>
        <span>Students: <strong className="text-foreground">{users.filter((u) => u.role === "student").length}</strong></span>
      </div>
    </div>
  );
};

export default UserManagement;