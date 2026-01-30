# Schema Plan for EduCraft

## Overview
This schema supports an e-learning platform with educators, students, courses, video lessons, quizzes, progress tracking, and discussion forums. It leverages Supabase Auth for user management and maps users to a `profiles` table.

## Tables

### 1. `profiles`
- **Purpose**: Stores extended user information linked to Supabase Auth.
- **Columns**:
  - `id` (uuid, PK, references auth.users.id)
  - `email` (text)
  - `full_name` (text)
  - `avatar_url` (text)
  - `role` (text) - Enum-like: 'student', 'educator', 'admin'. Default: 'student'.
  - `bio` (text)
  - `created_at` (timestamptz)

### 2. `courses`
- **Purpose**: The core entity representing a class/course.
- **Columns**:
  - `id` (uuid, PK)
  - `instructor_id` (uuid, FK to profiles.id)
  - `title` (text)
  - `description` (text)
  - `thumbnail_url` (text)
  - `price` (decimal)
  - `is_published` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

### 3. `modules`
- **Purpose**: Groups lessons into sections or chapters.
- **Columns**:
  - `id` (uuid, PK)
  - `course_id` (uuid, FK to courses.id)
  - `title` (text)
  - `order_index` (integer)
  - `created_at` (timestamptz)

### 4. `lessons`
- **Purpose**: Individual learning units (videos, text).
- **Columns**:
  - `id` (uuid, PK)
  - `module_id` (uuid, FK to modules.id)
  - `title` (text)
  - `content` (text) - Markdown text or description.
  - `video_url` (text) - URL to video storage (e.g., Supabase Storage, Mux, YouTube).
  - `duration` (integer) - Duration in seconds.
  - `is_free_preview` (boolean)
  - `order_index` (integer)
  - `created_at` (timestamptz)

### 5. `enrollments`
- **Purpose**: Tracks which students are taking which courses.
- **Columns**:
  - `id` (uuid, PK)
  - `student_id` (uuid, FK to profiles.id)
  - `course_id` (uuid, FK to courses.id)
  - `enrolled_at` (timestamptz)
  - `completed_at` (timestamptz, nullable)

### 6. `lesson_progress`
- **Purpose**: Granular tracking of lesson completion.
- **Columns**:
  - `id` (uuid, PK)
  - `enrollment_id` (uuid, FK to enrollments.id)
  - `lesson_id` (uuid, FK to lessons.id)
  - `is_completed` (boolean)
  - `last_watched_position` (integer) - Timestamp in seconds where user left off.
  - `updated_at` (timestamptz)

### 7. `quizzes`
- **Purpose**: Assessments. Can be attached to a specific Module or Lesson (simplified to lesson association here for flexibility, or standalone).
- **Columns**:
  - `id` (uuid, PK)
  - `course_id` (uuid, FK to courses.id) - Optional direct link.
  - `module_id` (uuid, FK to modules.id) - Where the quiz lives in the structure.
  - `title` (text)
  - `created_at` (timestamptz)

### 8. `quiz_questions`
- **Purpose**: Individual questions within a quiz.
- **Columns**:
  - `id` (uuid, PK)
  - `quiz_id` (uuid, FK to quizzes.id)
  - `question_text` (text)
  - `question_type` (text) - 'multiple_choice', 'true_false'.
  - `options` (jsonb) - Array of possible answers.
  - `correct_answer` (text)
  - `order_index` (integer)

### 9. `certificates`
- **Purpose**: Proof of course completion.
- **Columns**:
  - `id` (uuid, PK)
  - `enrollment_id` (uuid, FK to enrollments.id)
  - `issued_at` (timestamptz)
  - `certificate_code` (text, unique) - For validation.
  - `certificate_url` (text)

### 10. `forum_threads`
- **Purpose**: Discussion topics associated with a course.
- **Columns**:
  - `id` (uuid, PK)
  - `course_id` (uuid, FK to courses.id)
  - `author_id` (uuid, FK to profiles.id)
  - `title` (text)
  - `content` (text)
  - `created_at` (timestamptz)

### 11. `forum_posts`
- **Purpose**: Replies to threads.
- **Columns**:
  - `id` (uuid, PK)
  - `thread_id` (uuid, FK to forum_threads.id)
  - `author_id` (uuid, FK to profiles.id)
  - `content` (text)
  - `created_at` (timestamptz)

## Security Policies (RLS Strategy)
1.  **Profiles**:
    -   `SELECT`: Public (or authenticated only).
    -   `UPDATE`: Users can update their own profile.
2.  **Courses**:
    -   `SELECT`: Public for published courses.
    -   `INSERT/UPDATE/DELETE`: Only `instructor_id` matches auth.uid.
3.  **Enrollments**:
    -   `SELECT`: Users can see their own enrollments. Instructors can see enrollments for their courses.
    -   `INSERT`: Users can enroll (might need server-side logic for paid).
4.  **Content (Modules/Lessons)**:
    -   `SELECT`: Public preview if `is_free_preview`. Otherwise, requires existence of `enrollment` record for the user.
