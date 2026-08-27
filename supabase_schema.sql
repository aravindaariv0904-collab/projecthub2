-- ProjectHub Supabase Database Schema Setup Script
-- Paste this script into the Supabase SQL Editor and run it to initialize all tables, triggers, indexes, and RLS policies.

-- Enable UUID generation extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---------------------------------------------------------
-- 1. Create Core Tables
---------------------------------------------------------

-- Profiles (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    college text,
    course text,
    year text,
    bio text,
    skills jsonb DEFAULT '[]'::jsonb,
    interests text[] DEFAULT '{}'::text[],
    projects_count int DEFAULT 0,
    hackathons_count int DEFAULT 0,
    achievements text[] DEFAULT '{}'::text[],
    github_url text,
    collaboration_score int DEFAULT 100 CHECK (collaboration_score BETWEEN 0 AND 100),
    avatar_url text,
    reputation_tags text[] DEFAULT '{}'::text[],
    is_anonymous boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    problem_solved text,
    target_users text,
    category text NOT NULL CHECK (category IN ('College Project', 'Hackathon', 'Startup', 'Open Source', 'Research', 'Personal Project')),
    duration text,
    team_size int DEFAULT 3,
    difficulty text CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    github_connected boolean DEFAULT false,
    github_repo_name text,
    progress int DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    status text DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed', 'Archived')),
    creator_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    deadline timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Project Technologies
CREATE TABLE IF NOT EXISTS public.project_technologies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    category text,
    why text
);

-- Project Required Skills
CREATE TABLE IF NOT EXISTS public.project_required_skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    priority text CHECK (priority IN ('Required', 'Recommended', 'Optional'))
);

-- Project Suggested Roles
CREATE TABLE IF NOT EXISTS public.project_suggested_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    skills text[] DEFAULT '{}'::text[],
    priority text CHECK (priority IN ('High', 'Medium', 'Low')),
    count int DEFAULT 1,
    filled int DEFAULT 0
);

-- Project Members
CREATE TABLE IF NOT EXISTS public.project_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'Contributor',
    status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Joined', 'Rejected')),
    joined_at timestamptz DEFAULT now(),
    CONSTRAINT unique_project_member UNIQUE (project_id, student_id)
);

-- Project Milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    duration text,
    status text DEFAULT 'TODO' CHECK (status IN ('TODO', 'In Progress', 'Completed')),
    created_at timestamptz DEFAULT now()
);

-- Project Tasks
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    milestone_id uuid REFERENCES public.project_milestones(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    assignee_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    priority text DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    status text DEFAULT 'TODO' CHECK (status IN ('TODO', 'In Progress', 'Review', 'Done')),
    deadline timestamptz,
    labels text[] DEFAULT '{}'::text[],
    created_at timestamptz DEFAULT now()
);

-- Project Files
CREATE TABLE IF NOT EXISTS public.project_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    size text NOT NULL,
    category text CHECK (category IN ('Document', 'Image', 'Design', 'Resource')),
    uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    uploaded_at timestamptz DEFAULT now(),
    url text NOT NULL
);

-- Project Chat Messages
CREATE TABLE IF NOT EXISTS public.project_chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    content text NOT NULL,
    is_announcement boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Direct Messages (Private chats between connected students)
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Connections
CREATE TABLE IF NOT EXISTS public.connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Connected', 'Rejected')),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_connection_pair UNIQUE (sender_id, receiver_id)
);

-- Project Applications
CREATE TABLE IF NOT EXISTS public.project_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_name text NOT NULL,
    pitch text,
    skills text,
    status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Joined', 'Rejected')),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_project_application UNIQUE (project_id, student_id, role_name)
);

-- Project Invitations
CREATE TABLE IF NOT EXISTS public.project_invitations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_name text NOT NULL,
    status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Joined', 'Rejected')),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_project_invitation UNIQUE (project_id, student_id, role_name)
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('connection_request', 'project_invitation', 'project_application', 'task_assigned', 'task_deadline', 'message', 'endorsement', 'system')),
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    action_link text,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    task_id uuid REFERENCES public.project_tasks(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bookmark_type text NOT NULL CHECK (bookmark_type IN ('project', 'student', 'hackathon', 'idea')),
    target_id text NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_bookmark UNIQUE (user_id, bookmark_type, target_id)
);

