import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getWishlistById, getWishlistItems, getOverlappingWishlists } from '../../api/wishList';
import { createTravelGroup, addGroupMember, getTravelGroups } from '../../api/travelgroup';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../ui/LoadingSpinner';
import WishlistItemCard from '../../components/wishlists/WishlistItemCard';
import { 
  EyeIcon, 
  SlashIcon, 
  UsersIcon, 
  PlusIcon, 
  PencilIcon,
  CalendarIcon,
  StarIcon,
  MapPinIcon,
  HeartIcon,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

type VisibilitySettings = 'public' | 'friends_only' | 'private';

interface Wishlist {
  wishlistId: string;
  userId: string;
  title: string;
  visibility: VisibilitySettings;
  createdAt: string;
  updatedAt: string;
  username?: string;
}

interface WishlistItem {
  itemId: string;
  wishlistId: string;
  placeId?: string;
  priority: string;
  targetSeason?: string;
  notificationRadius?: number;
  isActive: boolean;
  details?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  placeName?: string;
}

const getVisibilityIcon = (visibility: VisibilitySettings) => {
  switch (visibility) {
    case 'public':
      return <EyeIcon className="w-4 h-4" />;
    case 'friends_only':
      return <UsersIcon className="w-4 h-4" />;
    case 'private':
      return <SlashIcon className="w-4 h-4" />;
    default:
      return <EyeIcon className="w-4 h-4" />;
  }
};

const getVisibilityColor = (visibility: VisibilitySettings) => {
  switch (visibility) {
    case 'public':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'friends_only':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'private':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

const AddToGroupDropdown = ({ currentUserId, targetUserId }: { currentUserId: string; targetUserId: string }) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getTravelGroups(currentUserId);
      setGroups(data);
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGroup = async (groupId: string) => {
    try {
      await addGroupMember(groupId, {
        userId: targetUserId,
        role: 'member',
        invitationDetails: { source: 'wishlist_overlap' }
      });
      toast.success('User added to group successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to add user to group');
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    try {
      setCreatingGroup(true);
      const newGroup = await createTravelGroup({
        creatorId: currentUserId,
        title: newGroupName
      });
      
      await addGroupMember(newGroup.group_id, {
        userId: targetUserId,
        role: 'member',
        invitationDetails: { source: 'wishlist_overlap' }
      });
      
      toast.success(`Group "${newGroupName}" created and user added!`);
      setNewGroupName('');
      await fetchGroups();
    } catch (error) {
      toast.error('Failed to create new group');
    } finally {
      setCreatingGroup(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      >
        <UsersIcon className="w-4 h-4" />
        <span>Add to Group</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10 p-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium px-2">Existing Groups</h4>
            
            {loading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : groups.length === 0 ? (
              <p className="text-xs text-gray-500 px-2">No groups found</p>
            ) : (
              <div className="max-h-40 overflow-y-auto">
                {groups.map(group => (
                  <button
                    key={group.groupId}
                    onClick={() => handleAddToGroup(group.groupId)}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <span className="truncate">{group.title}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="pt-2 border-t mt-2">
              <h4 className="text-sm font-medium px-2 mb-2">Create New Group</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name"
                  className="flex-1 text-sm px-2 py-1 border rounded"
                />
                <button
                  onClick={handleCreateGroup}
                  disabled={creatingGroup}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  {creatingGroup ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlusIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function WishlistDetailPage() {
  const { wishlistId } = useParams<{ wishlistId: string }>();
  const { user } = useAuth();

  const { data: wishlist, isLoading: isWishlistLoading } = useQuery<Wishlist>({
    queryKey: ['wishlist', wishlistId],
    queryFn: () => getWishlistById(wishlistId!),
  });

  const { data: items, isLoading: isItemsLoading } = useQuery<WishlistItem[]>({
    queryKey: ['wishlistItems', wishlistId],
    queryFn: () => getWishlistItems(wishlistId!),
    enabled: !!wishlistId,
  });

  const { data: overlappingWishlists, isLoading: isOverlappingLoading } = useQuery<
    { wishlist: Wishlist; commonItems: WishlistItem[] }[]
  >({
    queryKey: ['overlappingWishlists', user?.id, wishlistId],
    queryFn: () => getOverlappingWishlists(user?.id || '', wishlistId),
    enabled: !!user?.id && !!wishlistId,
  });

  if (isWishlistLoading || (isItemsLoading && !items)) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <HeartIcon className="w-8 h-8 text-red-500" />
                <h1 className="text-3xl font-bold text-slate-800">{wishlist?.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-medium ${getVisibilityColor(wishlist?.visibility!)}`}>
                  {getVisibilityIcon(wishlist?.visibility!)}
                  {wishlist?.visibility?.replace('_', ' ')}
                </span>
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <CalendarIcon className="w-4 h-4" />
                  Created {new Date(wishlist?.createdAt!).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <StarIcon className="w-4 h-4" />
                  {items?.length || 0} items
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link 
                to={`/wishlists/${wishlistId}/items/new`} 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                Add Item
              </Link>
              {/* <Link 
                to={`/wishlists/${wishlistId}/edit`} 
                className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <PencilIcon className="w-5 h-5" />
                Edit
              </Link> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Wishlist Items</h2>
                {items && items.length > 0 && (
                  <span className="text-sm text-slate-500">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {isItemsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : items?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HeartIcon className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No items yet</h3>
                  <p className="text-slate-500 mb-6">Start building your wishlist by adding your first item!</p>
                  <Link 
                    to={`/wishlists/${wishlistId}/items/new`} 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add First Item
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items?.map((item: any) => (
                    <WishlistItemCard key={item.itemId} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Potential Travel Buddies</h2>
              </div>

              {isOverlappingLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : overlappingWishlists && overlappingWishlists.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {overlappingWishlists.map(({ wishlist, commonItems }) => (
                    <div key={wishlist.wishlistId} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{wishlist.title}</h3>
                          <p className="text-sm text-slate-600">by {wishlist.username || wishlist.userId}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getVisibilityColor(wishlist.visibility)}`}>
                          {getVisibilityIcon(wishlist.visibility)}
                          {wishlist.visibility === 'friends_only' ? 'Friends' : wishlist.visibility}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-slate-700">
                            {commonItems.length} common item{commonItems.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {commonItems.slice(0, 3).map((item) => (
                            <div key={item.itemId} className="flex items-center gap-2 text-xs text-slate-600">
                              <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">
                                {item.placeName || 'Unnamed place'}
                              </span>
                              <span className={`ml-auto font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                            </div>
                          ))}
                          {commonItems.length > 3 && (
                            <p className="text-xs text-slate-500 mt-1">
                              +{commonItems.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        {user?.id && wishlist.userId && (
                          <AddToGroupDropdown 
                            currentUserId={user.id} 
                            targetUserId={wishlist.userId} 
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UsersIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-1">No matches found</h3>
                  <p className="text-sm text-slate-500">No overlapping wishlists with other users yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}