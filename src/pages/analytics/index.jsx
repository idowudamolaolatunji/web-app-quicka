import React, { useEffect, useState } from 'react'
import Tab from '../../components/Tab';
import Line from '../../components/Line';
import { DateRangePicker } from 'rsuite';
import Spinner from '../../components/spinner/spinner_two';
import { BsCalendar3 } from 'react-icons/bs';

import moment from 'moment';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths, subWeeks, subYears, subQuarters, startOfQuarter, endOfQuarter } from 'date-fns';

import ProductsAnalytics from './analyticsComponents/ProductsAnalytics';
import SalesAnalytics from './analyticsComponents/SalesAnalytics';
import CustomersAnalytics from './analyticsComponents/CustomersAnalytics';
import TransactionsAnalytics from './analyticsComponents/TransactionsAnalytics';
import CampaignsAnalytics from './analyticsComponents/CampaignsAnalytics';
import ReferralsAnalytics from './analyticsComponents/ReferralsAnalytics';
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/ConnectionError';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorComponent from '../../components/ErrorComponent';
import { useWindowSize } from 'react-use';

const date = new Date()


function index() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab")
    ////////////////////////////////////////////////////
    const { width } = useWindowSize();
    const { globalConnectionError } = useFetchedContext();
    const true580px = width >= 580 ? false : true;
    const yearStarts = moment().startOf('year').toDate();
    const yearEnds = moment().endOf('year').toDate();
    /////////////////////////////////////////////////
    /////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("");
    const [dateRange, setDateRange] = useState([yearStarts, yearEnds]);
    const [formattedDate, setFormattedDate] = useState({ from: "", to: "" });
    /////////////////////////////////////////////////////////////////////////


    const predefined_ranges = [
        {
            label: "Today",
            value: [startOfDay(date), endOfDay(date)],
        },
        {
            label: "Last 7 Days",
            value: [startOfDay(subDays(date, 6)), endOfDay(date)]
        },
        {
            label: "This Week",
            value: [startOfWeek(date), endOfWeek(date)]
        },
        {
            label: "Last Month",
            value: [startOfMonth(subMonths(date, 1)), endOfMonth(subMonths(date, 1))]
        },
        {
            label: "This Month",
            value: [startOfMonth(date), endOfMonth(date)]
        },
        {
            label: "Last Quarter",
            value: [startOfQuarter(subQuarters(date, 1)), endOfQuarter(subQuarters(date, 1))]
        },
        {
            label: "This Quarter",
            value: [startOfQuarter(date), endOfQuarter(date)]
        },
        {
            label: "Last Year",
            value: [startOfYear(subYears(date, 1)), endOfYear(subYears(date, 1))]
        },
        {
            label: "This Year",
            value: [startOfYear(date), endOfYear(date)]
        }
    ];

    const handleDateRange = function (range) {
        setDateRange(range)
        const from_date = moment(range?.at(0)).format("DD/MM/YYYY");
        const to_date = moment(range?.at(0)).format("DD/MM/YYYY");
        setFormattedDate({ from: from_date, to: to_date });
    }

    useEffect(function () {
        if (tabParams) {
            setActiveTab(tabParams)
        } else {
            navigate("?tab=sales")
        }
    }, [tabParams])


    return (
        <>
            {loading && <Spinner />}

            {globalConnectionError && <ConnectionError />}

            <div className='page__section--heading analytics--heading'>
                <h2 className="page__section--title">Analytics</h2>

                <span className='page__section--date'>
                    <label className="form--label">Select filter date</label>
                    <DateRangePicker
                        size="sm"
                        character=" - "
                        value={dateRange}
                        cleanable={false}
                        format="dd/MM/yyyy"
                        caretAs={BsCalendar3}
                        showHeader={true580px}
                        showOneCalendar={true580px}
                        onChange={handleDateRange}
                        ranges={predefined_ranges}
                        placement={width > 450 ? "bottomEnd" : "bottomStart"}
                        style={{ width: 230, fontFamily: "Montserrat", fontWeight: "500", fontSize: "1.28rem !important" }}
                    />
                </span>
            </div>

            <div className="page--tabs" style={{ margin: "-2rem 0 0" }}>
                <Tab title="Sales" active={activeTab == "sales"} onClick={() => navigate("?tab=sales")} />
                <Tab title="Products" active={activeTab == "products"} onClick={() => navigate("?tab=products")} />
                <Tab title="Customers" active={activeTab == "customers"} onClick={() => navigate("?tab=customers")} />
                <Tab title="Transactions" active={activeTab == "transactions"} onClick={() => navigate("?tab=transactions")} />
                <Tab title="Campaigns" active={activeTab == "campaigns"} onClick={() => navigate("?tab=campaigns")} />
                <Tab title="Referrals" active={activeTab == "referrals"} onClick={() => navigate("?tab=referrals")} />
            </div>

            <Line border={1.4} where="Top" value="2rem" />

            {globalConnectionError && <ErrorComponent customStyle={{ padding: "10rem 2rem 6rem" }} />}

            {!globalConnectionError && (
                <div className="analytics--container">
                    {activeTab == "sales" && <SalesAnalytics dateRange={dateRange} />}
                    {activeTab == "products" && <ProductsAnalytics dateRange={dateRange} />}
                    {activeTab == "customers" && <CustomersAnalytics dateRange={dateRange} />}
                    {activeTab == "transactions" && <TransactionsAnalytics dateRange={dateRange} />}
                    {activeTab == "campaigns" && <CampaignsAnalytics dateRange={dateRange} />}
                    {activeTab == "referrals" && <ReferralsAnalytics dateRange={dateRange} />}
                </div>
            )}
        </>
    )
}

export default index