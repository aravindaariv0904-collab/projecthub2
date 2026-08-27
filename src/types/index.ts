export interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  year: string;
  bio: string;
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }[];
  interests: string[];
  projectsCount: number;
  hackathonsCount: number;
  achievements: string[];
  githubUrl: string;
  collaborationScore: number;
  endorsements: {
    category: 'Technical Contribution' | 'Reliability' | 'Communication' | 'Teamwork' | 'Task Completion';
    count: number;
    senderNames: string[];
  }[];
  avatarUrl: string;
  reputationTags: string[];
  isAnonymous?: boolean; // For double-blind discovery
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: 'TODO' | 'In Progress' | 'Completed';
  tasks: string[]; // Task IDs
}

export interface TeamMember {
  studentId: string;
  role: string;
  status: 'Pending' | 'Joined' | 'Rejected';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  priority: 'Low' | 'Medium' | 'High';
  status: 'TODO' | 'In Progress' | 'Review' | 'Done';
  deadline: string;
  labels: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isAnnouncement?: boolean;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  category: 'Document' | 'Image' | 'Design' | 'Resource';
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface Technology {
  name: string;
  category: string;
  why: string;
}

export interface RequiredSkill {
  name: string;
  priority: 'Required' | 'Recommended' | 'Optional';
}

export interface SuggestedRole {
  name: string;
  skills: string[];
  priority: 'High' | 'Medium' | 'Low';
  count: number;
  filled: number;
}

export interface ShowcaseData {
  problemSolved: string;
  solution: string;
  screenshots: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  achievements: string[];
  completionDate: string;
  published: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  problemSolved: string;
  targetUsers: string;
  category: 'College Project' | 'Hackathon' | 'Startup' | 'Open Source' | 'Research' | 'Personal Project';
  duration: string;
  teamSize: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: Technology[];
  requiredSkills: RequiredSkill[];
  suggestedRoles: SuggestedRole[];
  roadmap: Milestone[];
  members: TeamMember[];
  tasks: Task[];
  chatMessages: ChatMessage[];
  files: ProjectFile[];
  githubConnected: boolean;
  githubRepoName: string;
  progress: number; // Completed Tasks / Total Tasks * 100
  status: 'Planning' | 'Active' | 'Completed' | 'Archived';
  showcase?: ShowcaseData;
  creatorId: string;
  deadline?: string;
}

export interface Hackathon {
  id: string;
  name: string;
  theme: string;
  deadline: string;
  eligibility: string;
  teamSizeRange: string;
  requiredSkills: string[];
  logo: string;
  saved?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  membersCount: number;
  projectsCount: number;
  posts: Post[];
}

export interface Notification {
  id: string;
  type: 'connection_request' | 'project_invitation' | 'project_application' | 'task_assigned' | 'task_deadline' | 'message' | 'endorsement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  senderId?: string;
  projectId?: string;
  taskId?: string;
}

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'Pending' | 'Connected' | 'Rejected';
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  studentId: string;
  roleName: string;
  pitch: string;
  skills: string;
  status: 'Pending' | 'Joined' | 'Rejected';
}

export interface ProjectInvitation {
  id: string;
  projectId: string;
  studentId: string;
  roleName: string;
  status: 'Pending' | 'Joined' | 'Rejected';
}

export interface BookmarksState {
  projectIds: string[];
  studentIds: string[];
  hackathonIds: string[];
  ideaIds: string[];
}

