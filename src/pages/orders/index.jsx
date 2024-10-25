import React, { useEffect, useState } from 'react'
import { capitalizeFirstLetter, formatDate, formatNumber, isWithinLast7Days } from '../../utils/helper';
import { useWindowSize } from 'react-use';
import Insight from '../../components/Insight';
import { TbNotes, TbNotesOff } from 'react-icons/tb';
import { MdOutlineFilterList, MdOutlineNoteAlt, MdOutlineRefresh, MdOutlineShoppingBag } from 'react-icons/md';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import PageUI from '../pageComponents/PageUI';
import TooltipUI from '../../components/TooltipUI';
import { facebook, online_store, physical_store, instagram, whatsapp, twitter, flutterwave_store, others, jiji, jumia, konga } from "../../assets/images/index";
import emptyImg from '../../assets/images/illustrations/sales.png';
import { AiOutlinePlus } from 'react-icons/ai';


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
const emptyTitle = "Record a new sale!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Record Order</>, link: "/dashboard/orders/record" },
];

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


function index() {
    const { width } = useWindowSize();
    const { showInsights, } = useDataContext();
    const { loader, error, orders, handleFetchUserStoreOrders } = useFetchedContext()
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
            name: 'Product', selector: row => (
                <ul className='table--list'>
                    {row.products?.map(product => (
                        <li>{product?.name}</li>
                    ))}
                </ul>
            ),
            width: '150px'
        },
        {
            name: 'Amount', selector: row => (
                <span className='value'>₦{formatNumber((row?.products || []).reduce((acc, item) => acc + item?.price, 0) || 0)}</span>
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
            ), width: '150px'
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
        document.title = "Quicka | Orders";
        window.scrollTo(0, 0);

        if (orders?.length < 1 && error.order) handleFetchUserStoreOrders();
    }, []);


    return (

        <PageUI
            pageName="order"
            items={orders}
            columns={columns}
            data={orders}
            addUrl="orders/record"
            emptyText={emptyText}
            emptyBtns={emptyBtns}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            emptyClassName="empty--order"
            headTabs={<HeadTabs />}
            loader={loader} error={error}
        // loader={loader?.order} error={error?.order}
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