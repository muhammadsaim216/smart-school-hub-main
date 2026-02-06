import AdminLayout from "@/components/admin/AdminLayout";
import CourseManager from "@/components/admin/CourseManager";

const AdminCourses = () => {
  return (
    <AdminLayout
      title="Course Manager"
      description="Add, edit, and manage all courses"
    >
      <CourseManager />
    </AdminLayout>
  );
};

export default AdminCourses;
