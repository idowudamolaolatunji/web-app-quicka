import React, { useEffect } from 'react'
import PageUI from '../pageUIComponents/PageUI'
import { useDataContext } from '../../context/DataContext';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/Insight';
import { GrTag } from 'react-icons/gr';
import { TbArrowWaveRightDown } from 'react-icons/tb';
import { LuClipboardList } from 'react-icons/lu';
import emptyImg from '../../assets/images/illustrations/transactions.png'
import { MdOutlineFilterList, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/TooltipUI';
import { capitalizeFirstLetter, formatNumber, dateTimeFormat } from '../../utils/helper';
import { imgString } from '../../assets/images';


///////////////////////////////////////////////
const BASE_URL = import.meta.env.VITE_BASE_URL

const emptyTitle = "Track transactions offline & online";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";


function index() {
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, error, transactions, handleFetchUserStoreTransactions } = useFetchedContext();

    const webTransactions = transactions?.filter(transaction => transaction?.transactionType == "web")?.reduce((sum, transaction) => sum + transaction?.order?.orderAmount, 0);
    const offlineTransactions = transactions?.filter(transaction => transaction?.transactionType == "offline")?.reduce((sum, transaction) => sum + transaction?.order?.orderAmount, 0);

    const columns = [
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
                <p className="value">₦{formatNumber(row?.order?.orderAmount)}</p>
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

    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh table">
                        <button className='table--btn' onClick={handleFetchUserStoreTransactions}><MdOutlineRefresh /></button>
                    </TooltipUI>
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
    
    useEffect(function() {
        document.title = "Quicka | All Transactions";

        if(transactions?.length < 1 && error?.transaction) {
            handleFetchUserStoreTransactions();
        }
    }, []);

    return (
        <PageUI
            columns={columns}
            data={transactions}
            items={transactions}
            pageName="transaction"
            emptyText={emptyText}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            goto={false}
            loader={loader} error={error}
            headTabs={<HeadTabs />}
        >

            {showInsights?.transaction && (
                <div className='page__section--insights insight--grid' style={{ marginBottom: '3rem', ...(width > 900 && { width: '90%' }) }}>
                    <Insight loader={loader?.transaction} title='Pending Settlement' pre='₦' value={0} icon={<LuClipboardList />} />
                    <Insight loader={loader?.transaction} title='Total Website transaction' pre='₦' value={webTransactions} icon={<GrTag />} />
                    <Insight loader={loader?.transaction} title='Total Offline transaction' pre='₦' value={offlineTransactions} icon={<TbArrowWaveRightDown />} />
                </div>
            )}
        </PageUI>
    )
}

export default index