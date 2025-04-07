import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './utils/ProtectedRoute';
import 'react-loading-skeleton/dist/skeleton.css'


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
import RecordOrder from './pages/orders/subPages/RecordOrder';
import UploadProduct from './pages/products/subPages/UploadProduct';
import AddCustomer from './pages/customers/subPages/NewCustomer';
import CreateDelivery from './pages/delivery/subPages/CreateDelivery';
import RunCampaign from './pages/campaigns/subPages/RunCampaign';
import CreateCoupon from './pages/discountCoupon/subPages/CreateCoupon';
import CreateDiscount from './pages/discountCoupon/subPages/CreateDiscount';
import RunSpecialSale from './pages/discountCoupon/subPages/RunSpecialSales';

import Products from './pages/products';
import Orders from './pages/orders';
import Customers from './pages/customers';
import Delivery from './pages/delivery';
import Campaigns from './pages/campaigns';
import Analytics from './pages/analytics';

import ProductItem from './pages/products/subPages/ProductItem';
import OrderItem from './pages/orders/subPages/OrderItem';
import CustomerItem from './pages/customers/subPages/CustomerItem';
import DiscountCoupon from './pages/discountCoupon';

import Transaction from './pages/transactions';
import Settings from './pages/settings';
import Profile from './pages/profile';
import ConnectedApps from './pages/connectedApps';
import StoreCustomization from './pages/storeCustomization';
import StoreDetails from './pages/storeDetails';
import CustomDomain from './pages/customDomain';
import ConnectDomain from './pages/customDomain/subPages/ConnectDomain';
import BuyDomain from './pages/customDomain/subPages/BuyDomain';
import CustomizeTheme from './pages/storeCustomization/subPages/CustomizeTheme';
import EditStoreDetails from './pages/storeDetails/subPages/EditDetails';

import Expenses from './pages/expenses';
import RecordExpenses from './pages/expenses/subPages/RecordExpenses';
import Subscription from './pages/subscription';
import SubscriptionPlans from './pages/subscription/subPages/ChoosePlan';
import Referrals from './pages/referrals';



function App() {

    useEffect(function() {
        window.scrollTo(0, 0)
    }, []);

    
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
                    <Route path='/dashboard/discounts' element={<DiscountCoupon />}></Route>

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
                    <Route path='/dashboard/campaigns/run' element={<RunCampaign />}></Route>
                    <Route path='/dashboard/store-customisation' element={<StoreCustomization />}></Route>
                    <Route path='/dashboard/store-customisation/customise' element={<CustomizeTheme />}></Route>
                    <Route path='/dashboard/store-customisation/preview' element={<PreviewTheme />}></Route>
                    <Route path='/dashboard/integrated-apps' element={<ConnectedApps />}></Route>
                    <Route path='/dashboard/custom-domain' element={<CustomDomain />}></Route>
                    <Route path='/dashboard/custom-domain/add-domain' element={<ConnectDomain />}></Route>
                    <Route path='/dashboard/custom-domain/buy-domain' element={<BuyDomain />}></Route>
                    <Route path='/dashboard/store-details' element={<StoreDetails />}></Route>
                    <Route path='/dashboard/store-details/edit' element={<EditStoreDetails />}></Route>

                    <Route path='/dashboard/discounts/create' element={<CreateDiscount />}></Route>
                    <Route path='/dashboard/discounts/coupon/create' element={<CreateCoupon />}></Route>
                    <Route path='/dashboard/discounts/special-sales/run' element={<RunSpecialSale />}></Route>
                    <Route path='/dashboard/expenses' element={<Expenses />}></Route>
                    <Route path='/dashboard/expenses/record' element={<RecordExpenses />}></Route>
                    <Route path='/dashboard/expenses/:id/edit' element={<RecordExpenses />}></Route>

                    <Route path='/dashboard/subscription' element={<Subscription />}></Route>
                    <Route path='/dashboard/subscription/choose-plan' element={<SubscriptionPlans />}></Route>
                    <Route path='/dashboard/settings' element={<Settings />}></Route>
                    <Route path='/dashboard/profile' element={<Profile />}></Route>
                    <Route path='/dashboard/referrals' element={<Referrals />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App