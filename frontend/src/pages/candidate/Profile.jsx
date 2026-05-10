import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Loader2, Camera } from 'lucide-react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const CandidateProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/users/me');
      if (res.data.success) {
        const userData = res.data.data;
        setValue('name', userData.name);
        setValue('email', userData.email);
        setProfilePicPreview(userData.profilePicUrl);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.password) formData.append('password', data.password);
      if (selectedFile) formData.append('profilePic', selectedFile);

      const res = await api.put('/api/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Profile updated successfully');
        // Update context with new user data
        updateUser(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account details and profile picture.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-primary-700 transition-colors">
                <Camera size={16} />
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            <div className="flex-1 space-y-2 pt-2">
              <h3 className="text-lg font-bold text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500">
                Upload a professional picture. JPG, PNG or WEBP. Max 2MB.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
              <input
                type="password"
                {...register('password', {
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                placeholder="Leave blank to keep current password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfile;
