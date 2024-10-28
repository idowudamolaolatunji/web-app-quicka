import React, { useEffect, useState } from 'react'
import PageUI from '../pageUIComponents/PageUI'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/Insight';
import { FiUser, FiUsers } from 'react-icons/fi';
import emptyImg from '../../assets/images/illustrations/customer.png'
import { TbUserSquare } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { ymdDateFormat, ymdDateSlashFormat, ymdDateSlashTimeFormat } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { MdOutlineFilterList, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/TooltipUI';


const emptyTitle = "Add new customer!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus /> Add Customer</>, link: "/dashboard/customers/add" },
];


function index() {
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, error, customers, handleDeleteOneItem, handleFetchUserStoreCustomers } = useFetchedContext();

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
            name: "Customer Name",
            selector: row => (
                <span className="grid grid-2-4rem-1fr">
                    <span className='table-customer'><FiUser /></span>
                    <p>{`${row?.firstname} ${row?.lastname}`}</p>
                </span>
            ),
            width: width < 450 ? "180px" : ""
        },
        {
            name: "Email",
            selector: row => row?.contact?.email,
        },
        {
            name: "Phone Number",
            selector: row => (
                <p className='value'>+{row?.contact?.phone}</p>
            ),
        },
        {
            name: "Location",
            selector: row => `${row?.shippingAddress?.state ? row?.shippingAddress?.state + ", " : ""} ${row?.shippingAddress.country}`
        },
        {
            name: "Date Added",
            selector: row => (
                <TooltipUI placement='top' title={ymdDateSlashTimeFormat(row.createdAt)}>
                    <p className='value'>{ymdDateSlashFormat(row.createdAt)}</p>
                </TooltipUI>
            )
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn'><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowModal(row._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        }
    ];


    const HeadTabs = function () {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh">
                        <button className='table--btn' onClick={handleFetchUserStoreCustomers}><MdOutlineRefresh /></button>
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
        document.title = "Quicka | Customers";

        if (customers?.length < 1 && error?.customer) {
            handleFetchUserStoreCustomers();
        }
    }, []);


    async function deleteItem() {
        try {
            setDeleteLoader(true)
            await handleDeleteOneItem("customers", selectedId);
            handleFetchUserStoreCustomers();
            setShowModal(false)
        } catch(err) {
            console.log(err);
        } finally {
            setDeleteLoader(false);
        }
    }


    return (
        <PageUI
            pageName="customer"
            items={customers}
            columns={columns}
            data={customers}
            addUrl="customers/add"
            addBtnStr="Add customer"
            emptyText={emptyText}
            emptyBtns={emptyBtns}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            emptyClassName="empty--product"
            headTabs={<HeadTabs />}
            loader={loader} error={error}

            deleteObj={{ 
                fn: deleteItem,
                title: "customer",
                close: setShowModal,
                open: showModal,
                loader: deleteLoader
            }}
        >

            {showInsights?.customer && (
                <div className='page__section--insights insight--grid' style={{ marginBottom: '3rem', ...(width > 900 && { width: '90%' }) }}>
                    <Insight title='Total Customers' loader={loader?.customer} value={customers?.length || 0} icon={<FiUsers />} />
                    <Insight title='Newsletter Customers' loader={loader?.customer} value={0} icon={<TbUserSquare />} />
                </div>
            )}
        </PageUI>
    )
}

export default index