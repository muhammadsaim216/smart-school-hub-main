import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Loader2,
  BookOpen,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  instructor: z.string().min(2, "Instructor name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  original_price: z.number().optional(),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  duration: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  grade_level: z.string().optional(),
  is_published: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

const categories = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Science",
  "Entry Test",
];

const gradeLevels = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8",
  "Class 9", "Class 10", "Class 11", "Class 12",
  "Entry Test",
];

const CourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    instructor: "",
    description: "",
    price: 0,
    original_price: undefined,
    thumbnail_url: "",
    category: "Science",
    duration: "",
    level: "Beginner",
    grade_level: "",
    is_published: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion since we know the structure matches
      setCourses((data || []) as Course[]);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      instructor: "",
      description: "",
      price: 0,
      original_price: undefined,
      thumbnail_url: "",
      category: "Science",
      duration: "",
      level: "Beginner",
      grade_level: "",
      is_published: false,
    });
    setEditingCourse(null);
    setErrors({});
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      instructor: course.instructor,
      description: course.description || "",
      price: Number(course.price),
      original_price: course.original_price ? Number(course.original_price) : undefined,
      thumbnail_url: course.thumbnail_url || "",
      category: course.category,
      duration: course.duration || "",
      level: course.level,
      grade_level: course.grade_level || "",
      is_published: course.is_published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = courseSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    try {
      const courseData = {
        title: formData.title,
        instructor: formData.instructor,
        description: formData.description || null,
        price: formData.price,
        original_price: formData.original_price || null,
        thumbnail_url: formData.thumbnail_url || null,
        category: formData.category,
        duration: formData.duration || null,
        level: formData.level,
        grade_level: formData.grade_level || null,
        is_published: formData.is_published,
      };

      if (editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update(courseData)
          .eq("id", editingCourse.id);

        if (error) throw error;

        toast({
          title: "Course Updated",
          description: "Course has been updated successfully",
        });
      } else {
        const { error } = await supabase.from("courses").insert(courseData);

        if (error) throw error;

        toast({
          title: "Course Created",
          description: "New course has been added successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Course Deleted",
        description: "Course has been removed",
      });

      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_published: !course.is_published })
        .eq("id", course.id);

      if (error) throw error;

      toast({
        title: course.is_published ? "Course Unpublished" : "Course Published",
        description: course.is_published
          ? "Course is now hidden from students"
          : "Course is now visible to students",
      });

      fetchCourses();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g., Physics Complete - Class 9"
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor *</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instructor: e.target.value,
                      }))
                    }
                    placeholder="e.g., Prof. Dr. Ahmad Khan"
                    className={errors.instructor ? "border-destructive" : ""}
                  />
                  {errors.instructor && (
                    <p className="text-sm text-destructive">{errors.instructor}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Course description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PKR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    min={0}
                    className={errors.price ? "border-destructive" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (PKR)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        original_price: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    min={0}
                    placeholder="For discounts"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 45h"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") =>
                      setFormData((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Select
                    value={formData.grade_level}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, grade_level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeLevels.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_published: checked }))
                    }
                  />
                  <Label htmlFor="is_published">Publish immediately</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingCourse ? (
                      "Update Course"
                    ) : (
                      "Create Course"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No courses found</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Add Course" to create your first course
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">
                          {course.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {course.instructor}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.category}</Badge>
                    {course.grade_level && (
                      <Badge variant="outline" className="ml-1">
                        {course.grade_level}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">
                        {formatPrice(Number(course.price))}
                      </span>
                      {course.original_price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatPrice(Number(course.original_price))}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.level === "Beginner"
                          ? "secondary"
                          : course.level === "Advanced"
                          ? "default"
                          : "outline"
                      }
                    >
                      {course.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={course.is_published}
                      onCheckedChange={() => togglePublish(course)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(course)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>
          Total Courses:{" "}
          <strong className="text-foreground">{courses.length}</strong>
        </span>
        <span>
          Published:{" "}
          <strong className="text-foreground">
            {courses.filter((c) => c.is_published).length}
          </strong>
        </span>
        <span>
          Draft:{" "}
          <strong className="text-foreground">
            {courses.filter((c) => !c.is_published).length}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default CourseManager;
