import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/', { replace: true });
    } catch (error: any) {
      if (axios.isAxiosError(error) ){
        // Handle email verification error specifically
        if (error.response?.status === 403 && 
            error.response?.data?.message === 'Please verify your email first') {
          toast.error('Please verify your email before logging in');
          
          // Show resend verification option
          toast((t) => (
            <div>
              <span>Need a new verification email? </span>
              <button
                onClick={async () => {
                  try {
                    await axios.post('/auth/resend-verification', { 
                      email: formData.email 
                    });
                    toast.success('Verification email sent!');
                  } catch (err) {
                    toast.error('Failed to resend verification email');
                  }
                  toast.dismiss(t.id);
                }}
                className="text-blue-500 hover:underline"
              >
                Resend now
              </button>
            </div>
          ), { duration: 10000 });
        } else {
          // Handle other errors normally
          toast.error(error.response?.data?.message || 'Login failed');
        }
      } else {
        toast.error('Login failed');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>
         
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/auth/register" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}