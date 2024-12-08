import React, { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './utils/ProtectedRoute';
import 'react-loading-skeleton/dist/skeleton.css'


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
// const Login = lazy(() => import('./auth/login'));
// const Signup = lazy(() => import('./auth/signup'));
// const Error = lazy(() => import('./pages/error'));

// const DashboardHome = lazy(() => import('./pages/home'));
// const Orders = lazy(() => import('./pages/orders'));
// const Products = lazy(() => import('./pages/products'));
// const RecordOrders = lazy(() => import('./pages/orders/orderComponents/RecordOrder'));
// const UploadProduct = lazy(() => import('./pages/products/productComponents/UploadProduct'));
// const CreateCustomers = lazy(() => import('./pages/customers/customerComponents/CreateCustomers'));
// const ProductItem = lazy(() => import('./pages/products/productComponents/ProductItem'));
// const OrderItem = lazy(() => import('./pages/orders/orderComponents/OrderItem'));
// const CustomerItem = lazy(() => import('./pages/customers'));
// const Transaction = lazy(() => import('./pages/transactions'));
// const Settings = lazy(() => import('./pages/settings'));
// const Profile = lazy(() => import('./pages/profile'));
// const ConnectedApps = lazy(() => import('./pages/connectedApps'));
// const StoreCustomisation = lazy(() => import('./pages/storeCustomization'));
// const CustomDomain = lazy(() => import('./pages/customDomain'));
// const StoreInformation = lazy(() => import('./pages/storeInfo'));
// const Customers = lazy(() => import('./pages/customers'));
// const DiscountCoupon = lazy(() => import('./pages/salesAndCoupon'));
// const Delivery = lazy(() => import('./pages/delivery'));
// const Subscription = lazy(() => import('./pages/subscription'));
// const Analytics = lazy(() => import('./pages/analytics'));
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



// AUTHENTICATION PAGES
import Login from './auth/login';
import Signup from './auth/signup';
import ForgotPassword from './auth/forgotPassword';
import ResetPassword from './auth/resetPassword';
import VerifyOtp from './auth/otpVerification';
import Onboarding from './auth/onboarding';
import Congrats from './auth/congratsScreen';
import Error from './pages/error';

// GENERAL DASHBOARD PAGES 
import DashboardHome from './pages/home';

import Orders from './pages/orders';
import OrderItem from './pages/orders/orderComponents/OrderItem';
import RecordOrder from './pages/recordOrder';
import Products from './pages/products';
import ProductItem from './pages/products/ProductItem';
import UploadProduct from './pages/uploadProduct';
import Customers from './pages/customers';
import CustomerItem from './pages/customers';
import AddCustomer from './pages/addCustomer';
import Delivery from './pages/delivery';
import CreateDelivery from './pages/createDelivery';

import Transaction from './pages/transactions';
import Settings from './pages/settings';
import Profile from './pages/profile';
import ConnectedApps from './pages/connectedApps';
import Campaigns from './pages/campaigns';
import StoreCustomisation from './pages/storeCustomization';
import CustomDomain from './pages/customDomain';
import StoreInformation from './pages/storeInformation';

import DiscountCoupon from './pages/discountCoupon';
import Referrals from './pages/referrals';
import Subscription from './pages/subscription';
import Analytics from './pages/analytics';
import CommunityForums from './pages/communityForums';



function App() {

    useEffect(function() {
        window.scrollTo(0, 0)
    }, [])

    return (

        <BrowserRouter>
            <Routes>
                {/* UNPROTECTED ROUTES */}
                <Route path='/login' element={<Login />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />}></Route>
                <Route path='/reset-password/:resettoken' element={<ResetPassword />}></Route>
                <Route path='/verify-otp' element={<VerifyOtp />}></Route>
                <Route path='/onboarding' element={<Onboarding />}></Route>
                <Route path='/congratulations' element={<Congrats />}></Route>
                <Route path="*" element={<Error />} />

                {/* PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route path='/' element={<DashboardHome />}></Route>
                    <Route path='/dashboard' element={<DashboardHome />}></Route>

                    <Route path='/dashboard/orders' element={<Orders />}></Route>
                    <Route path='/dashboard/products' element={<Products />}></Route>
                    <Route path='/dashboard/customers' element={<Customers />}></Route>
                    <Route path='/dashboard/delivery-rates' element={<Delivery />}></Route>
                    <Route path='/dashboard/transactions' element={<Transaction />}></Route>
                    <Route path='/dashboard/analytics' element={<Analytics />}></Route>
                    <Route path='/dashboard/discount-coupon' element={<DiscountCoupon />}></Route>

                    <Route path='/dashboard/orders/record' element={<RecordOrder />}></Route>
                    <Route path='/dashboard/products/upload' element={<UploadProduct />}></Route>
                    <Route path='/dashboard/customers/add' element={<AddCustomer />}></Route>
                    <Route path='/dashboard/delivery-rates/add' element={<CreateDelivery />}></Route>
                    
                    <Route path='/dashboard/products/:id/edit' element={<UploadProduct />}></Route>
                    <Route path='/dashboard/customers/:id/edit' element={<AddCustomer />}></Route>
                    <Route path='/dashboard/delivery-rates/:id/edit' element={<CreateDelivery />}></Route>

                    <Route path='/dashboard/products/:id' element={<ProductItem />}></Route>
                    <Route path='/dashboard/orders/:id' element={<OrderItem />}></Route>
                    <Route path='/dashboard/customers/:id' element={<CustomerItem />}></Route>

                    <Route path='/dashboard/campaigns' element={<Campaigns />}></Route>
                    <Route path='/dashboard/store-customisation' element={<StoreCustomisation />}></Route>
                    <Route path='/dashboard/integrated-apps' element={<ConnectedApps />}></Route>
                    <Route path='/dashboard/custom-domain' element={<CustomDomain />}></Route>
                    <Route path='/dashboard/custom-domain/add-domain' element={<CustomDomain />}></Route>
                    <Route path='/dashboard/custom-domain/buy-domain' element={<CustomDomain />}></Route>
                    <Route path='/dashboard/store-information' element={<StoreInformation />}></Route>
                    <Route path='/dashboard/store-information/edit' element={<StoreInformation />}></Route>


                    <Route path='/dashboard/subscription' element={<Subscription />}></Route>
                    <Route path='/dashboard/referrals' element={<Referrals />}></Route>
                    <Route path='/dashboard/settings' element={<Settings />}></Route>
                    <Route path='/dashboard/profile' element={<Profile />}></Route>
                    <Route path='/dashboard/community-forums' element={<CommunityForums />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App