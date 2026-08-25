import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-900">Reset your password</h3>
        <p className="mt-1.5 text-xs text-slate-500">
          We will send you a secure link to update your login credentials.
        </p>
      </div>

      {success ? (
        <div className="space-y-4 text-center">
          <div className="inline-flex p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full mb-2">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold text-slate-900">Reset Email Dispatched</p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Check your college inbox <span className="font-semibold text-slate-700">{email}</span>. Follow the instructions to reset your password.
          </p>
          <div className="pt-2">
            <Link to="/login" className="text-xs font-semibold text-primary-600 hover:text-primary-500">
              Return to login screen
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            label="College Email Address"
            type="email"
            placeholder="e.g. student@stanford.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full font-semibold"
            isLoading={loading}
          >
            Send Reset Link
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Cancel and back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
