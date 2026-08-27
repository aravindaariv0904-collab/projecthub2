import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Mail, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    
    login(email, password)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          navigate('/');
        } else {
          setError(res.error || 'No student account found with this email and password combination. Try signing up!');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || 'An unexpected authentication error occurred.');
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 text-center">Sign in to your account</h3>
        <p className="mt-1.5 text-xs text-slate-500 text-center">
          Or{' '}
          <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500">
            create a new student profile
          </Link>
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-700 leading-normal text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="College Email Address"
          type="email"
          placeholder="e.g. student@stanford.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          className="w-full font-semibold"
          isLoading={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="pt-2 text-center border-t border-slate-100">
        <p className="text-[11px] text-slate-400">
          Demo accounts: <span className="font-semibold text-slate-600">arivera@stanford.edu</span> or <span className="font-semibold text-slate-600">schen@mit.edu</span> (use any password)
        </p>
      </div>
    </div>
  );
};
