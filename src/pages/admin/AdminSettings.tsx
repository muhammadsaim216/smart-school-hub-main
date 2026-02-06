import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

const AdminSettings = () => {
  return (
    <AdminLayout
      title="Settings"
      description="Configure platform settings"
    >
      <div className="max-w-2xl space-y-8">
        {/* General Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Smart School" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                defaultValue="support@smartschool.pk"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for new enrollments
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Course Completion Alerts
                </p>
                <p className="text-sm text-muted-foreground">
                  Notify when students complete courses
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Payment Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" defaultValue="PKR" disabled />
              <p className="text-sm text-muted-foreground">
                Currency is fixed to Pakistani Rupees
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Test Mode</p>
                <p className="text-sm text-muted-foreground">
                  Enable test mode for payment gateway
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
