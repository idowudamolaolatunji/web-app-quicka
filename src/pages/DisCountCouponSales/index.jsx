import React, { useEffect, useState } from 'react'
import PageUI from '../pageUIComponents/PageUI'
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import emptyImg from '../../assets/images/illustrations/discounts.png';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { formatNumber, ymdDateFormat, ymdDateSlashFormat } from '../../utils/helper';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Tab from '../../components/Tab';


///////////////////////////////////////////////
const emptyTitle = "Add Discounts";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Add Discount</>, link: "/dashboard/discounts/add" },
];

function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { loader, error, deliveryRates, handleDeleteOneItem, handleFetchUserStoreDeliveryRates } = useFetchedContext();

    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tabs, setTabs] = useState("discounts");
    // discounts, coupon, run sales

    const handleShowModal = function(id) {
        setShowModal(true);
        setSelectedId(id);
    }

    const columns = [
        {
            name: 'Title',
            selector: row => <span className='table--info'>
                <h3>{row?.title}</h3>
            </span>,
            width: width > 600 && "25%",
        },
        {
            name: 'Type',
            selector: row => (
                <span className="status status--pending">
                    <p>{row?.deliveryType}</p>
                </span>
            ),
        },
        {
            name: 'Fee',
            selector: row => (
                <p className='value'>₦{formatNumber(row?.fee)}</p>
            ),
        },
        {
            name: 'Date',
            selector: row => (
                <TooltipUI placement='top' title={ymdDateFormat(row?.createdAt)}>
                    <p className='value'>{ymdDateSlashFormat(row?.createdAt)}</p>
                </TooltipUI>
            ),
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => navigate(`${row?._id}/edit`)}><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowModal(row._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        },
    ];

    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh table">
                        <button className='table--btn' onClick={handleFetchUserStoreDeliveryRates}><MdOutlineRefresh /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }


    useEffect(function() {
        document.title = "Quicka | Delivery Rates";

        if(deliveryRates?.length < 1 && error?.delivery) {
            handleFetchUserStoreDeliveryRates();
        }
    }, []);
    

    async function deleteItem() {
        try {
            setDeleteLoader(true)
            await handleDeleteOneItem("delivery-rates", selectedId);
            handleFetchUserStoreDeliveryRates();
            setShowModal(false)
        } catch(err) {
            console.log(err);
        } finally {
            setDeleteLoader(false);
        }
    }

    return (
        <PageUI
            columns={columns}
            data={deliveryRates}
            items={deliveryRates}
            pageName="delivery"
            addBtnStr="Set New Discount"
            emptyText={emptyText}
            emptyImg={emptyImg}
            emptyBtns={emptyBtns}
            emptyTitle={emptyTitle}
            addUrl="delivery-rates/add"
            loader={loader} error={error}
            goto={false}
            insights={false}
            headTabs={<HeadTabs />}

            deleteObj={{ 
                fn: deleteItem,
                title: "delivery rate",
                close: setShowModal,
                show: showModal,
                loader: deleteLoader
            }}
      >
            <div className="page--tabs" style={{ margin: "-1.4rem 0 2rem" }}>
                <Tab active title="Discount" onClick="" />
                <Tab title="Coupon" onClick="" />
                <Tab title="Run Sales" onClick="" />
            </div>

      </PageUI>
    )
}

export default index