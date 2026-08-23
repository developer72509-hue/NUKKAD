import { Routes, Route } from 'react-router-dom';

import CustomerLayout from '../layouts/CustomerLayout';
import AuthLayout from '../layouts/AuthLayout';
import ShopkeeperLayout from '../layouts/ShopkeeperLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

import Home from '../pages/customer/Home';
import ShopDiscovery from '../pages/customer/ShopDiscovery';
import ShopProfile from '../pages/customer/ShopProfile';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Orders from '../pages/customer/Orders';
import OrderDetail from '../pages/customer/OrderDetail';
import Favourites from '../pages/customer/Favourites';
import Profile from '../pages/customer/Profile';
import Addresses from '../pages/customer/Addresses';

import Privacy from '../pages/legal/Privacy';
import Terms from '../pages/legal/Terms';
import Grievance from '../pages/legal/Grievance';
import About from '../pages/legal/About';
import Help from '../pages/legal/Help';
import Contact from '../pages/legal/Contact';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyOtp from '../pages/auth/VerifyOtp';
import AuthCallback from '../pages/auth/AuthCallback';
import TwoFactorChallenge from '../pages/auth/TwoFactorChallenge';

import Dashboard from '../pages/shopkeeper/Dashboard';
import ShopOrders from '../pages/shopkeeper/Orders';
import Products from '../pages/shopkeeper/Products';
import Inventory from '../pages/shopkeeper/Inventory';
import Notifications from '../pages/shopkeeper/Notifications';
import Reviews from '../pages/shopkeeper/Reviews';
import ShopSettings from '../pages/shopkeeper/ShopSettings';
import ShopRegister from '../pages/shopkeeper/Register';

import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer-facing storefront */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shops" element={<ShopDiscovery />} />
        <Route path="/shops/:shopId" element={<ShopProfile />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Favourites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Addresses />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/grievance" element={<Grievance />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth flows */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify" element={<VerifyOtp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/2fa" element={<TwoFactorChallenge />} />
      </Route>

      {/* Shopkeeper dashboard */}
      <Route path="/shopkeeper/register" element={<ShopRegister />} />
      <Route
        path="/shopkeeper"
        element={
          <ProtectedRoute allowedRoles={['shopkeeper']}>
            <ShopkeeperLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<ShopOrders />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="shop" element={<ShopSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
