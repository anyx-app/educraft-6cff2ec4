-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'educator', 'admin')),
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Create Profile Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- COURSES
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  instructor_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  thumbnail_url text,
  price decimal(10, 2) default 0.00,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.courses enable row level security;

-- MODULES
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  order_index integer default 0,
  created_at timestamptz default now()
);
alter table public.modules enable row level security;

-- LESSONS
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  content text,
  video_url text,
  duration integer default 0,
  is_free_preview boolean default false,
  order_index integer default 0,
  created_at timestamptz default now()
);
alter table public.lessons enable row level security;

-- ENROLLMENTS
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(student_id, course_id)
);
alter table public.enrollments enable row level security;

-- LESSON PROGRESS
create table public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  enrollment_id uuid references public.enrollments(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  is_completed boolean default false,
  last_watched_position integer default 0,
  updated_at timestamptz default now(),
  unique(enrollment_id, lesson_id)
);
alter table public.lesson_progress enable row level security;

-- QUIZZES (Simplified: linked to module)
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  created_at timestamptz default now()
);
alter table public.quizzes enable row level security;

-- QUIZ QUESTIONS
create table public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  question_type text default 'multiple_choice',
  options jsonb default '[]'::jsonb,
  correct_answer text,
  order_index integer default 0
);
alter table public.quiz_questions enable row level security;

-- CERTIFICATES
create table public.certificates (
  id uuid default uuid_generate_v4() primary key,
  enrollment_id uuid references public.enrollments(id) not null,
  issued_at timestamptz default now(),
  certificate_code text unique,
  certificate_url text
);
alter table public.certificates enable row level security;

-- FORUM THREADS
create table public.forum_threads (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  title text not null,
  content text,
  created_at timestamptz default now()
);
alter table public.forum_threads enable row level security;

-- FORUM POSTS
create table public.forum_posts (
  id uuid default uuid_generate_v4() primary key,
  thread_id uuid references public.forum_threads(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamptz default now()
);
alter table public.forum_posts enable row level security;

-- POLICIES (Simplified for Init)

-- Profiles: Public read, owner update
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Courses: Public read (published), Instructor update
create policy "Published courses are viewable by everyone." on public.courses for select using (is_published = true or auth.uid() = instructor_id);
create policy "Instructors can insert courses." on public.courses for insert with check (auth.uid() = instructor_id);
create policy "Instructors can update their courses." on public.courses for update using (auth.uid() = instructor_id);

-- Enrollments: Student read own
create policy "Users can view own enrollments." on public.enrollments for select using (auth.uid() = student_id);
create policy "Users can enroll." on public.enrollments for insert with check (auth.uid() = student_id);

-- Content: Public read if preview, else enrolled
-- (Skipping complex joins for Init, keeping basic access open or TODO refined later)
create policy "Modules viewable by everyone" on public.modules for select using (true);
create policy "Lessons viewable by everyone" on public.lessons for select using (true);
