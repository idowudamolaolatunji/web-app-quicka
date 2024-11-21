import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useDataContext } from '../../context/DataContext';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/Insight';
import { GrTag } from 'react-icons/gr';
import { TbArrowWaveRightDown } from 'react-icons/tb';
import { LuClipboardList } from 'react-icons/lu';
import { MdOutlineFilterList, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/TooltipUI';
import { capitalizeFirstLetter, formatNumber, dateTimeFormat } from '../../utils/helper';
import { imgString } from '../../assets/images/png_elements';
import { useAuthContext } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Tab from '../../components/Tab';

import transaction_emptyImg from '../../assets/images/illustrations/transactions.png'
import settlement_emptyImg from '../../assets/images/illustrations/settlements.png'

///////////////////////////////////////////////
const BASE_URL = import.meta.env.VITE_BASE_URL

const transaction_emptyTitle = "Track transactions offline & online";
const transaction_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";

const settlement_emptyTitle = "Online payments settlement";
const settlement_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { pathname } = useLocation();
    const { store } = useAuthContext();
    const { showInsights } = useDataContext();
    const { loader, error, transactions, settlements, handleFetchUserStoreTransactions, handleFetchUserStoreSettlements } = useFetchedContext();

    const { currencies, mainCurrency } = store;
    const currency = currencies[mainCurrency]?.symbol;
    const route = pathname.split("/").at(-1);

    const webTransactions = transactions?.filter(transaction => transaction?.transactionType == "web")?.reduce((sum, transaction) => sum + transaction?.order?.orderAmount, 0);
    const offlineTransactions = transactions?.filter(transaction => transaction?.transactionType == "offline")?.reduce((sum, transaction) => sum + transaction?.order?.orderAmount, 0);

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    const [tabShown, setTabShown] = useState("transactions");
    
    
    /////////////////////////////////////////////////////////////////////
    // THE FUNCTION THAT CHANGES THE ROUTE WHEN WE CLICK A DIFFERENT TAB
    const handleTabShown = function (tab) {
        setTabShown(tab);
        if (tab == "transactions") {
            navigate(`/dashboard/${tab}`);
        } else {
            navigate(`/dashboard/transactions/${tab}`);
        }
    }


    const transaction_columns = [
        {
            name: "Transaction Id",
            selector: row => (
                <p className='value'>{row?.transactionId}</p>
            )
        },
        {
            name: "Customer",
            selector: row => row?.order?.customer?.fullname || "-- Not Added --"
        },
        {
            name: 'Sales Channel', selector: row => (
                <TooltipUI placement='top' title={capitalizeFirstLetter(row?.order?.channel)}>
                    <img width={'40px'} alt={row?.order?.channel} src={imgString(row?.order?.channel)} />
                </TooltipUI>
            ), width: '100px'
        },
        {
            name: "Amount",
            selector: row => (
                <p className="value">{currency}{formatNumber(row?.order?.orderAmount)}</p>
            )
        },
        {
            name: "Payment Type",
            selector: row => (
                <span className="status status--success">
                    <p>{row?.paymentType == "bank-transfer" ? "transfer" : row?.paymentType}</p>
                </span>
            )
        },
        {
            name: 'Status',
            selector: row => (
                <span className={`status status--${row?.status}`}>
                    <p>{row?.status == "success" && "Successful"}</p>
                </span>
            ),
        },
        {
            name: "Transaction Type",
            selector: row => (
                <TooltipUI placement='top' title="Offline transaction">
                    <span className={`status status--draft`}>
                        <p>{row?.transactionType}</p>
                    </span>
                </TooltipUI>
            )
        },
        {
            name: "Date",
            selector: row => (
                <TooltipUI placement='top' title={dateTimeFormat(row?.order?.orderDate)}>
                    <p>{dateTimeFormat(row?.order?.orderDate)}</p>
                </TooltipUI>
            ),
        }
    ];

    const settlement_columns = [];


    const HeadTabs = function () {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh table">
                        <button className='table--btn' onClick={tabShown == "transactions" ? handleFetchUserStoreTransactions : handleFetchUserStoreSettlements}><MdOutlineRefresh /></button>
                    </TooltipUI>

                    <input type="text" className="table--input form--input" placeholder='search..' />
                </span>

                <span className="flex">
                    <button className='table--btn'>Clear filter</button>

                    <TooltipUI placement='top' title="Filters">
                        <button className='table--btn'><MdOutlineFilterList /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }

    useEffect(function () {
        document.title = `Quicka | ${tabShown == "transactions" ? "All Transactions" : "Payment Settlements"}`;
    }, []);


    // SET THE SHOWN TABS DIRECTLY FROM THE PARAMS ROUTE
    useEffect(function () {
        setTabShown(route);
    }, [route]);


    return (
        <PageUI
            items={tabShown == "transactions" ? transactions : settlements}
            data={tabShown == "transactions" ? transactions : settlements}
            pageName={tabShown == "transactions" ? "transaction" : "settlement"}
            columns={tabShown == "transactions" ? transaction_columns : settlement_columns}
            emptyText={tabShown == "transactions" ? transaction_emptyText : settlement_emptyText}
            emptyImg={tabShown == "transactions" ? transaction_emptyImg : settlement_emptyImg}
            emptyTitle={tabShown == "transactions" ? transaction_emptyTitle : settlement_emptyTitle}
            goto={false}
            loader={loader} error={error}
            headTabs={<HeadTabs />}
        >

            {showInsights?.transaction && (
                <div className='page__section--insights insight--grid' style={{ marginBottom: '3rem', ...(width > 900 && { width: '90%' }) }}>
                    <Insight loader={loader?.transaction} title='Pending Settlement' pre={currency} value={0} icon={<LuClipboardList />} />
                    <Insight loader={loader?.transaction} title='Total Website transaction' pre={currency} value={webTransactions} icon={<GrTag />} />
                    <Insight loader={loader?.transaction} title='Total Offline transaction' pre={currency} value={offlineTransactions} icon={<TbArrowWaveRightDown />} />
                </div>
            )}

            {/* THE TABS UI */}
            <div className="page--tabs">
                <Tab title="Transactions" onClick={() => handleTabShown("transactions")} active={tabShown == "transactions"} />
                <Tab title="Settlements" onClick={() => handleTabShown("settlements")} active={tabShown == "settlements"} />
            </div>
        </PageUI>
    )
}

export default index