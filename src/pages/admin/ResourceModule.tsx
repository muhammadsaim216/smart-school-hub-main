import React, { useState, useEffect } from "react";
import { Package, Book, Plus, AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

const ResourceModule = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase.from('inventory_items' as any).select('*');
      if (data) setInventory(data);
      setLoading(false);
    };
    fetchResources();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Resources & Assets</h2>
        <p className="text-muted-foreground">Manage school inventory and library books.</p>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory"><Package className="w-4 h-4 mr-2" /> Inventory</TabsTrigger>
          <TabsTrigger value="library"><Book className="w-4 h-4 mr-2" /> Library</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Inventory</CardTitle>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No inventory items found.</TableCell></TableRow>
                  ) : (
                    inventory.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.quantity < 5 ? (
                            <span className="flex items-center text-red-500 text-xs font-bold"><AlertTriangle className="w-3 h-3 mr-1" /> LOW STOCK</span>
                          ) : (
                            <span className="text-green-500 text-xs font-bold">IN STOCK</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <div className="bg-card border border-dashed rounded-xl p-12 text-center">
            <Book className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Library System</h3>
            <p className="text-muted-foreground">The digital catalog for books and circulation tracking is ready for data entry.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceModule;