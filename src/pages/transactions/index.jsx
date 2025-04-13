import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/layout/Insight';
import { GrTag } from 'react-icons/gr';
import { LuClipboardList } from 'react-icons/lu';
import { MdOutlineFilterList, MdOutlineOfflineShare, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/layout/TooltipUI';
import { cap1stLetter, formatNumber, dateTimeFormat, formatDate } from '../../utils/helper';
import { imgString } from '../../assets/images/png_elements';
import { useAuthContext } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Tab from '../../components/elements/Tab';

import transaction_emptyImg from '../../assets/images/illustrations/transactions.png'
import settlement_emptyImg from '../../assets/images/illustrations/settlement.png'
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import SimpleModal from '../../components/modal/SimpleModal';
import Drawer from '../../components/modal/Drawer';
import { GoDotFill } from 'react-icons/go';
import Info from '../../components/elements/Info';
import { useWindowSize } from 'react-use';
import { AiOutlineClose } from 'react-icons/ai';

///////////////////////////////////////////////

const transaction_emptyTitle = "Track transactions offline & online";
const transaction_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";

const settlement_emptyTitle = "Online payments settlement";
const settlement_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";


function index() {
    const navigate = useNavigate();
    const location = useLocation();
    const { width } = useWindowSize();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab");
    ///////////////////////////////////////
    const { store } = useAuthContext();
    const { showInsights, showFilterModal, handleToggleFilter } = useDataContext();
    const { loader, transactions, settlements, handleFetchMyStoreTransactions, handleFetchMyStoreSettlements } = useFetchedContext();
    const currency = store?.currency?.symbol;

    const webTransactions = transactions?.filter(transaction => transaction?.transactionType == "web")?.reduce((sum, transaction) => sum + transaction?.order?.profit, 0);
    const offlineTransactions = transactions?.filter(transaction => transaction?.transactionType == "offline")?.reduce((sum, transaction) => sum + transaction?.order?.profit || 0, 0);
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    const [activeTab, setActiveTab] = useState("transaction");
    const [search, setSearch] = useState('');
    const [showDetailModal, setShowDetailModal] = useState({ show: false, selectedData: null });
    const { selectedData } = showDetailModal;
    
    
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
                    <img width={width > 450 ? "32px" : "24px"} alt={row?.order?.channel} src={imgString(row?.order?.channel)} />
                </TooltipUI>
            ), width: '100px'
        },
        {
            name: "Amount",
            selector: row => (
                <p className="value">{row?.order?.profit ? currency + formatNumber(row?.order?.profit) : "-- Order Deleted --"}</p>
            )
        },
        {
            name: "Payment Type",
            selector: row => (
                <>
                    {row?.paymentType ? (
                        <span className="status status--success">
                            <p><GoDotFill />{row?.paymentType == "bank-transfer" ? "transfer" : row?.paymentType}</p>
                        </span>
                    ) : (
                        <span className="status status--failed">
                            <p><GoDotFill />Unpaid</p>
                        </span>
                    )}
                </>
            )
        },
        {
            name: 'Status',
            selector: row => (
                <span className={`status status--${row?.status}`}>
                    <p><GoDotFill />{row?.status == "success" ? "Successful" : "Pending"}</p>
                </span>
            ),
        },
        {
            name: "Transaction Type",
            selector: row => (
                <TooltipUI placement='top' title="Offline transaction">
                    <span className={`status status--draft`}>
                        <p><GoDotFill />{row?.transactionType}</p>
                    </span>
                </TooltipUI>
            )
        },
        {
            name: "Date",
            selector: row => (
                <TooltipUI placement='top' title={formatDate(row?.order?.orderDate)}>
                    <p>{formatDate(row?.order?.orderDate)}</p>
                </TooltipUI>
            ),
        }
    ];

    const settlement_columns = [];


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


    const handleCloseDetailModal = function() {
        setShowDetailModal({ show: false, selectedData: null });
    }


    return (
        <React.Fragment>
            {(showFilterModal?.name == activeTab && showFilterModal.isShown) && (
                <Drawer title={`${cap1stLetter(activeTab)} Filters`} setClose={() => handleToggleFilter("")}>
                    
                </Drawer>
            )}

            {showDetailModal.show && (
                <SimpleModal
                    setClose={handleCloseDetailModal}
                    icon={<AiOutlineClose />}
                    title={`${cap1stLetter(activeTab)} Detail ${activeTab && selectedData?.transactionId}`}
                >

                    <div className="item__preview--summary" style={{ marginTop: "2rem" }}>
                        <div className='preview--body-item'>
                            Sales Channel 
                            <span className='preview--body-value flex' style={{ flexDirection: "row", gap: ".68rem", textTransform: "capitalize", alignItems: "center" }}>
                                {selectedData?.order?.channel} <img style={{ width: "2.8rem" }} alt={selectedData?.order?.channel} src={imgString(selectedData?.order?.channel)} />
                            </span>
                        </div>
                        {/* <div className='preview--body-item'><span>Product{item?.products?.length > 1 ? "s" : ""} Price <span className='value'>* {item?.orderTotalQuantity}</span></span><span className='preview--body-value value'>{currency}{formatNumber(item?.profit + item?.orderDiscountAmount)}</span></div>
                        <div className='preview--body-item'>Order Discount <span className='preview--body-value value'>{item?.orderDiscountAmount ? `-${currency}${formatNumber(item?.orderDiscountAmount)}` : "--"}</span></div>
                        <div className='preview--body-item'>Delivery Fee <span className='preview--body-value value'>{item?.orderDeliveryFee ? `${currency}${formatNumber(item?.orderDeliveryFee)}` : "--"}</span></div>
                        <div className='preview--body-item'>Total Paid <span className='preview--body-value value'>{currency}{formatNumber(item?.orderSubTotal)}</span></div>
                        <div className='preview--body-item'>Sales Profit <span className='preview--body-value value'>{currency}{formatNumber(item?.profit)}</span></div> */}
                    </div>
                </SimpleModal>
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
                hasDetailModal={true}
                shouldSelect={false}
                setDetailModal={setShowDetailModal}
                pointOnHover={activeTab == "transaction" ? false : true}
                headTabs={ activeTab == "transaction" ? (
                    <TableHeadTabs pageName="transaction" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchMyStoreTransactions} />
                ) : (
                    <TableHeadTabs pageName="settlement" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchMyStoreSettlements} /> 
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


                <div className="top--bar info" style={{ margin: "2rem 0" }}>
                    <Info text="Please note that all pending settlements are paid to your bank / payment account after 24 hours after the transaction occured" />
                </div>
            </PageUI>
        </React.Fragment>
    )
}

export default index