import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authApi';
import { ArrowLeft, UserPlus } from 'lucide-react';
import ResolvaLogo from '../components/common/ResolvaLogo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { name, email, password } = formData;
      const response = await register({ name, email, password });
      console.log('Registration successful:', response);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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

        {/* Register Card */}
        <div className="rounded-[10px] bg-[#F1F0EA] border border-[#D3D1C8] p-8 shadow-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-[8px] bg-[#14110F] flex items-center justify-center">
              <ResolvaLogo className="w-8 h-8" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#14110F] mb-2">Create Account</h2>
            <p className="text-sm text-[#5C5750]">
              Join us to start managing your inventory
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-[8px] bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#14110F] mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-[8px] border border-[#D3D1C8] bg-white text-[#14110F] placeholder-[#5C5750] focus:outline-none focus:ring-2 focus:ring-[#10A36B] focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

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
              <p className="mt-1 text-xs text-[#5C5750]">At least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#14110F] mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
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
                <span>Creating account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#5C5750]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#14110F] hover:text-[#10A36B] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
