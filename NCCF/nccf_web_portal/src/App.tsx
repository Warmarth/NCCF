import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Rooms from './pages/Rooms'
import Room from './pages/Room'
import VerifyPayment from './pages/VerifyPayment'
import Admin from './pages/Admin'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import Layout from './layout'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './hook/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(AuthContext);
  const user = context?.user;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const RootRoute = () => {
  const context = useContext(AuthContext);
  const user = context?.user;
  if (user) return <Navigate to="/dashboard" replace />;
  
  return <Landing />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootRoute />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<Room />} />
        <Route path="/verify-payment" element={<VerifyPayment />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);




function App() {

  return (
    <>
      
        <RouterProvider router={router} />
    
    </>
  )
}

export default App