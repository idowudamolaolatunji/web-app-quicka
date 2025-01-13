import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useDataContext } from '../../context/DataContext';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/layout/Insight';
import { GrTag } from 'react-icons/gr';
import { LuClipboardList } from 'react-icons/lu';
import { MdOutlineFilterList, MdOutlineOfflineShare, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/layout/TooltipUI';
import { cap1stLetter, formatNumber, dateTimeFormat } from '../../utils/helper';
import { imgString } from '../../assets/images/png_elements';
import { useAuthContext } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Tab from '../../components/elements/Tab';

import transaction_emptyImg from '../../assets/images/illustrations/transactions.png'
import settlement_emptyImg from '../../assets/images/illustrations/settlements.png'
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import Drawer from '../../components/modal/Drawer';

///////////////////////////////////////////////

const transaction_emptyTitle = "Track transactions offline & online";
const transaction_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";

const settlement_emptyTitle = "Online payments settlement";
const settlement_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";


function index() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab")
    ///////////////////////////////////////
    const { store } = useAuthContext();
    const { showInsights, showFilterModal, handleToggleFilter } = useDataContext();
    const { loader, error, transactions, settlements, handleFetchUserStoreTransactions, handleFetchUserStoreSettlements } = useFetchedContext();
    const { currencies, mainCurrency } = store;
    const currency = currencies[mainCurrency]?.symbol;

    const webTransactions = transactions?.filter(transaction => transaction?.transactionType == "web")?.reduce((sum, transaction) => sum + transaction?.order?.orderAmount, 0);
    const offlineTransactions = transactions?.filter(transaction => transaction?.transactionType == "offline")?.reduce((sum, transaction) => sum + transaction?.order?.orderAmount, 0);
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    const [activeTab, setActiveTab] = useState("");
    const [search, setSearch] = useState('');
    
    
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
                <TooltipUI placement='top' title={cap1stLetter(row?.order?.channel)}>
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
                        <button className='table--btn' onClick={activeTab == "transaction" ? handleFetchUserStoreTransactions : handleFetchUserStoreSettlements}><MdOutlineRefresh /></button>
                    </TooltipUI>

                    <input type="text" className="table--input form--input" placeholder='search..' />
                </span>

                <span className="flex">
                    <button className='table--btn'>Reset filter</button>

                    <TooltipUI placement='top' title="Filters">
                        <button className='table--btn'><MdOutlineFilterList /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }

    useEffect(function () {
        document.title = `Quicka | ${activeTab == "transaction" ? "All Transactions" : "Payment Settlements"}`;
    }, []);


    // SET THE SHOWN TABS DIRECTLY FROM THE PARAMS ROUTE
    useEffect(function () {
        if (tabParams) {
            setActiveTab(tabParams)
        } else {
            navigate("?tab=transaction")
        }
        setSearch("")
    }, [tabParams]);


    return (
        <>
            {(showFilterModal?.name == activeTab && showFilterModal.isShown) && (
                <Drawer title={`${cap1stLetter(activeTab)} Filters`} setClose={() => handleToggleFilter("")}>
                    
                </Drawer>
            )}
            
            <PageUI
                items={activeTab == "transaction" ? transactions : settlements}
                data={activeTab == "transaction" ? transactions : settlements}
                pageName={activeTab}
                columns={activeTab == "transaction" ? transaction_columns : settlement_columns}
                emptyText={activeTab == "transaction" ? transaction_emptyText : settlement_emptyText}
                emptyImg={activeTab == "transaction" ? transaction_emptyImg : settlement_emptyImg}
                emptyTitle={activeTab == "transaction" ? transaction_emptyTitle : settlement_emptyTitle}
                hasLink={false}
                loader={loader} error={error}
                pointOnHover={activeTab == "transaction" ? false : true}
                headTabs={ activeTab == "transaction" ? (
                    <TableHeadTabs pageName="transaction" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchUserStoreTransactions} />
                ) : (
                    <TableHeadTabs pageName="settlement" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchUserStoreSettlements} /> 
                )}
            >

                {showInsights?.transaction && (
                    <div className='page__section--insights insight--grid'>
                        <Insight loader={loader[activeTab]} title='Pending Settlements' pre={currency} value={0} icon={<LuClipboardList />} />
                        <Insight loader={loader[activeTab]} title='Total Website transactions' pre={currency} value={webTransactions} icon={<GrTag />} />
                        <Insight loader={loader[activeTab]} title='Total Offline transactions' pre={currency} value={offlineTransactions} icon={<MdOutlineOfflineShare />} />
                    </div>
                )}

                {/* THE TABS UI */}
                <div className="page--tabs">
                    <Tab title="Transactions" onClick={() => navigate("?tab=transaction")} active={activeTab == "transaction"} />
                    <Tab title="Settlements" onClick={() => navigate("?tab=settlement")} active={activeTab == "settlement"} />
                </div>
            </PageUI>
        </>
    )
}

export default index