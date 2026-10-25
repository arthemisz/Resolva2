import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authApi';
import { ArrowLeft, LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      console.log('Login successful:', response);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-[#5C5750] hover:text-[#14110F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        {/* Login Card */}
        <div className="rounded-[10px] bg-[#F1F0EA] border border-[#D3D1C8] p-8 shadow-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-[8px] bg-[#14110F] flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-6 h-6">
                <path
                  d="M56 36H104A22 22 0 0 1 126 58V88A22 22 0 0 1 104 110H72L50 132V110H56A22 22 0 0 1 34 88V58A22 22 0 0 1 56 36Z"
                  fill="#FFF"
                />
                <polyline
                  points="57,74 73,89 104,57"
                  fill="none"
                  stroke="#14110F"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="124" cy="38" r="14" fill="#10A36B" stroke="#14110F" strokeWidth="4" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#14110F] mb-2">Welcome Back</h2>
            <p className="text-sm text-[#5C5750]">
              Sign in to manage your inventory
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-[8px] bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#14110F] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-[8px] border border-[#D3D1C8] bg-white text-[#14110F] placeholder-[#5C5750] focus:outline-none focus:ring-2 focus:ring-[#10A36B] focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#14110F] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-[8px] border border-[#D3D1C8] bg-white text-[#14110F] placeholder-[#5C5750] focus:outline-none focus:ring-2 focus:ring-[#10A36B] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Hint */}
          <div className="mt-4 p-3 rounded-[8px] bg-white/50 border border-[#D3D1C8]">
            <p className="text-xs text-[#5C5750] text-center">
              <span className="font-semibold text-[#14110F]">Demo:</span> demo@resolva.com / demo123
            </p>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#5C5750]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#14110F] hover:text-[#10A36B] transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
