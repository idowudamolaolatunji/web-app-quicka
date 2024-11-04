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
// const BankDetails = lazy(() => import('./pages/bankDetails'));
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
import Congrats from './auth/NextCongratsScreen';
import Error from './pages/error';

// GENERAL DASHBOARD PAGES 
import DashboardHome from './pages/home';
import Orders from './pages/orders';
import RecordOrders from './pages/orders/orderComponents/RecordOrder';
import Products from './pages/products';
import UploadProduct from './pages/products/productComponents/UploadProduct';
// import Collections from './pages/products/productComponents/CollectionPage';
import Transaction from './pages/transactions';
import Settings from './pages/settings';
import Profile from './pages/profile';
import ConnectedApps from './pages/connectedApps';
import Campaigns from './pages/campaigns';
import StoreCustomisation from './pages/storeCustomization';
import CustomDomain from './pages/customDomain';
import StoreInformation from './pages/storeInfo';
import Customers from './pages/customers';
import CreateCustomers from './pages/customers/customerComponents/CreateCustomers';
import CustomerItem from './pages/customers';
import DiscountCoupon from './pages/discountCoupon';
import BankDetails from './pages/bankDetails';
import Delivery from './pages/delivery';
import Subscription from './pages/subscription';
import Analytics from './pages/analytics';
import CommunityForums from './pages/communityForums';
import ProductItem from './pages/products/productComponents/ProductItem';
import OrderItem from './pages/orders/orderComponents/OrderItem';
import CreateDelivery from './pages/delivery/deliveryComponents/CreateDelivery';



function App() {

    useEffect(function() {
        window.scrollTo(0, 0)
    }, [])

    return (

        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />}></Route>
                <Route path='/reset-password/:resettoken' element={<ResetPassword />}></Route>
                <Route path='/verify-otp' element={<VerifyOtp />}></Route>
                <Route path='/onboarding' element={<Onboarding />}></Route>
                <Route path='/congratulations' element={<Congrats />}></Route>
                <Route path="*" element={<Error />} />

                <Route element={<ProtectedRoute />}>
                    <Route path='/' element={<DashboardHome />}></Route>
                    <Route path='/dashboard' element={<DashboardHome />}></Route>
                    <Route path='/dashboard/orders' element={<Orders />}></Route>
                    <Route path='/dashboard/products' element={<Products />}></Route>
                    <Route path='/dashboard/products/collections' element={<Products />}></Route>
                    <Route path='/dashboard/customers' element={<Customers />}></Route>
                    <Route path='/dashboard/delivery-rates' element={<Delivery />}></Route>
                    <Route path='/dashboard/transactions' element={<Transaction />}></Route>

                    <Route path='/dashboard/orders/record' element={<RecordOrders />}></Route>
                    <Route path='/dashboard/products/upload' element={<UploadProduct />}></Route>
                    <Route path='/dashboard/customers/add' element={<CreateCustomers />}></Route>
                    <Route path='/dashboard/delivery-rates/add' element={<CreateDelivery />}></Route>
                    
                    <Route path='/dashboard/products/:id/edit' element={<UploadProduct />}></Route>
                    <Route path='/dashboard/customers/:id/edit' element={<CreateCustomers />}></Route>
                    <Route path='/dashboard/delivery-rates/:id/edit' element={<CreateDelivery />}></Route>

                    <Route path='/dashboard/products/:id' element={<ProductItem />}></Route>
                    <Route path='/dashboard/orders/:id' element={<OrderItem />}></Route>
                    <Route path='/dashboard/customers/:id' element={<CustomerItem />}></Route>

                    <Route path='/dashboard/settings' element={<Settings />}></Route>
                    <Route path='/dashboard/custom-domain' element={<CustomDomain />}></Route>
                    <Route path='/dashboard/campaigns' element={<Campaigns />}></Route>
                    <Route path='/dashboard/integrated-apps' element={<ConnectedApps />}></Route>
                    <Route path='/dashboard/store-customisation' element={<StoreCustomisation />}></Route>
                    <Route path='/dashboard/bank-details' element={<BankDetails />}></Route>
                    <Route path='/dashboard/store-info' element={<StoreInformation />}></Route>
                    <Route path='/dashboard/discount-coupon' element={<DiscountCoupon />}></Route>
                    <Route path='/dashboard/subscription' element={<Subscription />}></Route>
                    <Route path='/dashboard/profile' element={<Profile />}></Route>
                    <Route path='/dashboard/analytics' element={<Analytics />}></Route>
                    <Route path='/dashboard/community-forums' element={<CommunityForums />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App