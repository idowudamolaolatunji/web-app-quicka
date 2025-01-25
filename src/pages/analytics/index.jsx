import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useWindowSize } from 'react-use';
import Tab from '../../components/elements/Tab';
import Line from '../../components/elements/Line';
import { DateRangePicker } from 'rsuite';
import Spinner from '../../components/spinner/mainSpinner';
import { BsCalendar3 } from 'react-icons/bs';
import { useFetchedContext } from '../../context/FetchedContext';
import { useLocation, useNavigate } from 'react-router-dom';
import ConnectionError from '../../components/layout/ConnectionError';
import ErrorComponent from '../../components/layout/ErrorComponent';

import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths, subWeeks, subYears, subQuarters, startOfQuarter, endOfQuarter } from 'date-fns';

import ProductsAnalytics from './analyticsComponents/ProductsAnalytics';
import SalesAnalytics from './analyticsComponents/SalesAnalytics';
import CustomersAnalytics from './analyticsComponents/CustomersAnalytics';
import TransactionsAnalytics from './analyticsComponents/TransactionsAnalytics';
import CampaignsAnalytics from './analyticsComponents/CampaignsAnalytics';
import WebsiteTrafficAnalytics from './analyticsComponents/WebsiteTrafficAnalytics';
import { useAuthContext } from '../../context/AuthContext';


function index() {
    const date = new Date();
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab")
    ////////////////////////////////////////////////////
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { globalConnectionError } = useFetchedContext();

    const { after } = DateRangePicker;
    const true580px = width >= 580 ? false : true;
    const yearStarts = moment().startOf('year').toDate();
    const yearEnds = moment().endOf('year').toDate();
    const notAfterThisYear = after(yearEnds)
    /////////////////////////////////////////////////
    /////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("");
    const [selectedDates, setSelectedDates] = useState({ from: yearStarts, to: yearEnds, prev: "to" });
    const [dateRange, setDateRange] = useState([yearStarts, yearEnds]);
    const [rangeIsOpened, setRangeIsOpened] = useState(false);
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

    const resetSelectedDates = function() {
        setSelectedDates({ from: dateRange[0], to: dateRange[1], prev: "to" })
    }

    const handleResetDateRange = function() {
        setDateRange([yearStarts, yearEnds]);
        resetSelectedDates()
    }

    const handleChangeDateRange = function (range) {
        setDateRange(range)
        setSelectedDates({ from: range[0], to: range[1] });
    }

    const handleSelectedDateRange = function(range) {
        const year = moment(range).year();
        
        if(selectedDates.prev == "to") {
            setSelectedDates({ ...selectedDates, from: moment(range).format("MM/DD/YYYY"), prev: "from" })
        }
        
        const fromYear = moment(selectedDates.from).year();
        if(selectedDates.prev == "from") {
            if(year < fromYear) {
                setSelectedDates({ ...selectedDates, to: selectedDates.from, from: moment(range).format("MM/DD/YYYY"), prev: "to" })
            } else {
                setSelectedDates({ ...selectedDates, to: moment(range).format("MM/DD/YYYY"), prev: "to" })
            }
        }
    }


    useEffect(function() {
        window.scrollTo(0, 0);
        document.title = `Quicka | ${store.name}'s Anayltics`
    })

    useEffect(function () {
        if (tabParams) {
            setActiveTab(tabParams)
        } else {
            navigate("?tab=sales")
        }
    }, [tabParams]);


    // THIS EFFECT IS SOMETHING TO COMEBACK TO, but it works
    useEffect(function() {
        if(rangeIsOpened) {
            const container = document.querySelector(".rs-picker-toolbar-right");
            const apply = document.querySelector("button.rs-btn.rs-btn-primary.rs-btn-sm")
            apply.textContent = "Apply"
            /////////////////////////////////////////////
            const reset = document.createElement("button");
            reset.innerHTML = "Reset"
            reset.classList = "rs-btn rs-btn-sm rs-rest-btn";
            reset.addEventListener("click", handleResetDateRange);
            container.appendChild(reset);
        }
    }, [rangeIsOpened]);


    useEffect(function() {
        if(rangeIsOpened && selectedDates) {
            const headers = document.querySelectorAll(".rs-picker-header-date");
            headers[0].textContent = moment(selectedDates?.from).format("DD MMM YYYY")
            headers[1].textContent = moment(selectedDates?.to).format("DD MMM YYYY");
        }
    }, [rangeIsOpened, selectedDates]);
    

    return (
        <>
            {loading && <Spinner />}

            {globalConnectionError && <ConnectionError />}

            <div className='page__section--heading analytics--heading'>
                <h2 className="page__section--title">Analytics</h2>

                <span className='page__section--date'>
                    <label className="form--label">Filter for specific date</label>

                    <DateRangePicker
                        size="sm"
                        character=" - "
                        value={dateRange}
                        cleanable={false}
                        format="dd/MM/yyyy"
                        caretAs={BsCalendar3}
                        showHeader={true}
                        onChange={handleChangeDateRange}
                        showOneCalendar={true580px}
                        ranges={predefined_ranges}
                        shouldDisableDate={notAfterThisYear}
                        placement={width > 450 ? "bottomEnd" : "bottomStart"}
                        style={{ maxWidth: width < 450 ? 400 : 250, fontFamily: "Montserrat", fontWeight: "500", fontSize: "1.28rem !important" }}
                        // THIS REMAINING PART IS SOMETHING TO COMEBACK TO
                        onSelect={handleSelectedDateRange}
                        onOpen={() => setRangeIsOpened(true)}
                        onClose={() => {
                            setRangeIsOpened(false);
                            resetSelectedDates()
                        }}
                    />
                </span>
            </div>

            <div className="page--tabs" style={{ margin: "-2rem 0 0" }}>
                <Tab title="Sales" active={activeTab == "sales"} onClick={() => navigate("?tab=sales")} />
                <Tab title="Products" active={activeTab == "products"} onClick={() => navigate("?tab=products")} />
                <Tab title="Customers" active={activeTab == "customers"} onClick={() => navigate("?tab=customers")} />
                <Tab title="Website Traffic" active={activeTab == "website-traffic"} onClick={() => navigate("?tab=website-traffic")} />
                <Tab title="Transactions" active={activeTab == "transactions"} onClick={() => navigate("?tab=transactions")} />
                <Tab title="Campaigns" active={activeTab == "campaigns"} onClick={() => navigate("?tab=campaigns")} />
            </div>

            <Line border={1.4} where="Top" value="2rem" />

            {globalConnectionError && <ErrorComponent customStyle={{ padding: "10rem 2rem 6rem" }} />}

            {!globalConnectionError && (
                <div className="analytics--container">
                    {activeTab == "sales" && <SalesAnalytics dateRange={dateRange} />}
                    {activeTab == "website-traffic" && <WebsiteTrafficAnalytics dateRange={dateRange} />}
                    {activeTab == "products" && <ProductsAnalytics dateRange={dateRange} />}
                    {activeTab == "customers" && <CustomersAnalytics dateRange={dateRange} />}
                    {activeTab == "transactions" && <TransactionsAnalytics dateRange={dateRange} />}
                    {activeTab == "campaigns" && <CampaignsAnalytics dateRange={dateRange} />}
                </div>
            )}
        </>
    )
}

export default index