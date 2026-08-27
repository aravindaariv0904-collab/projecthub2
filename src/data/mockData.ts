import { Student, Project, Hackathon, Community, Notification } from '../types';

export const mockStudents: Student[] = [
  {
    id: 'student-pujitha',
    name: 'Pujitha',
    email: 'pujitha@college.edu',
    college: 'University of Texas at Dallas',
    course: 'Software Engineering',
    year: 'Senior',
    bio: 'Passionate frontend engineer and UI developer. Love building highly functional student utilities with beautiful React code.',
    skills: [
      { name: 'React', level: 'Advanced' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'Figma', level: 'Intermediate' },
      { name: 'Tailwind CSS', level: 'Advanced' }
    ],
    interests: ['Product Design', 'Web Apps', 'Software Systems', 'Social Good'],
    projectsCount: 2,
    hackathonsCount: 1,
    achievements: ['Dean\'s List 2025'],
    githubUrl: 'github.com/pujitha-dev',
    collaborationScore: 96,
    endorsements: [],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Strong Developer', 'Proactive']
  },
  {
    id: 'student-1',
    name: 'Alex Rivera',
    email: 'arivera@stanford.edu',
    college: 'Stanford University',
    course: 'Computer Science',
    year: 'Junior',
    bio: 'Full-stack developer interested in AI/ML and healthcare systems. Build-fast mindset. Love React, Node.js, and PyTorch.',
    skills: [
      { name: 'React', level: 'Intermediate' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Python', level: 'Advanced' },
      { name: 'PyTorch', level: 'Beginner' },
      { name: 'TypeScript', level: 'Intermediate' }
    ],
    interests: ['AI/ML', 'HealthTech', 'Web Development', 'Open Source'],
    projectsCount: 4,
    hackathonsCount: 3,
    achievements: ['1st Place Stanford Health Hack 2025', 'Vanguard Fellow'],
    githubUrl: 'github.com/alexrivera-dev',
    collaborationScore: 95,
    endorsements: [
      { category: 'Technical Contribution', count: 8, senderNames: ['Sophia Chen', 'Marcus Johnson'] },
      { category: 'Reliability', count: 6, senderNames: ['Elena Rostova'] },
      { category: 'Communication', count: 5, senderNames: ['Sophia Chen'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Reliable', 'Strong Developer', 'Problem Solver']
  },
  {
    id: 'student-2',
    name: 'Sophia Chen',
    email: 'schen@mit.edu',
    college: 'Massachusetts Institute of Technology',
    course: 'Design & Computer Science',
    year: 'Senior',
    bio: 'Passionate about creating clean, accessible interfaces. Love wireframing, building design systems, and frontend prototyping.',
    skills: [
      { name: 'Figma', level: 'Advanced' },
      { name: 'UI/UX Design', level: 'Advanced' },
      { name: 'React', level: 'Intermediate' },
      { name: 'Tailwind CSS', level: 'Advanced' }
    ],
    interests: ['Design Systems', 'Frontend', 'EdTech', 'Product Design'],
    projectsCount: 6,
    hackathonsCount: 4,
    achievements: ['MIT Design Lab Innovator Award', 'Figma Student Ambassador'],
    githubUrl: 'github.com/sophc-design',
    collaborationScore: 98,
    endorsements: [
      { category: 'Technical Contribution', count: 4, senderNames: ['Alex Rivera'] },
      { category: 'Teamwork', count: 12, senderNames: ['Alex Rivera', 'Elena Rostova', 'Marcus Johnson'] },
      { category: 'Communication', count: 10, senderNames: ['Daniel Kim', 'Marcus Johnson'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Good Communicator', 'Good Teammate', 'Creative Specialist']
  },
  {
    id: 'student-3',
    name: 'Marcus Johnson',
    email: 'mjohnson@berkeley.edu',
    college: 'UC Berkeley',
    course: 'Electrical Engineering & Computer Science',
    year: 'Sophomore',
    bio: 'Backend wizard, database designer. I build fast, robust APIs and care about scalability and query optimization.',
    skills: [
      { name: 'PostgreSQL', level: 'Advanced' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Go', level: 'Intermediate' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'Redis', level: 'Beginner' }
    ],
    interests: ['Cloud Architecture', 'Databases', 'Backend Security', 'Distributed Systems'],
    projectsCount: 3,
    hackathonsCount: 1,
    achievements: ['CalHacks 2025 Best API winner'],
    githubUrl: 'github.com/marcusj-backend',
    collaborationScore: 92,
    endorsements: [
      { category: 'Technical Contribution', count: 9, senderNames: ['Alex Rivera', 'Sophia Chen'] },
      { category: 'Task Completion', count: 7, senderNames: ['Aisha Patel'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Strong Developer', 'Reliable']
  },
  {
    id: 'student-4',
    name: 'Elena Rostova',
    email: 'erostova@gatech.edu',
    college: 'Georgia Institute of Technology',
    course: 'Data Science',
    year: 'Junior',
    bio: 'Machine learning practitioner. Specializing in NLP and recommendation models. Looking to build projects that solve real societal needs.',
    skills: [
      { name: 'Python', level: 'Advanced' },
      { name: 'PyTorch', level: 'Advanced' },
      { name: 'NLP', level: 'Advanced' },
      { name: 'SQL', level: 'Intermediate' }
    ],
    interests: ['AI/ML', 'Social Good', 'Data Visualization', 'NLP Research'],
    projectsCount: 5,
    hackathonsCount: 2,
    achievements: ['Published paper at ACL student workshop', 'Kaggle Competition Top 2%'],
    githubUrl: 'github.com/elena-rost',
    collaborationScore: 94,
    endorsements: [
      { category: 'Technical Contribution', count: 7, senderNames: ['Alex Rivera'] },
      { category: 'Reliability', count: 8, senderNames: ['Sophia Chen', 'Daniel Kim'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Reliable', 'Strong Developer', 'Problem Solver']
  },
  {
    id: 'student-5',
    name: 'Daniel Kim',
    email: 'dkim@uw.edu',
    college: 'University of Washington',
    course: 'Informatics (Product Management)',
    year: 'Senior',
    bio: 'Bridging engineering and user requirements. Focus on agile workflows, wireframing, and ensuring the product achieves its metrics.',
    skills: [
      { name: 'Product Management', level: 'Advanced' },
      { name: 'Agile', level: 'Advanced' },
      { name: 'User Research', level: 'Advanced' },
      { name: 'Figma', level: 'Beginner' }
    ],
    interests: ['Product Growth', 'EdTech', 'Social Apps', 'Startups'],
    projectsCount: 7,
    hackathonsCount: 5,
    achievements: ['UW Foster Startup Pitch winner', 'Product School Scholar'],
    githubUrl: 'github.com/dankim-pm',
    collaborationScore: 97,
    endorsements: [
      { category: 'Teamwork', count: 14, senderNames: ['Sophia Chen', 'Elena Rostova'] },
      { category: 'Communication', count: 12, senderNames: ['Alex Rivera', 'Sophia Chen'] },
      { category: 'Reliability', count: 9, senderNames: ['Elena Rostova'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Good Communicator', 'Good Teammate', 'Reliable']
  },
  {
    id: 'student-6',
    name: 'Aisha Patel',
    email: 'apatel@cmu.edu',
    college: 'Carnegie Mellon University',
    course: 'Information Security',
    year: 'Junior',
    bio: 'Interested in smart contract security, systems architecture, and web application pentesting. Cryptography enthusiast.',
    skills: [
      { name: 'Rust', level: 'Intermediate' },
      { name: 'Go', level: 'Intermediate' },
      { name: 'Cryptography', level: 'Advanced' },
      { name: 'Linux', level: 'Advanced' }
    ],
    interests: ['Security', 'Blockchain', 'Systems Programming', 'Web Dev'],
    projectsCount: 2,
    hackathonsCount: 2,
    achievements: ['CMU CTF 2nd Place Team member', 'Defcon attendee'],
    githubUrl: 'github.com/aisha-sec',
    collaborationScore: 91,
    endorsements: [
      { category: 'Technical Contribution', count: 5, senderNames: ['Marcus Johnson'] },
      { category: 'Task Completion', count: 4, senderNames: ['Marcus Johnson'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Strong Developer', 'Reliable']
  },
  {
    id: 'student-7',
    name: 'Liam O Connor',
    email: 'loconnor@utexas.edu',
    college: 'University of Texas at Austin',
    course: 'Computer Science',
    year: 'Senior',
    bio: 'Mobile application developer specializing in React Native and Flutter. Passionate about sleek micro-interactions.',
    skills: [
      { name: 'React Native', level: 'Advanced' },
      { name: 'Flutter', level: 'Intermediate' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'React', level: 'Intermediate' }
    ],
    interests: ['Mobile Development', 'UI/UX Design', 'SportsTech', 'Personal Productivity'],
    projectsCount: 5,
    hackathonsCount: 4,
    achievements: ['HackTX Best Mobile App Award', 'App Store Published Developer'],
    githubUrl: 'github.com/liam-mobile',
    collaborationScore: 93,
    endorsements: [
      { category: 'Technical Contribution', count: 6, senderNames: ['Sophia Chen'] },
      { category: 'Reliability', count: 5, senderNames: ['Daniel Kim'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Reliable', 'Strong Developer']
  },
  {
    id: 'student-8',
    name: 'Sarah Miller',
    email: 'smiller@umich.edu',
    college: 'University of Michigan',
    course: 'Computer Engineering',
    year: 'Junior',
    bio: 'DevOps enthusiast. Focused on Docker, Kubernetes, CI/CD pipelines, and cloud platform integrations (AWS/GCP).',
    skills: [
      { name: 'Docker', level: 'Advanced' },
      { name: 'Kubernetes', level: 'Intermediate' },
      { name: 'GitHub Actions', level: 'Advanced' },
      { name: 'AWS', level: 'Intermediate' }
    ],
    interests: ['DevOps', 'Cloud Computing', 'Infrastructure as Code', 'Linux systems'],
    projectsCount: 3,
    hackathonsCount: 2,
    achievements: ['AWS Certified Cloud Practitioner'],
    githubUrl: 'github.com/smiller-ops',
    collaborationScore: 90,
    endorsements: [
      { category: 'Reliability', count: 6, senderNames: ['Marcus Johnson'] },
      { category: 'Technical Contribution', count: 4, senderNames: ['Aisha Patel'] }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    reputationTags: ['Reliable', 'Problem Solver']
  }
];

export const mockHackathons: Hackathon[] = [
  {
    id: 'hack-1',
    name: 'Global AI Hackathon 2026',
    theme: 'AI for Climate Change and Sustainability',
    deadline: '2026-10-15',
    eligibility: 'All college students globally',
    teamSizeRange: '2-4 members',
    requiredSkills: ['Python', 'Machine Learning', 'Data Science', 'UI/UX Design'],
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
    saved: false
  },
  {
    id: 'hack-2',
    name: 'EduHacks 2026',
    theme: 'Redefining Digital Learning Environments',
    deadline: '2026-09-20',
    eligibility: 'Undergraduate and Graduate Students',
    teamSizeRange: '1-5 members',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Educational Pedagogy'],
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120',
    saved: true
  },
  {
    id: 'hack-3',
    name: 'Securithon CMU',
    theme: 'Next-Gen Cybersecurity Solutions',
    deadline: '2026-11-05',
    eligibility: 'Enrollment in a technical degree program',
    teamSizeRange: '3-4 members',
    requiredSkills: ['Rust', 'Cryptography', 'Network Protocols', 'Go'],
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=120',
    saved: false
  },
  {
    id: 'hack-4',
    name: 'CalHacks v13',
    theme: 'Open Innovation Track',
    deadline: '2026-10-01',
    eligibility: 'All students',
    teamSizeRange: '2-4 members',
    requiredSkills: ['TypeScript', 'Tailwind CSS', 'API Integration', 'Product Mindset'],
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=120',
    saved: false
  }
];

export const mockCommunities: Community[] = [
  {
    id: 'comm-1',
    name: 'AI/ML Builders',
    description: 'A community for students researching and building artificial intelligence models, NLP pipelines, computer vision systems, and deep learning engines.',
    category: 'AI/ML',
    membersCount: 1540,
    projectsCount: 42,
    posts: [
      {
        id: 'post-1-1',
        title: 'Best open source LLMs for low-VRAM deployments?',
        content: 'Hey everyone, I am building a local Study Assistant desktop app. I want to bundle a small LLM that can do basic summarization and Q&A but runs comfortably on standard student laptops. Any recommendations? Looking at Llama-3-8B q4 or Phi-3.',
        authorId: 'student-1',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
        timestamp: '2026-08-24T10:30:00Z',
        likes: 12,
        commentsCount: 5
      },
      {
        id: 'post-1-2',
        title: 'Resource: PyTorch Cheat Sheet for Neural Net Debugging',
        content: 'I compiled a PDF guide containing common size mismatch errors, tensor reshaping commands, and gradient explosion warning signals. Highly useful for college ML courses!',
        authorId: 'student-4',
        authorName: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        timestamp: '2026-08-23T15:20:00Z',
        likes: 38,
        commentsCount: 2
      }
    ]
  },
  {
    id: 'comm-2',
    name: 'Web Dev Wizards',
    description: 'Full stack development, frontend design systems, serverless functions, state management optimization, and modern deployment strategies.',
    category: 'Web Development',
    membersCount: 2200,
    projectsCount: 65,
    posts: [
      {
        id: 'post-2-1',
        title: 'Migrating from React Context to Zustand: My Thoughts',
        content: 'Just finished moving our hackathon dashboard state to Zustand. The boilerplate is way less, and code splitting was easier. Here is a brief guide on how I structured our actions and store folders.',
        authorId: 'student-2',
        authorName: 'Sophia Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
        timestamp: '2026-08-22T08:15:00Z',
        likes: 24,
        commentsCount: 8
      }
    ]
  },
  {
    id: 'comm-3',
    name: 'UI/UX Design Studio',
    description: 'For student designers to showcase Figma mockups, share design system tokens, gather feedback on landing pages, and discuss user flows.',
    category: 'UI/UX',
    membersCount: 980,
    projectsCount: 18,
    posts: []
  },
  {
    id: 'comm-4',
    name: 'Open Source Contributors',
    description: 'Collaborate on open source student projects, contribute to popular repositories, organize documentation sprints, and find issue backlogs.',
    category: 'Open Source',
    membersCount: 1120,
    projectsCount: 29,
    posts: []
  }
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'AI Study Assistant',
    description: 'An AI-powered desktop application that analyzes student notes, creates personalized flashcards, and answers context-based questions using a locally run LLM.',
    problemSolved: 'Students struggle to extract key terms and test themselves effectively from dense lecture notes.',
    targetUsers: 'High school and college students preparing for exams.',
    category: 'Open Source',
    duration: '2-3 months',
    teamSize: 3,
    difficulty: 'Advanced',
    technologies: [
      { name: 'React', category: 'Frontend', why: 'Rich interactive desktop UI components.' },
      { name: 'TypeScript', category: 'Language', why: 'Type safety and clean interfaces.' },
      { name: 'Python', category: 'Backend/AI', why: 'Core LLM inference and text embeddings.' },
      { name: 'SQLite', category: 'Database', why: 'Lightweight local database for storing offline flashcards.' }
    ],
    requiredSkills: [
      { name: 'React', priority: 'Required' },
      { name: 'Python', priority: 'Required' },
      { name: 'NLP', priority: 'Recommended' },
      { name: 'UI/UX Design', priority: 'Optional' }
    ],
    suggestedRoles: [
      { name: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind CSS'], priority: 'High', count: 1, filled: 1 },
      { name: 'AI/ML Engineer', skills: ['Python', 'PyTorch', 'NLP'], priority: 'High', count: 1, filled: 1 },
      { name: 'Backend/DB Designer', skills: ['Python', 'SQLite', 'APIs'], priority: 'Medium', count: 1, filled: 1 }
    ],
    roadmap: [
      { id: 'ms-1-1', name: 'UI/UX Design & Architecture', description: 'Wireframe application layout and setup Python model environment.', duration: '2 weeks', status: 'Completed', tasks: ['task-1-1', 'task-1-2'] },
      { id: 'ms-1-2', name: 'Core Engine Development', description: 'Build LLM parsing scripts, database connection APIs, and state management.', duration: '4 weeks', status: 'In Progress', tasks: ['task-1-3', 'task-1-4', 'task-1-5'] },
      { id: 'ms-1-3', name: 'Integration & Testing', description: 'Connect React interface with Python server, perform accuracy tests and release beta.', duration: '2 weeks', status: 'TODO', tasks: ['task-1-6'] }
    ],
    members: [
      { studentId: 'student-1', role: 'Frontend Developer', status: 'Joined' },
      { studentId: 'student-4', role: 'AI/ML Engineer', status: 'Joined' },
      { studentId: 'student-3', role: 'Backend/DB Designer', status: 'Joined' }
    ],
    tasks: [
      { id: 'task-1-1', title: 'Figma mockups and user flows', description: 'Create high-fidelity screens for notes view, flashcard panel, and chat layout.', assigneeId: 'student-2', priority: 'Medium', status: 'Done', deadline: '2026-08-10', labels: ['Design', 'UI/UX'] },
      { id: 'task-1-2', title: 'Initialize Vite React boilerplate', description: 'Setup TypeScript, Tailwind, routers, and theme tokens.', assigneeId: 'student-1', priority: 'High', status: 'Done', deadline: '2026-08-12', labels: ['Frontend', 'Setup'] },
      { id: 'task-1-3', title: 'Develop text extraction pipeline', description: 'Write scripts using Python to parse PDF/TXT documents and chunk text.', assigneeId: 'student-4', priority: 'High', status: 'In Progress', deadline: '2026-09-01', labels: ['AI/ML', 'Backend'] },
      { id: 'task-1-4', title: 'Setup SQLite Schema', description: 'Design table structures for notes, flashcards, and chat history.', assigneeId: 'student-3', priority: 'Medium', status: 'In Progress', deadline: '2026-08-30', labels: ['Backend', 'Database'] },
      { id: 'task-1-5', title: 'Build React Sidebar & Notes View', description: 'Build UI components for note selection and file dropzone.', assigneeId: 'student-1', priority: 'High', status: 'TODO', deadline: '2026-09-05', labels: ['Frontend'] },
      { id: 'task-1-6', title: 'Test API communication latency', description: 'Benchmark note parsing latency under different document sizes.', assigneeId: null, priority: 'Low', status: 'TODO', deadline: '2026-09-15', labels: ['Testing'] }
    ],
    chatMessages: [
      { id: 'msg-1-1', senderId: 'student-1', senderName: 'Alex Rivera', senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120', content: 'Hey team, I set up the Vite project and pushed it to GitHub. Marcus, let me know when you start on the DB schema so we can link the models.', timestamp: '2026-08-23T09:12:00Z' },
      { id: 'msg-1-2', senderId: 'student-3', senderName: 'Marcus Johnson', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', content: 'Awesome Alex. I am drafting the SQLite structures today. Will share a schema diagram in Figma soon.', timestamp: '2026-08-23T11:45:00Z' },
      { id: 'msg-1-3', senderId: 'student-4', senderName: 'Elena Rostova', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', content: 'Great progress. I have successfully loaded the quantization model in Python. The inference takes under 1.2s on my laptop CPU! Check the branch `feature-llm-quant`.', timestamp: '2026-08-24T14:30:00Z' }
    ],
    files: [
      { id: 'file-1-1', name: 'application_architecture.pdf', size: '1.2 MB', category: 'Document', uploadedBy: 'Alex Rivera', uploadedAt: '2026-08-21', url: '#' },
      { id: 'file-1-2', name: 'study_assistant_figma.png', size: '2.4 MB', category: 'Design', uploadedBy: 'Sophia Chen', uploadedAt: '2026-08-22', url: '#' }
    ],
    githubConnected: true,
    githubRepoName: 'academic-builders/ai-study-assistant',
    progress: 33,
    status: 'Active',
    creatorId: 'student-1',
    deadline: '2026-10-15'
  },
  {
    id: 'project-2',
    name: 'Smart Dorm Energy Monitor',
    description: 'An IoT project connecting smart plugs in dorm rooms to a real-time web dashboard, helping students monitor and reduce their carbon footprint.',
    problemSolved: 'Students are unaware of which appliances consume the most electricity in their rooms.',
    targetUsers: 'University residential halls and environmental clubs.',
    category: 'College Project',
    duration: '1 month',
    teamSize: 4,
    difficulty: 'Intermediate',
    technologies: [
      { name: 'React', category: 'Frontend', why: 'Dynamic UI updates and real-time usage charts.' },
      { name: 'Node.js', category: 'Backend', why: 'Handles WebSockets connections from IoT hubs.' },
      { name: 'InfluxDB', category: 'Database', why: 'Optimized for high-frequency time series data.' },
      { name: 'C++', category: 'Embedded', why: 'Microcontroller programming (ESP32).' }
    ],
    requiredSkills: [
      { name: 'React', priority: 'Required' },
      { name: 'C++', priority: 'Required' },
      { name: 'Embedded Systems', priority: 'Recommended' },
      { name: 'Data Visualization', priority: 'Recommended' }
    ],
    suggestedRoles: [
      { name: 'Frontend Engineer', skills: ['React', 'Charts.js'], priority: 'High', count: 1, filled: 1 },
      { name: 'Hardware Engineer', skills: ['C++', 'ESP32', 'Circuits'], priority: 'High', count: 1, filled: 0 },
      { name: 'Backend Architect', skills: ['Node.js', 'InfluxDB'], priority: 'High', count: 1, filled: 1 },
      { name: 'Project Manager', skills: ['Agile', 'Documentation'], priority: 'Low', count: 1, filled: 1 }
    ],
    roadmap: [
      { id: 'ms-2-1', name: 'Sensor Setup & Calibration', description: 'Connect smart plug relays and test voltage sensor reading accuracy.', duration: '1 week', status: 'Completed', tasks: ['task-2-1'] },
      { id: 'ms-2-2', name: 'Dashboard Design & Backend API', description: 'Initialize dashboard UI and backend database to receive socket data.', duration: '2 weeks', status: 'In Progress', tasks: ['task-2-2', 'task-2-3'] },
      { id: 'ms-2-3', name: 'Field Testing', description: 'Deploy plugs in 3 dorm rooms and run dashboard for a week.', duration: '1 week', status: 'TODO', tasks: [] }
    ],
    members: [
      { studentId: 'student-2', role: 'Frontend Engineer', status: 'Joined' },
      { studentId: 'student-3', role: 'Backend Architect', status: 'Joined' },
      { studentId: 'student-5', role: 'Project Manager', status: 'Joined' }
    ],
    tasks: [
      { id: 'task-2-1', title: 'ESP32 Wi-Fi Setup script', description: 'Write basic script to authenticate microcontrollers and push ping data to a dummy server.', assigneeId: 'student-3', priority: 'High', status: 'Done', deadline: '2026-08-15', labels: ['Hardware', 'IoT'] },
      { id: 'task-2-2', title: 'Build Dashboard Layout', description: 'Create responsive grids with mock cards for total electricity usage and room indicators.', assigneeId: 'student-2', priority: 'High', status: 'In Progress', deadline: '2026-08-28', labels: ['Frontend'] },
      { id: 'task-2-3', title: 'Configure WebSocket Server', description: 'Enable Node.js Express server to handle connections and pipe metrics to InfluxDB.', assigneeId: 'student-3', priority: 'High', status: 'TODO', deadline: '2026-09-02', labels: ['Backend'] }
    ],
    chatMessages: [],
    files: [],
    githubConnected: false,
    githubRepoName: '',
    progress: 33,
    status: 'Planning',
    creatorId: 'student-2',
    deadline: '2026-09-30'
  },
  {
    id: 'project-3',
    name: 'PeerEndorse - Reputation System',
    description: 'A decentralized professional reputation app for students, letting them write secure, verified peer recommendations and record scores.',
    problemSolved: 'Traditional resumes show grades but fail to verify actual collaborative skills.',
    targetUsers: 'Recruiters and students looking to show team fit.',
    category: 'Startup',
    duration: 'Semester',
    teamSize: 4,
    difficulty: 'Advanced',
    technologies: [
      { name: 'React', category: 'Frontend', why: 'Standard web panel interface.' },
      { name: 'Rust', category: 'Blockchain', why: 'Smart contract development.' },
      { name: 'Solidity', category: 'Blockchain', why: 'Alternative contract scripting.' },
      { name: 'Tailwind CSS', category: 'Styling', why: 'Clean responsive dashboard cards.' }
    ],
    requiredSkills: [
      { name: 'React', priority: 'Required' },
      { name: 'Rust', priority: 'Recommended' },
      { name: 'Cryptography', priority: 'Recommended' }
    ],
    suggestedRoles: [
      { name: 'Contract Specialist', skills: ['Rust', 'Solidity', 'Security'], priority: 'High', count: 1, filled: 1 },
      { name: 'Frontend Lead', skills: ['React', 'TypeScript'], priority: 'High', count: 1, filled: 0 },
      { name: 'Product Manager', skills: ['Market Research', 'UX Design'], priority: 'Medium', count: 1, filled: 0 }
    ],
    roadmap: [],
    members: [
      { studentId: 'student-6', role: 'Contract Specialist', status: 'Joined' }
    ],
    tasks: [],
    chatMessages: [],
    files: [],
    githubConnected: true,
    githubRepoName: 'aishasec/peerendorse-contracts',
    progress: 0,
    status: 'Planning',
    creatorId: 'student-6',
    deadline: '2026-12-15'
  },
  {
    id: 'project-4',
    name: 'EduPath - Career Recommendation Platform',
    description: 'An intelligent recommendation system analyzing student course choices, projects, and interests to suggest personalized career trajectories and skills.',
    problemSolved: 'Students lack clarity on what specific industry skills they need for their dream career paths.',
    targetUsers: 'College undergraduates searching for internships and industry alignment.',
    category: 'College Project',
    duration: '1-2 weeks',
    teamSize: 2,
    difficulty: 'Intermediate',
    technologies: [
      { name: 'React', category: 'Frontend', why: 'Interactive tree map interfaces.' },
      { name: 'Python', category: 'AI/Model', why: 'Data processing and ML recommendation script.' },
      { name: 'Flask', category: 'Backend', why: 'Exposing recommendations as endpoints.' }
    ],
    requiredSkills: [
      { name: 'React', priority: 'Required' },
      { name: 'Python', priority: 'Required' },
      { name: 'UI/UX Design', priority: 'Recommended' }
    ],
    suggestedRoles: [
      { name: 'Frontend Engineer', skills: ['React', 'Tailwind CSS'], priority: 'High', count: 1, filled: 1 },
      { name: 'ML Specialist', skills: ['Python', 'Pandas', 'Flask'], priority: 'High', count: 1, filled: 1 }
    ],
    roadmap: [
      { id: 'ms-4-1', name: 'Scaffold and Data Gathering', description: 'Extract skills associations from online job portals.', duration: '3 days', status: 'Completed', tasks: ['task-4-1', 'task-4-2'] },
      { id: 'ms-4-2', name: 'Algorithm and Deployment', description: 'Train decision tree models and deploy endpoints.', duration: '5 days', status: 'Completed', tasks: ['task-4-3'] }
    ],
    members: [
      { studentId: 'student-5', role: 'Frontend Engineer', status: 'Joined' },
      { studentId: 'student-4', role: 'ML Specialist', status: 'Joined' }
    ],
    tasks: [
      { id: 'task-4-1', title: 'Setup GitHub repository and routes', description: 'Create repo and setup React Router.', assigneeId: 'student-5', priority: 'High', status: 'Done', deadline: '2026-08-15', labels: ['Setup'] },
      { id: 'task-4-2', title: 'Web Scraper for Skills Data', description: 'Write Python script using Beautiful Soup to pull technical job descriptions.', assigneeId: 'student-4', priority: 'High', status: 'Done', deadline: '2026-08-17', labels: ['Data Science'] },
      { id: 'task-4-3', title: 'Expose Flask endpoints', description: 'Build api/recommend endpoint returning skills matching vector distances.', assigneeId: 'student-4', priority: 'High', status: 'Done', deadline: '2026-08-20', labels: ['Backend'] }
    ],
    chatMessages: [],
    files: [],
    githubConnected: true,
    githubRepoName: 'dankim-pm/edupath-career-analyzer',
    progress: 100,
    status: 'Completed',
    showcase: {
      problemSolved: 'Students taking courses blindly without knowing how they fit into the actual industry job profiles.',
      solution: 'An automated analyzer connecting academic syllabi, Github commits, and resume files directly to skill recommendation grids.',
      screenshots: [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'
      ],
      liveDemoUrl: 'https://edupath-demo.vercel.app',
      githubUrl: 'https://github.com/dankim-pm/edupath-career-analyzer',
      achievements: ['Featured in University informatics blog', 'Completed 3 days ahead of timeline'],
      completionDate: '2026-08-22',
      published: true
    },
    creatorId: 'student-5',
    deadline: '2026-08-25'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'connection_request',
    title: 'New Connection Request',
    message: 'Sophia Chen wants to connect with you.',
    timestamp: '2026-08-24T14:45:00Z',
    isRead: false,
    senderId: 'student-2'
  },
  {
    id: 'notif-2',
    type: 'project_invitation',
    title: 'Project Invitation',
    message: 'Alex Rivera invited you to join "AI Study Assistant" as a Frontend Developer.',
    timestamp: '2026-08-23T10:15:00Z',
    isRead: true,
    senderId: 'student-1',
    projectId: 'project-1'
  },
  {
    id: 'notif-3',
    type: 'task_assigned',
    title: 'Task Assigned',
    message: 'You have been assigned to "ESP32 Wi-Fi Setup script" in "Smart Dorm Energy Monitor".',
    timestamp: '2026-08-24T09:00:00Z',
    isRead: false,
    projectId: 'project-2',
    taskId: 'task-2-1'
  }
];
