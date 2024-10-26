import React, { useEffect } from 'react'
import PageUI from '../pageComponents/PageUI'
import { useDataContext } from '../../context/DataContext';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/Insight';
import { GrTag } from 'react-icons/gr';
import { TbArrowWaveRightDown } from 'react-icons/tb';
import { LuClipboardList } from 'react-icons/lu';
import emptyImg from '../../assets/images/illustrations/transactions.png'
import { MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/TooltipUI';
import { capitalizeFirstLetter, formatNumber } from '../../utils/helper';
import { facebook, online_store, physical_store, instagram, whatsapp, twitter, flutterwave_store, others, jiji, jumia, konga } from "../../assets/images/index";


function imgString(imgType) {
    if (imgType === 'online store') return online_store;
    if (imgType === 'facebook') return facebook;
    if (imgType === 'physical shop') return physical_store;
    if (imgType === 'instagram') return instagram;
    if (imgType === 'whatsapp') return whatsapp;
    if (imgType === 'twitter') return twitter;
    if (imgType === 'flutterwave store') return flutterwave_store;
    if (imgType === 'jiji') return jiji;
    if (imgType === 'jumia') return jumia;
    if (imgType === 'konga') return konga;
    if (imgType === 'others') return others;
}


///////////////////////////////////////////////
const BASE_URL = import.meta.env.VITE_BASE_URL

const emptyTitle = "Track transactions offline & online";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";


function index() {
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, error, transactions, handleFetchUserStoreTransactions } = useFetchedContext();

    const webTransactions = transactions?.filter(transaction => transaction.transactionType == "web")?.reduce((sum, transaction) => sum + transaction.amount, 0);
    const offlineTransactions = transactions?.filter(transaction => transaction.transactionType == "offline")?.reduce((sum, transaction) => sum + transaction.amount, 0);


    const columns = [
        {
            name: "Transaction Id",
            selector: row => (
                <p className='value'>{row.transactionId}</p>
            )
        },
        {
            name: "Payment Type",
            selector: row => (
                <span className="status status--success">
                    <p>{row.paymentType}</p>
                </span>
            )
        },
        {
            name: "Payment Type",
            selector: row => row?.order?.customer || "-- Not Added --"
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
                <p className="value">₦{formatNumber(row.amount)}</p>
            )
        },
        {
            name: 'Status', 
            selector: row => (
                <span className={`status status--${row.status}`}>
                    <p>{row.status == "success" && "Successful"}</p>
                </span>
            ),
            // width: '120px'
        }
    ]


    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh">
                        <button className='table--btn' onClick={handleFetchUserStoreTransactions}><MdOutlineRefresh /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }
    

    useEffect(function() {
        document.title = "Quicka | All Transactions";
        window.scrollTo(0, 0);

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
            emptyClassName="empty--others"
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