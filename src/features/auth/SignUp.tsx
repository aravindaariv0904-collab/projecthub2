import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';

export const SignUp: React.FC = () => {
  const { signup } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  
  // Credentials state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('Freshman');

  // Onboarding state
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const skillOptions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'PyTorch', 
    'Figma', 'UI/UX Design', 'PostgreSQL', 'SQLite', 
    'Go', 'Rust', 'Docker', 'Kubernetes', 'Embedded Systems', 'C++'
  ];

  const interestOptions = [
    'AI/ML', 'HealthTech', 'Web Development', 'Design Systems', 
    'Cloud Architecture', 'Security', 'Blockchain', 'Mobile Development', 
    'EdTech', 'Social Good', 'DevOps', 'IoT'
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !college || !course) {
      setError('Please fill in all fields.');
      return;
    }

    setStep(2);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      const exists = prev.find(s => s.name === skill);
      if (exists) {
        return prev.filter(s => s.name !== skill);
      } else {
        return [...prev, { name: skill, level: 'Intermediate' }];
      }
    });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = () => {
    signup({
      name,
      email,
      college,
      course,
      year,
      bio,
      skills: selectedSkills,
      interests: selectedInterests
    });
    navigate('/');
  };

  const yearOptions = [
    { value: 'Freshman', label: 'Freshman' },
    { value: 'Sophomore', label: 'Sophomore' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 text-center">
          {step === 1 ? 'Create student profile' : 'Onboard your skills'}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 text-center">
          {step === 1 ? (
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                Log in
              </Link>
            </>
          ) : (
            'Tell us what you do so we can recommend suitable teammate matches'
          )}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-700 leading-normal text-left">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNextStep} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="College Email"
            type="email"
            placeholder="e.g. arivera@stanford.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="College/University Name"
            placeholder="e.g. Stanford University"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Course / Major"
              placeholder="e.g. Computer Science"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
            <Select
              label="Current Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={yearOptions}
            />
          </div>

          <Button type="submit" className="w-full font-semibold">
            Next: Onboard Skills & Interests
          </Button>
        </form>
      ) : (
        <div className="space-y-5 text-left">
          <Input
            label="Short Bio"
            placeholder="Tell other students about your background, projects you've built, or what role you love playing in teams..."
            textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Core Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => {
                const isSelected = selectedSkills.some(s => s.name === skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Fields of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700 border-primary-300 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 font-semibold">
              Back
            </Button>
            <Button onClick={handleFinish} className="flex-1 font-semibold">
              Finish Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
