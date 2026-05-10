import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, Loader2 } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', data);
      
      // Backend returns flat: { success, _id, name, email, role, profilePicUrl, token }
      if (response.data.success) {
        login(response.data);
        toast.success('Login successful!');
        
        const role = response.data.role;
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'hr') navigate('/hr/dashboard');
        else navigate('/candidate/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="bg-primary-600 text-white p-3 rounded-xl mb-4">
            <Briefcase size={32} />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign in'}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