-- Endorsements
CREATE TABLE IF NOT EXISTS public.endorsements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    category text NOT NULL CHECK (category IN ('Technical Contribution', 'Reliability', 'Communication', 'Teamwork', 'Task Completion')),
    score int NOT NULL DEFAULT 5 CHECK (score BETWEEN 1 AND 5),
    tags text[] DEFAULT '{}'::text[],
    created_at timestamptz DEFAULT now(),
    CONSTRAINT check_not_self_endorse CHECK (sender_id <> receiver_id)
);

-- Hackathons
CREATE TABLE IF NOT EXISTS public.hackathons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    theme text,
    deadline timestamptz NOT NULL,
    eligibility text,
    team_size_range text,
    required_skills text[] DEFAULT '{}'::text[],
    logo text,
    created_at timestamptz DEFAULT now()
);

-- Communities
CREATE TABLE IF NOT EXISTS public.communities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category text,
    members_count int DEFAULT 0,
    projects_count int DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    likes int DEFAULT 0,
    comments_count int DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Project Showcases
CREATE TABLE IF NOT EXISTS public.project_showcases (
    project_id uuid PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
    problem_solved text NOT NULL,
    solution text NOT NULL,
    screenshots text[] DEFAULT '{}'::text[],
    live_demo_url text,
    github_url text,
    achievements text[] DEFAULT '{}'::text[],
    completion_date date NOT NULL,
    published boolean DEFAULT false
);

---------------------------------------------------------
-- 2. Configure Row Level Security (RLS)
---------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_required_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_suggested_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_showcases ENABLE ROW LEVEL SECURITY;

---------------------------------------------------------
-- RLS Policy Definitions
---------------------------------------------------------

-- Profiles: Public select, own insert/update
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Public select, authenticated insert, creator update/delete
CREATE POLICY "projects_select" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "projects_update" ON public.projects FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "projects_delete" ON public.projects FOR DELETE USING (auth.uid() = creator_id);

-- Project Sub-Components (Technologies, Skills, Suggested Roles): Public select, project creator insert/update/delete
CREATE POLICY "tech_select" ON public.project_technologies FOR SELECT USING (true);
CREATE POLICY "tech_manage" ON public.project_technologies FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

CREATE POLICY "skills_select" ON public.project_required_skills FOR SELECT USING (true);
CREATE POLICY "skills_manage" ON public.project_required_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

CREATE POLICY "roles_select" ON public.project_suggested_roles FOR SELECT USING (true);
CREATE POLICY "roles_manage" ON public.project_suggested_roles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- Project Members: RLS Security Policies
CREATE POLICY "project_members_select" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "project_members_insert" ON public.project_members FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid()) OR
    (student_id = auth.uid() AND status = 'Pending')
);
CREATE POLICY "project_members_update" ON public.project_members FOR UPDATE USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_members.project_id AND p.creator_id = auth.uid())
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_members.project_id AND p.creator_id = auth.uid()) OR
    (student_id = auth.uid() AND status IN ('Joined', 'Rejected') AND role = role AND project_id = project_id AND student_id = student_id)
);
CREATE POLICY "project_members_delete" ON public.project_members FOR DELETE USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_members.project_id AND p.creator_id = auth.uid())
);

-- Workspace Specific Tables: Tasks (Member only access)
CREATE POLICY "tasks_select" ON public.project_tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_tasks.project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
);
CREATE POLICY "tasks_insert" ON public.project_tasks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND p.creator_id = auth.uid())
);
CREATE POLICY "tasks_update" ON public.project_tasks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_tasks.project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND p.creator_id = auth.uid()) OR
    (assignee_id = auth.uid() AND title = title AND description = description AND assignee_id = assignee_id AND priority = priority AND deadline = deadline AND milestone_id = milestone_id AND labels = labels)
);
CREATE POLICY "tasks_delete" ON public.project_tasks FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND p.creator_id = auth.uid())
);

-- Milestones: Member access, creator managed
CREATE POLICY "milestones_select" ON public.project_milestones FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_milestones.project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
);
CREATE POLICY "milestones_manage" ON public.project_milestones FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- Files: Member access
CREATE POLICY "files_select" ON public.project_files FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_files.project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
);
CREATE POLICY "files_insert" ON public.project_files FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
);
CREATE POLICY "files_update" ON public.project_files FOR UPDATE USING (
    uploaded_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_files.project_id AND p.creator_id = auth.uid())
);
CREATE POLICY "files_delete" ON public.project_files FOR DELETE USING (
    uploaded_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_files.project_id AND p.creator_id = auth.uid())
);

