import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/layout/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { formatNumber, ymdDateFormat, ymdDateSlashFormat } from '../../utils/helper';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import emptyImg from '../../assets/images/illustrations/expenses.png'


///////////////////////////////////////////////
const emptyTitle = "Record your expenses";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
  { title: <><AiOutlinePlus />Record Expenses</>, link: "/dashboard/expenses/record" },
];

function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    
    const { loader, error, expenses, handleDeleteOneItem, handleFetchMyStorEexpenses } = useFetchedContext();
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
            name: 'Expenses Title',
            selector: row => <span className='table--info'>
                <h3>{row?.title}</h3>
            </span>,
            width: width > 600 && "25%",
        },
        {
            name: "Expense Amount",
            selector: row => (
              <p className='value'>{currency}{formatNumber(row?.fee)}</p>
            ),
        },
        {
            name: 'Addtional description',
            selector: row => (
                <p className='value'>{currency}{formatNumber(row?.fee)}</p>
            ),
        },
        {
            name: 'Created Date',
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
                    <TooltipUI placement='top' title="Reload Expenses">
                        <button className='table--btn' onClick={handleFetchMyStoreDeliveryRates}><MdOutlineRefresh /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }


    useEffect(function() {
        document.title = "Quicka | Expenses";
    }, []);
    

    // async function deleteItem() {
    //     try {
    //         setDeleteLoader(true)
    //         await handleDeleteOneItem("expense", selectedId);
    //         handleFetchMyStoreDeliveryRates();
    //         setShowModal(false)
    //     } catch(err) {
    //         console.log(err);
    //     } finally {
    //         setDeleteLoader(false);
    //     }
    // }

    return (
        <PageUI
            columns={columns}
            data={expenses}
            items={expenses}
            pageName="expense"
            shouldSelect={true}
            addBtnStr="Record Expenses"
            emptyText={emptyText}
            emptyImg={emptyImg}
            emptyBtns={emptyBtns}
            emptyTitle={emptyTitle}
            addUrl="expenses/record"
            headTabs={<HeadTabs />}
            insights={false}
            hasLink={false}
            pointOnHover={false}
            loader={loader} error={error}

            // deleteObj={{ 
            //     fn: deleteItem,
            //     title: "delivery rate",
            //     close: setShowModal,
            //     show: showModal,
            //     loader: deleteLoader
            // }}
        />
    )
}

export default index