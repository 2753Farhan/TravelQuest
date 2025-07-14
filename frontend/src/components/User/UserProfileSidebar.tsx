import { useEffect, useState } from 'react';
import { getUserById, updateUser } from '../../api/user';
import { XMarkIcon, UserIcon, MapPinIcon, PencilIcon, CheckIcon, XMarkIcon as CancelIcon } from '@heroicons/react/24/outline';

interface UserProfileSidebarProps {
  userId: string;
  onClose: () => void;
}

export function UserProfileSidebar({ userId, onClose }: UserProfileSidebarProps) {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    role: 'traveler',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          location: userData.location || '',
          role: userData.role || 'traveler',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = () => {
    setFormData(prev => ({ 
      ...prev, 
      role: prev.role === 'traveler' ? 'explorer' : 'traveler' 
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await updateUser(userId, formData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 flex justify-end">
        <div className="bg-gradient-to-br from-slate-50 to-white w-full max-w-xs h-full overflow-y-auto shadow-2xl">
          <div className="p-4 animate-pulse">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 mb-4"></div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
              <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-3 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-3 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-3 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-3 w-2/3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-60 flex justify-end"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-50 to-white w-full max-w-xs h-full overflow-y-auto shadow-2xl border-l border-slate-200 mt-16"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex justify-between items-start">
            <h2 className="text-xl font-bold">Profile</h2>

          </div>
        </div>

        {/* Profile Section */}
        <div className="relative -mt-12 px-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{user?.username}</h3>
            <p className="text-sm text-gray-600 font-medium">{user?.email}</p>
            <div className="mt-2 px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
              <span className="text-xs font-semibold text-indigo-800 capitalize">
                {user?.role || 'traveler'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 pb-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="bio" className="block text-xs font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none text-sm"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <button
                  type="button"
                  onClick={handleRoleToggle}
                  className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 capitalize text-sm"
                >
                  {formData.role} {formData.role === 'traveler' ? '→ Explorer' : '→ Traveler'}
                </button>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold flex items-center justify-center space-x-1 text-sm"
                >
                  <CancelIcon className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 shadow-lg hover:shadow-xl text-sm"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <UserIcon className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">About</h4>
                </div>
                <p className="text-gray-900 text-sm leading-relaxed">
                  {user?.bio || 'No bio yet - let others know about your journey!'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPinIcon className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Location</h4>
                </div>
                <p className="text-gray-900 text-sm">
                  {user?.location || 'Location not specified'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Role</h4>
                </div>
                <p className="text-gray-900 text-sm font-semibold capitalize">
                  {user?.role || 'traveler'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}