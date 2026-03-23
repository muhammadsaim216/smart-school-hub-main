import React, { useState, useEffect } from "react";
import { Search, CreditCard, Download, AlertCircle, Loader2, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

// Added onAdd prop to connect with AdminDashboard drawer
const FinanceModule = ({ onAdd }: { onAdd: () => void }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_fees' as any)
      .select(`
        *,
        students (first_name, last_name, admission_no),
        fee_masters (amount, fee_groups (name))
      `);
    
    if (!error) setFees(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // Calculate Totals for the header cards
  const totalCollected = fees.reduce((acc, curr: any) => acc + (Number(curr.amount_paid) || 0), 0);
  const totalPending = fees.reduce((acc, curr: any) => {
    const total = Number(curr.fee_masters?.amount) || 0;
    const paid = Number(curr.amount_paid) || 0;
    return acc + (total - paid);
  }, 0);

  const filteredFees = fees.filter((fee: any) => 
    `${fee.students?.first_name} ${fee.students?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.students?.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Finance & Fees</h2>
          <p className="text-muted-foreground text-sm">Monitor collections and manage student invoices.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-slate-200">
            <Download className="w-4 h-4 mr-2" /> Report
          </Button>
          {/* UPDATED: Removed DollarSign icon and replaced with Rs. text for PKR */}
          <Button 
            onClick={onAdd}
            className="flex-1 md:flex-none bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-lg transition-all active:scale-95 font-bold"
          >
            <span className="mr-2 text-xs">Rs.</span> Collect Fee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Rs. {totalCollected.toLocaleString()}</div>
            <p className="text-[10px] text-green-600 font-medium">Synced with database</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#E11D48] shadow-sm">
          <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Dues</CardTitle>
            <AlertCircle className="h-4 w-4 text-[#E11D48]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E11D48]">Rs. {totalPending.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground italic">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Records</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{fees.length}</div>
            <p className="text-[10px] text-muted-foreground">Invoices generated</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10 focus-visible:ring-[#E11D48]" 
              placeholder="Search student name or admission no..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold">Student</TableHead>
                <TableHead className="font-bold">Fee Type</TableHead>
                <TableHead className="font-bold">Total Amount</TableHead>
                <TableHead className="font-bold">Paid</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E11D48] mb-2" />
                    <p className="text-muted-foreground">Accessing ledger...</p>
                  </TableCell>
                </TableRow>
              ) : filteredFees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                    No financial records match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFees.map((fee: any) => (
                  <TableRow key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="font-bold text-slate-800">{fee.students?.first_name} {fee.students?.last_name}</div>
                      <div className="text-[10px] font-mono text-red-500 uppercase">{fee.students?.admission_no}</div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">{fee.fee_masters?.fee_groups?.name || 'General'}</TableCell>
                    <TableCell className="font-semibold">Rs. {fee.fee_masters?.amount || 0}</TableCell>
                    <TableCell className="text-green-600 font-bold">Rs. {fee.amount_paid}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          fee.status === 'paid' 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-red-50 text-[#E11D48] border-red-100"
                        }
                      >
                        {fee.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hover:text-[#E11D48] hover:bg-red-50">Details</Button>
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

export default FinanceModule;