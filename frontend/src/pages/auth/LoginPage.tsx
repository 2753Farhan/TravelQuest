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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="input w-full"
            disabled={isLoading}
          />
        </div>
       
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            className="input w-full"
            disabled={isLoading}
          />
        </div>
       
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/auth/register" 
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}