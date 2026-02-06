import AdminLayout from "@/components/admin/AdminLayout";
import UserManagement from "@/components/admin/UserManagement";

const AdminUsers = () => {
  return (
    <AdminLayout
      title="User Management"
      description="View and manage all users and their roles"
    >
      <UserManagement />
    </AdminLayout>
  );
};

export default AdminUsers;
