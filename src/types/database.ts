// TypeScript interfaces for database entities

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "student" | "super_admin";
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string | null;
  price: number;
  original_price: number | null;
  thumbnail_url: string | null;
  category: string;
  duration: string | null;
  level: "Beginner" | "Intermediate" | "Advanced";
  grade_level: string | null;
  is_published: boolean;
  students_count: number;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Updated UserWithRole to include "super_admin" to maintain 
 * consistency across the UserManagement dashboard.
 */
export interface UserWithRole extends Profile {
  email?: string;
  role: "admin" | "student" | "super_admin";
}

export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
}