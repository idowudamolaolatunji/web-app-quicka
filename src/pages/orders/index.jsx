import React, { useEffect, useState } from 'react'
import { capitalizeFirstLetter, formatDate, formatNumber, isWithinLast7Days, truncateString } from '../../utils/helper';
import { useWindowSize } from 'react-use';
import Insight from '../../components/Insight';
import { TbNotes, TbNotesOff } from 'react-icons/tb';
import { MdOutlineFilterList, MdOutlineNoteAlt, MdOutlineRefresh, MdOutlineShoppingBag } from 'react-icons/md';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import PageUI from '../pageUIComponents/PageUI';
import TooltipUI from '../../components/TooltipUI';
import { AiOutlinePlus } from 'react-icons/ai';
import { imgString } from '../../assets/images';
import { GoDotFill } from 'react-icons/go';
import emptyImg from '../../assets/images/illustrations/sales.png';
// import emptyImg from '../../assets/images/illustrations/trials.png';


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
const emptyTitle = "Record a new sale!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Record new sales</>, link: "/dashboard/orders/record" },
];


function index() {
    const { width } = useWindowSize();
    const { showInsights, } = useDataContext();
    const { loader, error, orders, handleFetchUserStoreOrders, handleDeleteOneItem } = useFetchedContext()
    
    const [tableSearch, setTableSearch] = useState('');
    const completedOrders = orders?.filter(order => order.orderStatus == "completed");
    const unCompletedOrders = orders?.filter(order => order.orderStatus != "completed");
    const newOrders = orders?.filter(order => order.channel == "online store" && order.orderStatus != "completed" && isWithinLast7Days(order.orderDate));
    

    const columns = [
        {
            name: 'Channel', selector: row => (
                <TooltipUI placement='top' title={capitalizeFirstLetter(row.channel)}>
                    <img width={'40px'} alt={row.channel} src={imgString(row.channel)} />
                </TooltipUI>
            ), width: '70px'
        },
        {
            name: 'Order Id', selector: row => (
                <p className='value'>{row.orderId}</p>
            ), width: '100px'
        },
        {
            name: 'Custumer Name', selector: row => row.customer?.name || "-- Not Added --", width: '150px'
        },
        {
            name: 'Product(s)', selector: row => (
                <TooltipUI placement='top' title={
                    <ul className='table--list'>
                        {row.products?.map(({ _id, name }) => (
                            <li key={_id}><GoDotFill /> {name}</li>
                        ))}
                    </ul>
                }>
                    <ul className='table--list'>
                        {row.products?.slice(0, 3)?.map(({ _id, name }) => (
                            <li key={_id}><GoDotFill /> {truncateString(name, 18)}</li>
                        ))}
                        {row.products?.length > 3 && <li>...</li>}
                    </ul>
                </TooltipUI>
            ),
            width: '180px'
        },
        {
            name: 'Amount', selector: row => (
                <span className='value'>₦{formatNumber(row?.orderAmount)}</span>
            ), width: '100px'
        },
        {
            name: 'Payment', selector: row => (
                <span className={`status status--${( row.paymentStatus != "unpaid" ? "success" : "pending" )}`}>
                    <p>{row.paymentStatus}</p>
                </span>
            ),
            width: '120px'
        },
        {
            name: 'Delievery', selector: row => (
                <span className={`status status--${(row.deliveryStatus)}`}>
                    <p>{row.deliveryStatus}</p>
                </span>
            ),
            width: '135px'
        },
        {
            name: 'Status', selector: row => (
                <span className={`status status--${(row.orderStatus)}`}>
                    <p>{row.orderStatus}</p>
                </span>
            ),
            width: '120px'
        },
        {
            name: 'Date', selector: row => (
                <TooltipUI placement='top' title={formatDate(row.orderDate)}>
                    <p>{formatDate(row.orderDate)}</p>
                </TooltipUI>
            ),
        },
    ];


    const HeadTabs = function () {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh">
                        <button className='table--btn' onClick={handleFetchUserStoreOrders}><MdOutlineRefresh /></button>
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
        document.title = "Quicka | Your orders";

        if (orders?.length < 1 && error.order) {
            handleFetchUserStoreOrders();
        }
    }, []);


    return (

        <PageUI
            pageName="order"
            items={orders}
            columns={columns}
            data={orders}
            addUrl="orders/record"
            addBtnStr="Record sales"
            emptyText={emptyText}
            emptyBtns={emptyBtns}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            emptyClassName="empty--order"
            headTabs={<HeadTabs />}
            loader={loader} error={error}
        >

            {showInsights?.order && (
                <div className='page__section--insights insight--grid' style={{ marginBottom: '3rem', ...(width > 900 && { width: '85%' }) }}>
                    <Insight title='Total Orders' loader={loader?.order} value={orders?.length} icon={<MdOutlineShoppingBag />} />
                    <Insight title='New Orders' loader={loader?.order} value={newOrders?.length} icon={<MdOutlineNoteAlt />} />
                    <Insight title='Completed Orders' loader={loader?.order} value={completedOrders?.length} icon={<TbNotes />} />
                    <Insight title='Uncompleted Orders' loader={loader?.order} value={unCompletedOrders?.length} icon={<TbNotesOff />} />
                </div>
            )}

        </PageUI>
    )
}

export default index