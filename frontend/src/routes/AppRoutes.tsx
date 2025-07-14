import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import LoadingSpinner from '../ui/LoadingSpinner'
import TravelLogsPage from '../pages/travel-logs/TravelLogsPage'
import CreateTravelLogPage from '../pages/travel-logs/CreateTravelLogPage'
import TravelLogDetailPage from '../pages/travel-logs/TravelLogDetails'
import ProtectedRoute from './ProtectedRoute'
import EditTravelLogPage from '../pages/travel-logs/EditTravelLogPage'
import CreateLogEntryPage from '../pages/travel-logs/CreateLogEntryPage'
import EditLogEntryPage from '../pages/travel-logs/EditLogEntryPage'
import WishlistsPage from '../pages/wishlist/WishListPage'
import WishlistDetailPage from '../pages/wishlist/WishListDetails'
import PlacesPage from '../pages/places/PlacesPage'
import TransportsPage from '../pages/transport/TransportPage'
import CreateWishlistPage from '../pages/wishlist/CreateWishlistPage'
import EditWishlistPage from '../pages/wishlist/EditWishListPage'
import CreateWishlistItemPage from '../pages/wishlist/CreateWishlistItemPage'
import GroupsPage from '../pages/groups/GroupsPage'
import CreateGroupPage from '../pages/groups/CreateGroupsPage'
import GroupDetailPage from '../pages/groups/GroupDetailPage'



export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/travel-logs">
              <Route index element={<TravelLogsPage />} />
              <Route path="new" element={<CreateTravelLogPage />} />
              <Route path=":logId">
                <Route index element={<TravelLogDetailPage />} />
                <Route path="edit" element={<EditTravelLogPage />} />
                <Route path="entries">
                  <Route path="new" element={<CreateLogEntryPage />} />
                  <Route path=":entryId/edit" element={<EditLogEntryPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="/wishlists">
              <Route index element={<WishlistsPage />} />
              <Route path="new" element={<CreateWishlistPage />} />
              <Route path=":wishlistId">
                <Route index element={<WishlistDetailPage />} />
                <Route path="edit" element={<EditWishlistPage />} />
                <Route path="items">
                  <Route path="new" element={<CreateWishlistItemPage />} />
                </Route>
              </Route>
            </Route>
          
         
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/transports" element= {<TransportsPage/>}></Route>
            <Route path="/groups">
                <Route index element={<GroupsPage />} />
                <Route path="new" element={<CreateGroupPage />} />
                <Route path=":groupId" element={<GroupDetailPage />} />
            </Route>
      
          </Route>


          
          
        </Route>
        
        {/* 404 */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Suspense>
  )
}