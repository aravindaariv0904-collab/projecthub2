import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Project, Hackathon, Community, Notification, Task, Milestone, ProjectFile, ChatMessage, TeamMember, ShowcaseData, Connection, ProjectApplication, ProjectInvitation, BookmarksState } from '../types';
import { mockStudents, mockProjects, mockHackathons, mockCommunities, mockNotifications } from '../data/mockData';
import { storage } from '../services/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  currentUser: Student | null;
  students: Student[];
  projects: Project[];
  hackathons: Hackathon[];
  communities: Community[];
  notifications: Notification[];
  connections: Connection[];
  applications: ProjectApplication[];
  invitations: ProjectInvitation[];
  bookmarks: BookmarksState;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (studentData: Partial<Student> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<Student>) => Promise<{ success: boolean; error?: string }>;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  sendConnectionRequest: (targetId: string) => void;
  acceptConnectionRequest: (senderId: string) => void;
  rejectConnectionRequest: (senderId: string) => void;
  sendProjectInvitation: (studentId: string, projectId: string, roleName: string) => void;
  acceptProjectInvitation: (invitationId: string) => void;
  rejectProjectInvitation: (invitationId: string) => void;
  applyForProjectRole: (projectId: string, roleName: string, pitch: string, skills: string) => void;
  acceptProjectApplication: (applicationId: string) => void;
  rejectProjectApplication: (applicationId: string) => void;
  addTask: (projectId: string, task: Task) => void;
  updateTask: (projectId: string, task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  addMilestone: (projectId: string, milestone: Milestone) => void;
  updateMilestone: (projectId: string, milestone: Milestone) => void;
  addProjectFile: (projectId: string, file: ProjectFile) => void;
  sendProjectChatMessage: (projectId: string, content: string, isAnnouncement?: boolean) => void;
  toggleBookmarkProject: (projectId: string) => void;
  toggleBookmarkHackathon: (hackathonId: string) => void;
  toggleBookmarkStudent: (studentId: string) => void;
  toggleBookmarkIdea: (ideaId: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  publishShowcase: (projectId: string, showcase: ShowcaseData) => void;
  submitEndorsements: (
    projectId: string,
    targetStudentId: string,
    ratings: { category: any; score: number }[],
    tags: string[]
  ) => void;
  sendDirectMessage: (recipientId: string, text: string) => void;
  directMessages: { [key: string]: ChatMessage[] };
  setCurrentUser: (user: Student | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Core state loaded from LocalStorage or Fallbacks
  const [currentUser, setCurrentUser] = useState<Student | null>(() =>
    storage.get<Student | null>('ph_current_user', null)
  );
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState<Student[]>(() => 
    storage.get<Student[]>('ph_students', mockStudents)
  );

  const [projects, setProjects] = useState<Project[]>(() => 
    storage.get<Project[]>('ph_projects', mockProjects)
  );

  const [hackathons, setHackathons] = useState<Hackathon[]>(() => 
    storage.get<Hackathon[]>('ph_hackathons', mockHackathons)
  );

  const [communities, setCommunities] = useState<Community[]>(() => 
    storage.get<Community[]>('ph_communities', mockCommunities)
  );

  const [notifications, setNotifications] = useState<Notification[]>(() => 
    storage.get<Notification[]>('ph_notifications', mockNotifications)
  );

  const [connections, setConnections] = useState<Connection[]>(() => 
    storage.get<Connection[]>('ph_connections_relational', [
      { id: 'conn-1', senderId: 'student-pujitha', receiverId: 'student-2', status: 'Connected' },
      { id: 'conn-2', senderId: 'student-pujitha', receiverId: 'student-3', status: 'Connected' }
    ])
  );

  const [applications, setApplications] = useState<ProjectApplication[]>(() => 
    storage.get<ProjectApplication[]>('ph_applications_relational', [])
  );

  const [invitations, setInvitations] = useState<ProjectInvitation[]>(() => 
    storage.get<ProjectInvitation[]>('ph_invitations_relational', [])
  );

  const [bookmarks, setBookmarks] = useState<BookmarksState>(() => 
    storage.get<BookmarksState>('ph_bookmarks_relational', {
      projectIds: ['project-1'],
      studentIds: [],
      hackathonIds: ['hack-2'],
      ideaIds: []
    })
  );

  const [directMessages, setDirectMessages] = useState<{ [key: string]: ChatMessage[] }>(() => 
    storage.get<{ [key: string]: ChatMessage[] }>('ph_direct_messages', {
      'student-2': [
        { id: 'dm-1', senderId: 'student-2', senderName: 'Sophia Chen', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', content: 'Hey, thanks for accepting my connection! Let me know if you want to collaborate on the AI project.', timestamp: '2026-08-24T14:48:00Z' }
      ]
    })
  );

  // Helper to fetch single profile
  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Error fetching user profile from Supabase:', error);
        return null;
      }

      if (data) {
        const profile: Student = {
          id: data.id,
          name: data.name,
          email: data.email,
          college: data.college || '',
          course: data.course || '',
          year: data.year || '',
          bio: data.bio || '',
          skills: data.skills || [],
          interests: data.interests || [],
          projectsCount: data.projects_count || 0,
          hackathonsCount: data.hackathons_count || 0,
          achievements: data.achievements || [],
          githubUrl: data.github_url || '',
          collaborationScore: data.collaboration_score || 100,
          endorsements: [],
          avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          reputationTags: data.reputation_tags || []
        };
        setCurrentUser(profile);
        storage.set('ph_current_user', profile);
        return profile;
      }
    } catch (err) {
      console.warn('Unexpected error fetching profile:', err);
    }
    return null;
  };

  // Helper to fetch all profiles
  const fetchAllProfiles = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (!error && data && data.length > 0) {
        const mapped: Student[] = data.map(d => ({
          id: d.id,
          name: d.name,
          email: d.email,
          college: d.college || '',
          course: d.course || '',
          year: d.year || '',
          bio: d.bio || '',
          skills: d.skills || [],
          interests: d.interests || [],
          projectsCount: d.projects_count || 0,
          hackathonsCount: d.hackathons_count || 0,
          achievements: d.achievements || [],
          githubUrl: d.github_url || '',
          collaborationScore: d.collaboration_score || 100,
          endorsements: [],
          avatarUrl: d.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          reputationTags: d.reputation_tags || []
        }));
        setStudents(mapped);
        storage.set('ph_students', mapped);
      }
    } catch (err) {
      console.warn('Could not fetch all profiles from Supabase, using local students:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check initial session if Supabase is enabled
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    fetchAllProfiles();

    // Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        storage.remove('ph_current_user');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Sync to LocalStorage on modifications
  useEffect(() => { storage.set('ph_current_user', currentUser); }, [currentUser]);
  useEffect(() => { storage.set('ph_students', students); }, [students]);
  useEffect(() => { storage.set('ph_projects', projects); }, [projects]);
  useEffect(() => { storage.set('ph_hackathons', hackathons); }, [hackathons]);
  useEffect(() => { storage.set('ph_communities', communities); }, [communities]);
  useEffect(() => { storage.set('ph_notifications', notifications); }, [notifications]);
  useEffect(() => { storage.set('ph_connections_relational', connections); }, [connections]);
  useEffect(() => { storage.set('ph_applications_relational', applications); }, [applications]);
  useEffect(() => { storage.set('ph_invitations_relational', invitations); }, [invitations]);
  useEffect(() => { storage.set('ph_bookmarks_relational', bookmarks); }, [bookmarks]);
  useEffect(() => { storage.set('ph_direct_messages', directMessages); }, [directMessages]);

  // Helper helper to generate IDs
  const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

  // 3. Methods implementations

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data.user) {
          await fetchProfile(data.user.id);
          await fetchAllProfiles();
          return { success: true };
        } else if (error && !error.message.toLowerCase().includes('failed to fetch')) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        console.warn('Supabase login error, falling back to local accounts:', err);
      }
    }

    // Local / Mock fallback logic
    const existingStudent = students.find(s => s.email.toLowerCase() === cleanEmail) ||
                           mockStudents.find(s => s.email.toLowerCase() === cleanEmail);

    if (existingStudent) {
      setCurrentUser(existingStudent);
      storage.set('ph_current_user', existingStudent);
      return { success: true };
    }

    return { success: false, error: 'No student account found with this email. Please sign up first.' };
  };

  const signup = async (studentData: Partial<Student> & { password?: string }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (studentData.email || '').trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: studentData.password || '',
          options: {
            data: {
              name: studentData.name || 'New Student'
            }
          }
        });

        if (!error && data.user) {
          try {
            await supabase
              .from('profiles')
              .update({
                college: studentData.college,
                course: studentData.course,
                year: studentData.year,
                bio: studentData.bio,
                skills: studentData.skills,
                interests: studentData.interests,
                avatar_url: studentData.avatarUrl
              })
              .eq('id', data.user.id);
          } catch (e) {
            console.warn('Failed to update profile details on Supabase:', e);
          }

          await fetchProfile(data.user.id);
          await fetchAllProfiles();
          return { success: true };
        } else if (error && !error.message.toLowerCase().includes('failed to fetch')) {
          console.warn('Supabase signup error:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase signup network error, continuing with local account:', err);
      }
    }

    // Local student profile creation
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: studentData.name || 'New Student',
      email: cleanEmail,
      college: studentData.college || '',
      course: studentData.course || '',
      year: studentData.year || 'Freshman',
      bio: studentData.bio || '',
      skills: studentData.skills || [],
      interests: studentData.interests || [],
      projectsCount: 0,
      hackathonsCount: 0,
      achievements: ['New Member'],
      githubUrl: studentData.githubUrl || '',
      collaborationScore: 100,
      endorsements: [],
      avatarUrl: studentData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      reputationTags: ['Quick Learner', 'Problem Solver']
    };

    setStudents(prev => {
      const updated = [newStudent, ...prev.filter(s => s.email.toLowerCase() !== cleanEmail)];
      storage.set('ph_students', updated);
      return updated;
    });
    setCurrentUser(newStudent);
    storage.set('ph_current_user', newStudent);
    return { success: true };
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error:', e);
      }
    }
    setCurrentUser(null);
    storage.remove('ph_current_user');
  };

  const updateProfile = async (updated: Partial<Student>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'No user is logged in' };
    }

    if (isSupabaseConfigured) {
      try {
        const dbPayload = {
          name: updated.name,
          college: updated.college,
          course: updated.course,
          year: updated.year,
          bio: updated.bio,
          skills: updated.skills,
          interests: updated.interests,
          avatar_url: updated.avatarUrl,
          github_url: updated.githubUrl
        };

        const cleanPayload = Object.fromEntries(
          Object.entries(dbPayload).filter(([_, v]) => v !== undefined)
        );

        await supabase
          .from('profiles')
          .update(cleanPayload)
          .eq('id', currentUser.id);
      } catch (err: any) {
        console.warn('Supabase updateProfile error:', err);
      }
    }

    const updatedUser = { ...currentUser, ...updated } as Student;
    setCurrentUser(updatedUser);
    storage.set('ph_current_user', updatedUser);
    setStudents(prev => {
      const next = prev.map(s => s.id === currentUser.id ? updatedUser : s);
      storage.set('ph_students', next);
      return next;
    });

    return { success: true };
  };

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const sendConnectionRequest = (targetId: string) => {
    if (!currentUser) return;
    const exists = connections.some(c => 
      (c.senderId === currentUser.id && c.receiverId === targetId) ||
      (c.senderId === targetId && c.receiverId === currentUser.id)
    );
    if (exists) return;

    setConnections(prev => [...prev, { id: makeId('conn'), senderId: currentUser.id, receiverId: targetId, status: 'Pending' }]);

    const notif: Notification = {
      id: makeId('notif'),
      type: 'connection_request',
      title: 'Connection Request',
      message: `${currentUser.name} wants to connect.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      senderId: currentUser.id
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const acceptConnectionRequest = (senderId: string) => {
    if (!currentUser) return;
    
    setConnections(prev => prev.map(c => 
      ((c.senderId === senderId && c.receiverId === currentUser.id) || 
       (c.senderId === currentUser.id && c.receiverId === senderId))
        ? { ...c, status: 'Connected' as const } 
        : c
    ));

    // Mark connection request notification as read
    setNotifications(prev => prev.map(n => 
      (n.type === 'connection_request' && n.senderId === senderId) 
        ? { ...n, isRead: true } 
        : n
    ));

    const senderObj = students.find(s => s.id === senderId);
    if (senderObj) {
      const notif: Notification = {
        id: makeId('notif'),
        type: 'endorsement',
        title: 'Connection Accepted',
        message: `${currentUser.name} accepted your connection request.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        senderId: currentUser.id
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const rejectConnectionRequest = (senderId: string) => {
    if (!currentUser) return;
    setConnections(prev => prev.map(c => 
      ((c.senderId === senderId && c.receiverId === currentUser.id) || 
       (c.senderId === currentUser.id && c.receiverId === senderId))
        ? { ...c, status: 'Rejected' as const } 
        : c
    ));

    // Mark connection request notification as read
    setNotifications(prev => prev.map(n => 
      (n.type === 'connection_request' && n.senderId === senderId) 
        ? { ...n, isRead: true } 
        : n
    ));
  };

  const sendProjectInvitation = (studentId: string, projectId: string, roleName: string) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const exists = invitations.some(i => i.projectId === projectId && i.studentId === studentId && i.roleName === roleName);
    if (exists) return;

    const newInvite: ProjectInvitation = {
      id: makeId('invite'),
      projectId,
      studentId,
      roleName,
      status: 'Pending'
    };
    setInvitations(prev => [...prev, newInvite]);

    const isMember = project.members.some(m => m.studentId === studentId);
    if (!isMember) {
      const updatedMembers: TeamMember[] = [...project.members, { studentId, role: roleName, status: 'Pending' }];
      updateProject({ ...project, members: updatedMembers });
    }

    const notif: Notification = {
      id: makeId('notif'),
      type: 'project_invitation',
      title: 'Project Invitation',
      message: `${currentUser.name} invited you to join "${project.name}" as a ${roleName}.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      senderId: currentUser.id,
      projectId: projectId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const acceptProjectInvitation = (invitationId: string) => {
    if (!currentUser) return;
    const invite = invitations.find(i => i.id === invitationId);
    if (!invite) return;

    setInvitations(prev => prev.map(i => i.id === invitationId ? { ...i, status: 'Joined' as const } : i));

    const project = projects.find(p => p.id === invite.projectId);
    if (!project) return;

    const updatedMembers = project.members.map(m => 
      m.studentId === currentUser.id ? { ...m, status: 'Joined' as const } : m
    );

    const updatedRoles = project.suggestedRoles.map(r => 
      r.name === invite.roleName ? { ...r, filled: r.filled + 1 } : r
    );

    updateProject({
      ...project,
      members: updatedMembers,
      suggestedRoles: updatedRoles,
      status: project.status === 'Planning' ? 'Active' : project.status
    });

    const confNotif: Notification = {
      id: makeId('notif'),
      type: 'system',
      title: 'Invitation Accepted',
      message: `${currentUser.name} has joined the team for "${project.name}"!`,
      timestamp: new Date().toISOString(),
      isRead: false,
      projectId: project.id
    };
    setNotifications(prev => [confNotif, ...prev]);
  };

  const rejectProjectInvitation = (invitationId: string) => {
    if (!currentUser) return;
    const invite = invitations.find(i => i.id === invitationId);
    if (!invite) return;

    setInvitations(prev => prev.map(i => i.id === invitationId ? { ...i, status: 'Rejected' as const } : i));

    const project = projects.find(p => p.id === invite.projectId);
    if (!project) return;

    const updatedMembers = project.members.filter(m => m.studentId !== currentUser.id);
    updateProject({ ...project, members: updatedMembers });
  };

  const applyForProjectRole = (projectId: string, roleName: string, pitch: string, skills: string) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const exists = applications.some(a => a.projectId === projectId && a.studentId === currentUser.id && a.roleName === roleName);
    if (exists) return;

    const newApp: ProjectApplication = {
      id: makeId('app'),
      projectId,
      studentId: currentUser.id,
      roleName,
      pitch,
      skills,
      status: 'Pending'
    };
    setApplications(prev => [...prev, newApp]);

    const creatorNotif: Notification = {
      id: makeId('notif'),
      type: 'project_application',
      title: 'Project Application',
      message: `${currentUser.name} applied to join "${project.name}" as a ${roleName}.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      senderId: currentUser.id,
      projectId: projectId
    };
    setNotifications(prev => [creatorNotif, ...prev]);
  };

  const acceptProjectApplication = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'Joined' as const } : a));

    const project = projects.find(p => p.id === app.projectId);
    if (!project) return;

    const updatedMembers: TeamMember[] = [...project.members, { studentId: app.studentId, role: app.roleName, status: 'Joined' }];
    const updatedRoles = project.suggestedRoles.map(r => 
      r.name === app.roleName ? { ...r, filled: r.filled + 1 } : r
    );

    updateProject({
      ...project,
      members: updatedMembers,
      suggestedRoles: updatedRoles,
      status: project.status === 'Planning' ? 'Active' : project.status
    });

    const userNotif: Notification = {
      id: makeId('notif'),
      type: 'system',
      title: 'Application Approved',
      message: `Your application to join "${project.name}" was approved!`,
      timestamp: new Date().toISOString(),
      isRead: false,
      projectId: project.id
    };
    setNotifications(prev => [userNotif, ...prev]);
  };

  const rejectProjectApplication = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'Rejected' as const } : a));

    const project = projects.find(p => p.id === app.projectId);
    if (!project) return;

    const userNotif: Notification = {
      id: makeId('notif'),
      type: 'system',
      title: 'Application Rejected',
      message: `Your application to join "${project.name}" as a ${app.roleName} was rejected.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      projectId: project.id
    };
    setNotifications(prev => [userNotif, ...prev]);
  };

  // Kanban and Workspace Task Controls
  const updateMilestonesStatus = (roadmap: Milestone[], tasks: Task[]): Milestone[] => {
    return roadmap.map(m => {
      const milestoneTasks = tasks.filter(t => m.tasks.includes(t.id));
      if (milestoneTasks.length === 0) return m;

      const allDone = milestoneTasks.every(t => t.status === 'Done');
      const allTodo = milestoneTasks.every(t => t.status === 'TODO');

      let newStatus: 'TODO' | 'In Progress' | 'Completed' = 'In Progress';
      if (allDone) {
        newStatus = 'Completed';
      } else if (allTodo) {
        newStatus = 'TODO';
      }

      return { ...m, status: newStatus };
    });
  };

  const addTask = (projectId: string, task: Task) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const updatedTasks = [...project.tasks, task];
    const progress = calculateProgress(updatedTasks);
    const updatedRoadmap = updateMilestonesStatus(project.roadmap, updatedTasks);

    updateProject({ ...project, tasks: updatedTasks, roadmap: updatedRoadmap, progress });

    if (task.assigneeId && currentUser && task.assigneeId !== currentUser.id) {
      const taskNotif: Notification = {
        id: makeId('notif'),
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `${currentUser.name} assigned you: "${task.title}" in "${project.name}".`,
        timestamp: new Date().toISOString(),
        isRead: false,
        projectId,
        taskId: task.id
      };
      setNotifications(prev => [taskNotif, ...prev]);
    }
  };

  const updateTask = (projectId: string, task: Task) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedTasks = project.tasks.map(t => t.id === task.id ? task : t);
    const progress = calculateProgress(updatedTasks);
    const updatedRoadmap = updateMilestonesStatus(project.roadmap, updatedTasks);
    updateProject({ ...project, tasks: updatedTasks, roadmap: updatedRoadmap, progress });
  };

  const deleteTask = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedTasks = project.tasks.filter(t => t.id !== taskId);
    const progress = calculateProgress(updatedTasks);
    const updatedRoadmap = updateMilestonesStatus(project.roadmap, updatedTasks);
    updateProject({ ...project, tasks: updatedTasks, roadmap: updatedRoadmap, progress });
  };

  const addMilestone = (projectId: string, milestone: Milestone) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    updateProject({ ...project, roadmap: [...project.roadmap, milestone] });
  };

  const updateMilestone = (projectId: string, milestone: Milestone) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedRoadmap = project.roadmap.map(m => m.id === milestone.id ? milestone : m);
    updateProject({ ...project, roadmap: updatedRoadmap });
  };

  const addProjectFile = (projectId: string, file: ProjectFile) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    updateProject({ ...project, files: [file, ...project.files] });
  };

  const sendProjectChatMessage = (projectId: string, content: string, isAnnouncement = false) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newMsg: ChatMessage = {
      id: makeId('msg'),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      content,
      timestamp: new Date().toISOString(),
      isAnnouncement
    };

    updateProject({ ...project, chatMessages: [...project.chatMessages, newMsg] });
  };

  const sendDirectMessage = (recipientId: string, text: string) => {
    if (!currentUser) return;
    const sender = currentUser;

    const newMsg: ChatMessage = {
      id: makeId('dm'),
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatarUrl,
      content: text,
      timestamp: new Date().toISOString()
    };

    setDirectMessages(prev => {
      const chatHistory = prev[recipientId] || [];
      return {
        ...prev,
        [recipientId]: [...chatHistory, newMsg]
      };
    });
  };

  const toggleBookmarkProject = (projectId: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.projectIds.includes(projectId);
      return {
        ...prev,
        projectIds: isBookmarked 
          ? prev.projectIds.filter(id => id !== projectId) 
          : [...prev.projectIds, projectId]
      };
    });
  };

  const toggleBookmarkHackathon = (hackathonId: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.hackathonIds.includes(hackathonId);
      return {
        ...prev,
        hackathonIds: isBookmarked 
          ? prev.hackathonIds.filter(id => id !== hackathonId) 
          : [...prev.hackathonIds, hackathonId]
      };
    });
  };

  const toggleBookmarkStudent = (studentId: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.studentIds.includes(studentId);
      return {
        ...prev,
        studentIds: isBookmarked 
          ? prev.studentIds.filter(id => id !== studentId) 
          : [...prev.studentIds, studentId]
      };
    });
  };

  const toggleBookmarkIdea = (ideaId: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.ideaIds.includes(ideaId);
      return {
        ...prev,
        ideaIds: isBookmarked 
          ? prev.ideaIds.filter(id => id !== ideaId) 
          : [...prev.ideaIds, ideaId]
      };
    });
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const publishShowcase = (projectId: string, showcase: ShowcaseData) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    updateProject({
      ...project,
      status: 'Completed',
      showcase
    });

    // Award reputation points for completing project
    const creator = students.find(s => s.id === project.creatorId);
    if (creator) {
      const updatedStudents = students.map(s => {
        const isTeamMember = project.members.some(m => m.studentId === s.id && m.status === 'Joined');
        if (s.id === project.creatorId || isTeamMember) {
          return {
            ...s,
            projectsCount: s.projectsCount + 1,
            collaborationScore: Math.min(100, s.collaborationScore + 3)
          };
        }
        return s;
      });
      setStudents(updatedStudents);
    }
  };

  const submitEndorsements = (
    projectId: string,
    targetStudentId: string,
    ratings: { category: any; score: number }[],
    tags: string[]
  ) => {
    if (!currentUser) return;

    setStudents(prevStudents => prevStudents.map(student => {
      if (student.id !== targetStudentId) return student;

      // Update collaboration score based on endorsements
      const avgScore = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
      const scoreDiff = (avgScore - 3) * 2; // e.g. 5 rating yields +4 score, 1 rating yields -4 score
      const newScore = Math.min(100, Math.max(0, Math.round(student.collaborationScore + scoreDiff)));

      // Merge endorsements
      const updatedEndorsements = [...student.endorsements];
      ratings.forEach(rating => {
        const idx = updatedEndorsements.findIndex(e => e.category === rating.category);
        if (idx >= 0) {
          updatedEndorsements[idx] = {
            category: rating.category,
            count: updatedEndorsements[idx].count + 1,
            senderNames: Array.from(new Set([...updatedEndorsements[idx].senderNames, currentUser.name]))
          };
        } else {
          updatedEndorsements.push({
            category: rating.category,
            count: 1,
            senderNames: [currentUser.name]
          });
        }
      });

      // Merge reputation tags
      const updatedTags = Array.from(new Set([...student.reputationTags, ...tags]));

      return {
        ...student,
        collaborationScore: newScore,
        endorsements: updatedEndorsements,
        reputationTags: updatedTags
      };
    }));

    // Notify the target student
    const notif: Notification = {
      id: makeId('notif'),
      type: 'endorsement',
      title: 'Skills Endorsement',
      message: `You received peer endorsements from ${currentUser.name} for your work in the team.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      senderId: currentUser.id,
      projectId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Helper helper to compute completion percentage
  const calculateProgress = (taskList: Task[]): number => {
    if (taskList.length === 0) return 0;
    const completed = taskList.filter(t => t.status === 'Done').length;
    return Math.round((completed / taskList.length) * 100);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        students,
        projects,
        hackathons,
        communities,
        notifications,
        connections,
        applications,
        invitations,
        bookmarks,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        sendProjectInvitation,
        acceptProjectInvitation,
        rejectProjectInvitation,
        applyForProjectRole,
        acceptProjectApplication,
        rejectProjectApplication,
        addTask,
        updateTask,
        deleteTask,
        addMilestone,
        updateMilestone,
        addProjectFile,
        sendProjectChatMessage,
        toggleBookmarkProject,
        toggleBookmarkHackathon,
        toggleBookmarkStudent,
        toggleBookmarkIdea,
        markNotificationRead,
        markAllNotificationsRead,
        publishShowcase,
        submitEndorsements,
        sendDirectMessage,
        directMessages,
        setCurrentUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
