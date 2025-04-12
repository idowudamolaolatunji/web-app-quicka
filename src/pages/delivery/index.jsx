import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import emptyImg from '../../assets/images/illustrations/delivery.png';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/layout/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { formatDate, formatNumber } from '../../utils/helper';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { GoDotFill } from 'react-icons/go';


///////////////////////////////////////////////
const emptyTitle = "Add Delivery Rates";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Set Delivery Rates</>, link: "/dashboard/delivery-rates/add" },
];

function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    
    const { loader, error, deliveryRates, handleDeleteOneItem, handleFetchMyStoreDeliveryRates } = useFetchedContext();
    const currency = store?.currency?.symbol;

    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = function(id) {
        setShowModal(true);
        setSelectedId(id);
    }

    const columns = [
        {
            name: 'Delivery Title',
            selector: row => <span className='table--info'>
                <h3>{row?.title}</h3>
            </span>,
            width: width > 600 && "25%",
        },
        {
            name: 'Delivery Type',
            selector: row => (
                <span className="status status--pending">
                    <p><GoDotFill />{row?.deliveryType}</p>
                </span>
            ),
        },
        {
            name: 'Delivery Fee',
            selector: row => (
                <p className='value'>{currency}{formatNumber(row?.fee)}</p>
            ),
        },
        {
            name: 'Created Date',
            selector: row => (
                <TooltipUI placement='top' title={formatDate(row?.createdAt)}>
                    <p className='value'>{formatDate(row?.createdAt)}</p>
                </TooltipUI>
            ),
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => navigate(`${row?._id}/edit`)}><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowModal(row?._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        },
    ];

    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Reload delivery rates">
                        <button className='table--btn' onClick={handleFetchMyStoreDeliveryRates}><MdOutlineRefresh /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }


    useEffect(function() {
        document.title = "Quicka | Delivery Rates";
    }, []);
    

    async function deleteItem() {
        try {
            setDeleteLoader(true)
            await handleDeleteOneItem(`delivery-rates/${selectedId}`);
            handleFetchMyStoreDeliveryRates();
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
            shouldSelect={true}
            addBtnStr="Set delivery rates"
            emptyText={emptyText}
            emptyImg={emptyImg}
            emptyBtns={emptyBtns}
            emptyTitle={emptyTitle}
            addUrl="delivery-rates/add"
            loader={loader} error={error}
            hasLink={false}
            insights={false}
            pointOnHover={false}
            headTabs={<HeadTabs />}

            deleteObj={{ 
                fn: deleteItem,
                title: "delivery rate",
                close: setShowModal,
                show: showModal,
                loader: deleteLoader
            }}
        />
    )
}

export default index