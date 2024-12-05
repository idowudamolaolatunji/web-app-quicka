import React, { useEffect, useState } from 'react'
import Tab from '../../components/Tab';
import Line from '../../components/Line';
import { useFetchedContext } from '../../context/FetchedContext';
import ProductsAnalytics from './analyticsComponents/ProductsAnalytics';
import Spinner from '../../components/spinner/spinner_two';


function index() {
    const { orders, products, customers, transactions } = useFetchedContext();
    ///////////////////////////////////////////////////////////////
    const [activeTab, setActiveTab] = useState("sales");
    const [loading, setLoading] = useState(true);

    return (
        <>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Analytics</h2>
            </div>

            <div className="page--tabs" style={{ margin: "-2rem 0 0" }}>
                <Tab title="Sales" active={activeTab == "sales"} onClick={() => setActiveTab("sales")} />
                <Tab title="Products" active={activeTab == "products"} onClick={() => setActiveTab("products")} />
                <Tab title="Customers" active={activeTab == "customers"} onClick={() => setActiveTab("customers")} />
                <Tab title="Transactions" active={activeTab == "transactions"} onClick={() => setActiveTab("transactions")} />
                <Tab title="Campaigns" active={activeTab == "campaigns"} onClick={() => setActiveTab("campaigns")} />
                <Tab title="Referrals" active={activeTab == "referrals"} onClick={() => setActiveTab("referrals")} />
            </div>


            <Line border={1.4} where="Top" value="2rem" />

            <div className="analytics--container">
                {activeTab == "sales" && <></>}
                {activeTab == "products" && <ProductsAnalytics />}
                {activeTab == "customers" && <></>}
                {activeTab == "transactions" && <></>}
                {activeTab == "campaigns" && <></>}
                {activeTab == "referrals" && <></>}
            </div>
                
        </>
    )
}

export default index