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
import { formatNumber } from '../../utils/helper';


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
    console.log(offlineTransactions)

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
            name: "Amount",
            selector: row => (
                <p className="value">₦{formatNumber(row.amount)}</p>
            )
        },
        {
            name: 'Status', 
            selector: row => (
                <span className={`status status--${row.status}`}>
                    <p>{row.status}</p>
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