-- Chat: Member insert
CREATE POLICY "chat_select" ON public.project_chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_chat_messages.project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
);
CREATE POLICY "chat_insert" ON public.project_chat_messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_chat_messages.project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
);

-- Connections: Participant restricted
CREATE POLICY "connections_select" ON public.connections FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "connections_insert" ON public.connections FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);
CREATE POLICY "connections_update" ON public.connections FOR UPDATE USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
) WITH CHECK (
    (auth.uid() = receiver_id AND status IN ('Connected', 'Rejected')) OR
    (auth.uid() = sender_id AND status = 'Pending')
);
CREATE POLICY "connections_delete" ON public.connections FOR DELETE USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Direct Messages: Sender/recipient restricted
CREATE POLICY "dms_select" ON public.direct_messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "dms_insert" ON public.direct_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);

-- Applications & Invitations: Creator & applicant restricted
CREATE POLICY "applications_select" ON public.project_applications FOR SELECT USING (
    student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_applications.project_id AND p.creator_id = auth.uid())
);
CREATE POLICY "applications_insert" ON public.project_applications FOR INSERT WITH CHECK (
    student_id = auth.uid() AND
    NOT EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
);
CREATE POLICY "applications_update" ON public.project_applications FOR UPDATE USING (
    student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_applications.project_id AND p.creator_id = auth.uid())
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_applications.project_id AND p.creator_id = auth.uid()) OR
    (student_id = auth.uid() AND status = 'Pending' AND role_name = role_name AND project_id = project_id AND student_id = student_id)
);
CREATE POLICY "applications_delete" ON public.project_applications FOR DELETE USING (
    student_id = auth.uid()
);

CREATE POLICY "invitations_select" ON public.project_invitations FOR SELECT USING (
    student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_invitations.project_id AND p.creator_id = auth.uid())
);
CREATE POLICY "invitations_insert" ON public.project_invitations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.student_id = auth.uid() AND m.status = 'Joined')
);
CREATE POLICY "invitations_update" ON public.project_invitations FOR UPDATE USING (
    student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_invitations.project_id AND p.creator_id = auth.uid())
) WITH CHECK (
    (student_id = auth.uid() AND status IN ('Joined', 'Rejected') AND role_name = role_name AND project_id = project_id AND student_id = student_id) OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_invitations.project_id AND p.creator_id = auth.uid())
);
CREATE POLICY "invitations_delete" ON public.project_invitations FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_invitations.project_id AND p.creator_id = auth.uid())
);

-- Notifications: Recipient restricted
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "notifications_delete" ON public.notifications FOR DELETE USING (auth.uid() = recipient_id);

-- Bookmarks: User restricted
CREATE POLICY "bookmarks_manage" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Endorsements: Public select, team member insert
CREATE POLICY "endorsements_select" ON public.endorsements FOR SELECT USING (true);
CREATE POLICY "endorsements_insert" ON public.endorsements FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Showcases: Public select, project creator modify
CREATE POLICY "showcases_select" ON public.project_showcases FOR SELECT USING (true);
CREATE POLICY "showcases_manage" ON public.project_showcases FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- Communities & Community Posts: Public select, authenticated insert
CREATE POLICY "communities_select" ON public.communities FOR SELECT USING (true);
CREATE POLICY "posts_select" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Hackathons: Public viewable, admin write only
CREATE POLICY "hackathons_select" ON public.hackathons FOR SELECT USING (true);

---------------------------------------------------------
-- 3. Database Indexes & Unique Constraints
---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_connections_users ON public.connections(sender_id, receiver_id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_connection_between_users ON public.connections (
    LEAST(sender_id, receiver_id), 
    GREATEST(sender_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_student ON public.project_members(student_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON public.project_members(project_id);

CREATE INDEX IF NOT EXISTS idx_project_tasks_project ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_milestone ON public.project_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee ON public.project_tasks(assignee_id);

CREATE INDEX IF NOT EXISTS idx_direct_messages_chat ON public.direct_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id) WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_student ON public.project_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_project ON public.project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_invitations_student ON public.project_invitations(student_id);

-- Endorsement Duplication Prevention Indexes
CREATE UNIQUE INDEX IF NOT EXISTS unique_endorsement_with_project ON public.endorsements (sender_id, receiver_id, project_id, category) WHERE project_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS unique_endorsement_without_project ON public.endorsements (sender_id, receiver_id, category) WHERE project_id IS NULL;

---------------------------------------------------------
-- 4. Auth User Sync Trigger
---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, collaboration_score)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New Student'),
    new.email,
    100
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution link
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
