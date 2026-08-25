import { Technology, RequiredSkill, SuggestedRole, Milestone, Task } from '../types';

interface ProjectInput {
  name: string;
  description: string;
  problemSolved: string;
  targetUsers: string;
  category: string;
  techLevel: 'know' | 'help';
  duration: string;
  teamSize: string;
}

interface AnalysisResults {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: Technology[];
  requiredSkills: RequiredSkill[];
  suggestedRoles: SuggestedRole[];
  roadmap: Milestone[];
  tasks: Task[];
}

export const analyzeIdea = (input: ProjectInput): AnalysisResults => {
  const descLower = (input.description + ' ' + input.name).toLowerCase();
  
  // 1. Detect Category & Scope to determine Difficulty
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  if (input.category === 'Startup' || descLower.includes('blockchain') || descLower.includes('deep learning') || descLower.includes('production scale')) {
    difficulty = 'Advanced';
  } else if (input.category === 'Personal Project' && (input.duration === '1-2 weeks' || input.teamSize === '2')) {
    difficulty = 'Beginner';
  }

  // 2. Technical stack and explanation keywords scanning
  const techStack: Technology[] = [];
  const skillStack: RequiredSkill[] = [];
  const roles: SuggestedRole[] = [];

  // Boolean flags for tech areas
  const isAI = descLower.includes('ai') || descLower.includes('ml') || descLower.includes('learning') || descLower.includes('predict') || descLower.includes('nlp') || descLower.includes('vision') || descLower.includes('chatgpt') || descLower.includes('llm');
  const isMobile = descLower.includes('mobile') || descLower.includes('ios') || descLower.includes('android') || descLower.includes('phone') || descLower.includes('app store');
  const isIoT = descLower.includes('iot') || descLower.includes('smart') || descLower.includes('device') || descLower.includes('sensor') || descLower.includes('hardware') || descLower.includes('embedded') || descLower.includes('arduino') || descLower.includes('esp32');
  const isCrypto = descLower.includes('blockchain') || descLower.includes('crypto') || descLower.includes('ethereum') || descLower.includes('web3') || descLower.includes('contract') || descLower.includes('solidity');
  
  // Standard Web App checks (Default if nothing else matches strongly)
  const isWeb = !isMobile && !isIoT && !isCrypto;

  // Compile technologies & skills based on flags
  if (isWeb) {
    techStack.push(
      { name: 'React', category: 'Frontend', why: 'React provides a component-driven structure perfect for rendering web dash boards.' },
      { name: 'Node.js', category: 'Backend', why: 'Node.js allows using TypeScript/JavaScript end-to-end for easy backend routes.' },
      { name: 'PostgreSQL', category: 'Database', why: 'PostgreSQL is robust, relational, and highly suitable for structured student schemas.' },
      { name: 'Vercel', category: 'Deployment', why: 'Vercel connects to Git for instant frontend updates and preview branches.' }
    );
    skillStack.push(
      { name: 'React', priority: 'Required' },
      { name: 'Node.js', priority: 'Required' },
      { name: 'TypeScript', priority: 'Recommended' },
      { name: 'Database Design', priority: 'Recommended' },
      { name: 'UI/UX Design', priority: 'Optional' }
    );
    roles.push(
      { name: 'Frontend Lead', skills: ['React', 'TypeScript', 'Tailwind CSS'], priority: 'High', count: 1, filled: 1 },
      { name: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'REST APIs'], priority: 'High', count: 1, filled: 0 }
    );
  }

  if (isAI) {
    techStack.push(
      { name: 'Python', category: 'AI Core', why: 'Python has the largest ecosystem of AI models and machine learning frameworks.' },
      { name: 'PyTorch / TensorFlow', category: 'Model Training', why: 'PyTorch is the standard choice for neural net layers and modeling weights.' },
      { name: 'FastAPI', category: 'Backend Server', why: 'FastAPI is extremely fast and integrates seamlessly with Python ML backends.' },
      { name: 'Hugging Face', category: 'Inference model', why: 'Provides quantised open weights models (like Llama/Phi) for prompt parsing.' }
    );
    skillStack.push(
      { name: 'Python', priority: 'Required' },
      { name: 'PyTorch', priority: 'Required' },
      { name: 'Data Processing', priority: 'Recommended' },
      { name: 'NLP / Computer Vision', priority: 'Recommended' },
      { name: 'Docker', priority: 'Optional' }
    );
    roles.push(
      { name: 'AI/ML Architect', skills: ['Python', 'PyTorch', 'Data Models'], priority: 'High', count: 1, filled: 1 },
      { name: 'Data Pipeline Specialist', skills: ['Python', 'Pandas', 'FastAPI'], priority: 'Medium', count: 1, filled: 0 }
    );
  }

  if (isMobile) {
    techStack.push(
      { name: 'React Native / Expo', category: 'Cross Platform', why: 'React Native allows compiling single TSX codebases to both iOS and Android stores.' },
      { name: 'Firebase', category: 'Serverless Backend', why: 'Firebase handles offline synchronization, auth, and cloud metrics with zero server setup.' },
      { name: 'Tailwind CSS', category: 'Styling', why: 'Tailwind utility classes speed up component layout styling.' }
    );
    skillStack.push(
      { name: 'React Native', priority: 'Required' },
      { name: 'TypeScript', priority: 'Required' },
      { name: 'Firebase / Supabase', priority: 'Recommended' },
      { name: 'Mobile UI Animations', priority: 'Optional' }
    );
    roles.push(
      { name: 'Mobile Developer', skills: ['React Native', 'Expo', 'TypeScript'], priority: 'High', count: 1, filled: 1 },
      { name: 'UI/UX Specialist', skills: ['Figma', 'Interactive Mockups'], priority: 'Medium', count: 1, filled: 0 }
    );
  }

  if (isIoT) {
    techStack.push(
      { name: 'C++', category: 'Microcontrollers', why: 'Embedded hardware platforms like ESP32 run highly optimized C++ loop loops.' },
      { name: 'Raspberry Pi / MicroPython', category: 'Gateway hub', why: 'MicroPython provides high-level scripting for managing physical relays.' },
      { name: 'InfluxDB', category: 'Time Series DB', why: 'Optimized for high-frequency measurements (relays, thermal logs).' }
    );
    skillStack.push(
      { name: 'C++', priority: 'Required' },
      { name: 'Embedded Systems', priority: 'Required' },
      { name: 'Circuit Design', priority: 'Recommended' },
      { name: 'Python scripting', priority: 'Optional' }
    );
    roles.push(
      { name: 'Hardware Engineer', skills: ['C++', 'ESP32', 'Circuits'], priority: 'High', count: 1, filled: 1 },
      { name: 'Firmware Specialist', skills: ['Embedded Loops', 'Time Series'], priority: 'High', count: 1, filled: 0 }
    );
  }

  if (isCrypto) {
    techStack.push(
      { name: 'Solidity / Rust', category: 'Smart Contracts', why: 'Used to write secure decentralized agreements on EVM/Solana systems.' },
      { name: 'Hardhat', category: 'Compilation Tool', why: 'Allows local node test forks and gas usage audits.' },
      { name: 'Ethers.js', category: 'Frontend Web3 Link', why: 'Pipes browser wallets (MetaMask) directly into React panels.' }
    );
    skillStack.push(
      { name: 'Solidity / Rust', priority: 'Required' },
      { name: 'Cryptography', priority: 'Required' },
      { name: 'Smart Contract Auditing', priority: 'Recommended' },
      { name: 'React integration', priority: 'Optional' }
    );
    roles.push(
      { name: 'Smart Contract Specialist', skills: ['Solidity', 'Rust', 'EVM Chains'], priority: 'High', count: 1, filled: 1 },
      { name: 'Security Auditor', skills: ['Cryptography', 'Forks Auditing'], priority: 'Medium', count: 1, filled: 0 }
    );
  }

  // 3. Setup Default Roles matching Team Size input
  const sizeNum = input.teamSize === 'Not sure' ? 3 : parseInt(input.teamSize);
  
  // Make sure PM role is added for larger projects
  if (sizeNum >= 4) {
    roles.push({
      name: 'Product Manager / Designer',
      skills: ['Figma', 'Agile roadmaps', 'User feedback coordination'],
      priority: 'Medium',
      count: 1,
      filled: 0
    });
  }

  // Make sure Q&A/DevOps is added for startup/large scopes
  if (sizeNum >= 5 || input.category === 'Startup') {
    roles.push({
      name: 'DevOps / QA Specialist',
      skills: ['GitHub Actions', 'Docker containers', 'Unit testing'],
      priority: 'Low',
      count: 1,
      filled: 0
    });
  }

  // If team size is larger than roles accumulated, fill with generic developers
  let totalRolesCount = roles.reduce((acc, r) => acc + r.count, 0);
  if (totalRolesCount < sizeNum) {
    roles.push({
      name: 'Full Stack Engineer',
      skills: ['TypeScript', 'Database hooks', 'UI responsiveness'],
      priority: 'Medium',
      count: sizeNum - totalRolesCount,
      filled: 0
    });
  }

  // 4. Create Roadmap Milestones and task lists
  const roadmap: Milestone[] = [];
  const tasks: Task[] = [];
  const makeTaskId = (mIdx: number, tIdx: number) => `task-rec-${mIdx}-${tIdx}`;

  // Milestone 1: Setup & Design
  const ms1Tasks: Task[] = [
    {
      id: makeTaskId(1, 1),
      title: 'Define Product Requirements Document',
      description: 'Draft problem parameters, user flows, and outline key metrics.',
      assigneeId: null,
      priority: 'High',
      status: 'TODO',
      deadline: 'Week 1',
      labels: ['Requirements']
    },
    {
      id: makeTaskId(1, 2),
      title: 'Establish Figma UX design systems',
      description: 'Draft visual typography, button sizes, components, and primary screens.',
      assigneeId: null,
      priority: 'Medium',
      status: 'TODO',
      deadline: 'Week 2',
      labels: ['UI/UX']
    }
  ];
  tasks.push(...ms1Tasks);
  roadmap.push({
    id: 'ms-rec-1',
    name: 'Phase 1: Research & UI/UX Design',
    description: 'Establish visual constraints, structure requirements documents, and assemble design components.',
    duration: '2 weeks',
    status: 'TODO',
    tasks: ms1Tasks.map(t => t.id)
  });

  // Milestone 2: Core Engineering
  const ms2Tasks: Task[] = [
    {
      id: makeTaskId(2, 1),
      title: 'Boilerplate configuration & Database Setup',
      description: `Initialize Vite, structure assets, and deploy the time/metric database schema.`,
      assigneeId: null,
      priority: 'High',
      status: 'TODO',
      deadline: 'Week 4',
      labels: ['Backend', 'Setup']
    },
    {
      id: makeTaskId(2, 2),
      title: 'Develop core application logic loops',
      description: `Build endpoints, model loops, and hook up core data models.`,
      assigneeId: null,
      priority: 'High',
      status: 'TODO',
      deadline: 'Week 6',
      labels: ['Core Logic']
    }
  ];
  tasks.push(...ms2Tasks);
  roadmap.push({
    id: 'ms-rec-2',
    name: 'Phase 2: Core Infrastructure Build',
    description: 'Spin up data services, setup API handlers, and finalize local logic systems.',
    duration: '4 weeks',
    status: 'TODO',
    tasks: ms2Tasks.map(t => t.id)
  });

  // Milestone 3: Integrations & Testing
  const ms3Tasks: Task[] = [
    {
      id: makeTaskId(3, 1),
      title: 'Frontend-to-Backend Endpoints Link',
      description: 'Connect UI screens to data controllers, handling latency states.',
      assigneeId: null,
      priority: 'High',
      status: 'TODO',
      deadline: 'Week 7',
      labels: ['Integration']
    },
    {
      id: makeTaskId(3, 2),
      title: 'Beta Test Run & QA checklist',
      description: 'Deploy to a test sandbox, gather feedback and patch crash bugs.',
      assigneeId: null,
      priority: 'Medium',
      status: 'TODO',
      deadline: 'Week 8',
      labels: ['Testing']
    }
  ];
  tasks.push(...ms3Tasks);
  roadmap.push({
    id: 'ms-rec-3',
    name: 'Phase 3: Integration & Testing Sprints',
    description: 'Hook UI components to backend endpoints, launch testing sandboxes, and audit crash reports.',
    duration: '2 weeks',
    status: 'TODO',
    tasks: ms3Tasks.map(t => t.id)
  });

  return {
    difficulty,
    technologies: techStack,
    requiredSkills: skillStack,
    suggestedRoles: roles,
    roadmap,
    tasks
  };
};
