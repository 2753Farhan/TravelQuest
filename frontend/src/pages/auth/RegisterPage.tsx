import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import type { UserRoles } from '../../types/core'
import apiClient from '../../api/client'
import axios from 'axios'
type RegisterFormData = {
  username: string
  email: string
  password: string
  role: UserRoles
}

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'traveler'
    }
  })
  
// In RegisterPage.tsx
const onSubmit = handleSubmit(async (data) => {
  try {
    const response = await apiClient.post('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role
    });

    // Only proceed if registration was successful
    if (response.status >= 200 && response.status < 300) {
    //   await login(data.email, data.password);
      toast.success('Registration successful!');
      navigate('/');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Display backend validation errors
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Registration failed';
      toast.error(errorMessage);
      
      // Log detailed error for debugging
      console.error('Registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        validationErrors: error.response?.data?.errors
      });
    } else {
      toast.error('An unexpected error occurred');
    }
  }
});
  
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            className="input w-full"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="input w-full"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            className="input w-full"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="role" className="block mb-1 font-medium">
            Account Type
          </label>
          <select
            id="role"
            {...register('role')}
            className="input w-full"
          >
            <option value="traveler">Traveler</option>
            <option value="explorer">Explorer</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}