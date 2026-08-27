import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Users, 
  MessageSquare, 
  Trophy, 
  QrCode, 
  CheckCircle2, 
  Code2, 
  Lightbulb, 
  Smartphone,
  ChevronRight,
  TrendingUp,
  Heart,
  Plus
} from 'lucide-react';
import heroImage from '../../assets/hero_dashboard.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mockFeaturedProjects = [
    {
      title: "EcoSphere: Carbon Tracker",
      description: "A mobile application that tracks personal daily carbon footprint by analyzing grocery receipts and travel routes.",
      creator: "Sophia Chen",
      category: "College Project",
      difficulty: "Intermediate",
      slots: 2,
      skills: ["React Native", "Python", "TensorFlow"]
    },
    {
      title: "UniMatch Team Finder",
      description: "A matchmaking engine built for student hackathons to automatically construct optimal teams based on complementary skillsets.",
      creator: "Alex Thompson",
      category: "Hackathon",
      difficulty: "Advanced",
      slots: 1,
      skills: ["React", "TypeScript", "Supabase"]
    },
    {
      title: "MedChain Health",
      description: "Decentralized electronic health records platform securing patient data using blockchain technology for campus clinic networks.",
      creator: "Ben Carter",
      category: "Startup",
      difficulty: "Advanced",
      slots: 3,
      skills: ["Solidity", "Next.js", "Tailwind CSS"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-x-hidden selection:bg-primary-500 selection:text-white">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary-300/10 blur-[80px]" />
        <div className="absolute top-[20%] right-[5%] w-[450px] h-[450px] rounded-full bg-violet-400/10 blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      </div>

      {/* 1. Header / Navigation Bar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-primary-600 p-1.5 rounded-lg text-white shadow-premium">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-primary-950 to-primary-600 bg-clip-text text-transparent">
              PROJECTHUB
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-500">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary-600 transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('key-features')} className="hover:text-primary-600 transition-colors">Key Features</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-primary-600 transition-colors">Projects</button>
            <button onClick={() => scrollToSection('community')} className="hover:text-primary-600 transition-colors">Community</button>
            <button onClick={() => scrollToSection('qr-connect')} className="hover:text-primary-600 transition-colors">QR Connect</button>
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="font-semibold">
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')} className="font-semibold shadow-premium">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Subheader pill */}
          <div className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-100/50 rounded-full px-3 py-1 mb-6 animate-pulse">
            <Badge variant="primary" size="sm" className="font-bold">NEW</Badge>
            <span className="text-[11px] font-bold text-primary-700 tracking-wide">THE PREMIER STUDENT PLATFORM</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            PROJECTHUB <br />
            <span className="bg-gradient-to-r from-primary-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              "Turn Ideas Into Impact."
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl text-slate-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-10">
            Find the right teammates, discover meaningful projects, collaborate with students, and turn your ideas into real-world solutions.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mb-16">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/discover')}
              className="w-full sm:w-auto font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 group"
              rightIcon={<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            >
              Find a Project
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate('/my-projects')}
              className="w-full sm:w-auto font-bold hover:-translate-y-0.5"
              leftIcon={<Plus className="h-4 w-4 text-primary-500" />}
            >
              Create a Project
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/communities')}
              className="w-full sm:w-auto font-bold hover:-translate-y-0.5"
            >
              Join Community
            </Button>
          </div>

          {/* Hero Graphic - Premium Mockup */}
          <div className="w-full max-w-5xl rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl relative group overflow-hidden">
            {/* Glossy header controls */}
            <div className="flex items-center space-x-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50 shrink-0 rounded-t-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-slate-400 pl-4 font-semibold">projecthub.dev/dashboard</span>
            </div>
            
            {/* Main Mockup Image */}
            <div className="bg-slate-900 overflow-hidden aspect-[16/9] flex items-center justify-center rounded-b-xl">
              <img 
                src={heroImage} 
                alt="ProjectHub Dashboard Preview" 
                className="w-full h-full object-cover select-none group-hover:scale-[1.01] transition-transform duration-700" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. How ProjectHub Works */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              How ProjectHub Works
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              A comprehensive lifecycle designed to take your ideas from scribbles on a napkin to high-fidelity, published products.
            </p>
          </div>

          {/* Stepper Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-[28%] left-[10%] right-[10%] h-[2px] bg-slate-100 z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 mb-5">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">1. Discover</h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                Find projects and teammates aligned with your active academic stack.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 mb-5">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">2. Connect</h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                Match with students based on complementary skills and interests.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 mb-5">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">3. Collaborate</h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                Communicate in channels, exchange ideas, and build out roadmaps together.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 mb-5">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">4. Build</h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                Complete milestones, deploy demos, and showcase achievements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Key Features */}
      <section id="key-features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge variant="primary" size="sm" className="font-bold mb-3">FEATURES</Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything Students Need
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Packed with powerful features that convert technical potential into functional software products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card hoverable className="flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-2">Robust Project Board</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  Browse projects with filtering by category, difficulty, stack, and active deadlines. Use direct join features when teams need immediate support.
                </p>
              </div>
              <div className="flex items-center text-primary-600 text-xs font-bold hover:translate-x-1 transition-transform cursor-pointer" onClick={() => navigate('/discover')}>
                <span>Explore Board</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Card>

            <Card hoverable className="flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-2">WhatsApp/Discord-Style Chat</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  Real-time communication channels within student communities. Connect instantly with members, announce ideas, and coordinate deliverables.
                </p>
              </div>
              <div className="flex items-center text-violet-600 text-xs font-bold hover:translate-x-1 transition-transform cursor-pointer" onClick={() => navigate('/communities')}>
                <span>Browse Communities</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Card>

            <Card hoverable className="flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <QrCode className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-2">QR Connect Network</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  Beautiful custom student profile QR Cards. Scan other students' codes to preview profiles and connect instantly during hackathons and networking events.
                </p>
              </div>
              <div className="flex items-center text-emerald-600 text-xs font-bold hover:translate-x-1 transition-transform cursor-pointer" onClick={() => navigate('/profile')}>
                <span>Create QR Card</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* 5. Discover Projects Preview */}
      <section id="projects" className="py-20 bg-slate-100/50 border-y border-slate-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <Badge variant="primary" size="sm" className="font-bold mb-3">DISCOVERY</Badge>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Student Projects
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                Browse projects currently recruiting active contributors.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/discover')} className="mt-4 md:mt-0 font-bold">
              View All Projects
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockFeaturedProjects.map((project, idx) => (
              <Card key={idx} hoverable className="flex flex-col justify-between bg-white border border-slate-150 h-full">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wide">{project.category}</span>
                    <Badge variant={project.difficulty === 'Advanced' ? 'danger' : 'primary'} size="sm">
                      {project.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-5">
                    {project.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center font-bold text-[10px] text-primary-700">
                      {project.creator.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span className="text-slate-500 font-medium">By {project.creator}</span>
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    {project.slots} Slots Left
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Student Collaboration */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual representation of Student matches */}
            <div className="relative p-6 bg-white border border-slate-150 rounded-2xl shadow-xl flex flex-col space-y-4">
              <div className="absolute top-[-5px] right-[-5px] w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>Teammate Recommendations</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">98% Fit Match</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-extrabold text-xs">SC</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sophia Chen</h4>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">UX/UI Designer • Stanford</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                  <span className="text-[9px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-semibold">Figma</span>
                  <span className="text-[9px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-semibold">Prototyping</span>
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowRight className="h-5 w-5 rotate-90" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-extrabold text-xs">AT</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Alex Thompson</h4>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">Backend Engineer • MIT</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                  <span className="text-[9px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-semibold">Python</span>
                  <span className="text-[9px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-semibold">TensorFlow</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 pt-3 border-t border-slate-50">
                <span>Complementary Skills Match</span>
                <span className="text-primary-600 font-bold flex items-center">Connect Now <ChevronRight className="h-4 w-4" /></span>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-6">
              <Badge variant="primary" size="sm" className="font-bold">COLLABORATION</Badge>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Connect Based on Real Skills and Fit
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                ProjectHub's recommender engine matches students possessing complementary stack skills (e.g. UX/UI designers matching with full-stack engineers). Browse verified achievements, collaboration ratings, and portfolios.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Verified student profiles tied to university email authentication.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Collaboration ratings given by team leads after project completions.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Double-blind discovery features to prevent matching biases.
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Community section */}
      <section id="community" className="py-20 bg-slate-900 text-white relative overflow-hidden z-10">
        
        {/* Background blobs */}
        <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-primary-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-600/20 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-[10px] bg-primary-800 text-primary-200 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                COMMUNITY CHAT
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                WhatsApp/Discord-Style Campus Rooms
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join dedicated study hubs and student interest communities. Send real-time messages, share code resources, advertise open project roles, and keep up with hackathon updates.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="block text-primary-400 font-bold text-sm">#general</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Daily discussion and networking.</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="block text-primary-400 font-bold text-sm">#project-ideas</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Brainstorming sandbox.</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="block text-primary-400 font-bold text-sm">#resources</span>
                  <span className="text-[10px] text-slate-400 block mt-1">File shares and code snippets.</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="block text-primary-400 font-bold text-sm">#announcements</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Important milestone updates.</span>
                </div>
              </div>
            </div>

            {/* Visual Chat Mockup */}
            <div className="bg-slate-950 rounded-2xl border border-white/10 shadow-2xl p-4 font-sans text-left max-w-lg mx-auto w-full">
              {/* Top info bar */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">AI & Machine Learning</h3>
                    <p className="text-[9px] text-emerald-400 leading-none mt-0.5">142 members active</p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 border border-white/10 px-2 py-0.5 rounded-full uppercase font-bold">#project-ideas</span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 h-48 overflow-y-auto mb-4 scrollbar-thin text-xs">
                
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center font-bold text-[10px] text-white">SC</div>
                  <div className="bg-white/5 p-2 rounded-xl rounded-tl-none max-w-[80%] border border-white/5">
                    <span className="block text-[10px] font-bold text-slate-300">Sophia Chen</span>
                    <p className="text-[11px] text-slate-200 mt-0.5">Hey guys! I have an idea for a sustainability tracker app. Anyone interested in coding the Python backend?</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center font-bold text-[10px] text-white">AT</div>
                  <div className="bg-white/5 p-2 rounded-xl rounded-tl-none max-w-[80%] border border-white/5">
                    <span className="block text-[10px] font-bold text-slate-300">Alex Thompson</span>
                    <p className="text-[11px] text-slate-200 mt-0.5">That sounds amazing, Sophia! I've been wanting to play around with TensorFlow models for footprint parsing. I'd love to join.</p>
                  </div>
                </div>

              </div>

              {/* Chat input box */}
              <div className="flex items-center space-x-2 border-t border-white/5 pt-3">
                <input 
                  type="text" 
                  placeholder="Send message to #project-ideas..." 
                  disabled
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                <Button variant="primary" size="sm" className="font-bold uppercase text-[9px] px-3">
                  Send
                </Button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 8. QR Connect Section */}
      <section id="qr-connect" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual QR Code Mockup */}
            <div className="bg-white border border-slate-150 shadow-2xl p-6 rounded-2xl max-w-sm mx-auto text-center flex flex-col items-center space-y-4">
              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 shadow-sm relative">
                {/* Visual simulate QR scan box lines */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary-500" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary-500" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary-500" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary-500" />
                
                {/* QR Symbol */}
                <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
              </div>

              <div className="w-full">
                <span className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">CONNECT CARD</span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-2 mb-0.5">Sophia Chen</h3>
                <p className="text-[11px] text-slate-400 font-medium leading-none">Stanford University • UX/UI Design</p>
                <div className="flex flex-wrap gap-1 justify-center mt-3">
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Figma</span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">React</span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Python</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center space-x-2 border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                <Button variant="outline" size="sm" className="w-full font-bold">Download Card</Button>
                <Button variant="secondary" size="sm" className="w-full font-bold">Copy Link</Button>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-6">
              <Badge variant="primary" size="sm" className="font-bold">NETWORKING</Badge>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Scan profiles in seconds at events
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Stop typing out social handles during hectic campus events. Display your personalized ProjectHub QR Card on your phone. Other students scan it to immediately read your public bio, active projects, and pitch proposal.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Event / Hackathon Mode</h4>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      Enable specialized event overlays showing "Interested in collaborating?" for instant team assembly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Safe Public Profiles</h4>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      QR URLs link solely to safe public-facing pages, securing private contact details and active auth credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Why ProjectHub */}
      <section className="py-20 bg-slate-100/50 border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge variant="primary" size="sm" className="font-bold mb-3">WHY US</Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Built For Modern Students
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              We focus on building functional portfolios that showcase your technical mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Portfolio Building</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Assemble and display a history of college courses, hackathons, and personal side projects directly under one unified portal.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Complementary Recruiting</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Connect with designers, writers, developers, and project leads. Put together high-achieving multidisciplinary student teams.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hackathon Preps</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Meet up with active builders days before local college hackathons or national development expos. Arrive with a ready team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Call to Action (CTA) */}
      <section className="py-20 relative z-10 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary-600 via-violet-600 to-indigo-700 p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          
          {/* Glowing gradient backdrops */}
          <div className="absolute top-[-50%] left-[-20%] w-[350px] h-[350px] rounded-full bg-white/10 blur-[60px]" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[350px] h-[350px] rounded-full bg-white/10 blur-[60px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to Turn Ideas Into Impact?</h2>
            <p className="text-primary-100 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              Join thousands of students building their developer networks, contributing to repositories, and launching their first platforms.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => navigate('/signup')} 
                className="w-full sm:w-auto font-bold bg-white text-primary-700 hover:bg-slate-50"
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/login')} 
                className="w-full sm:w-auto font-bold border-white text-white hover:bg-white/10"
              >
                Access Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-slate-900 border-t border-slate-850 py-16 text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            <div className="space-y-4 col-span-2">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-600 p-1 rounded-lg text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-wider">PROJECTHUB</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Connect with student developers, browse active project boards, launch your team, and show off finished builds.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-white mb-4 tracking-widest">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/discover')} className="hover:text-white transition-colors">Discover Projects</button></li>
                <li><button onClick={() => navigate('/communities')} className="hover:text-white transition-colors">Student Hubs</button></li>
                <li><button onClick={() => navigate('/hackathons')} className="hover:text-white transition-colors">Hackathons</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-white mb-4 tracking-widest">Account</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Login</button></li>
                <li><button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">Sign Up</button></li>
                <li><button onClick={() => navigate('/settings')} className="hover:text-white transition-colors">Settings</button></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>for student builders worldwide.</span>
            </span>
            <span className="mt-4 sm:mt-0">© {new Date().getFullYear()} ProjectHub. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
