import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/layout/Insight';
import { FiUser, FiUsers } from 'react-icons/fi';
import emptyImg from '../../assets/images/illustrations/customer.png'
import { TbUserSquare } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { formatDate } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { MdOutlineFilterList, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/layout/TooltipUI';
import { Link, useNavigate } from 'react-router-dom';
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import Drawer from '../../components/modal/Drawer';


const emptyTitle = "Add new customer!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus /> Add Customer</>, link: "/dashboard/customers/add" },
];


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, customers, handleDeleteOneItem, handleFetchMyStoreCustomers } = useFetchedContext();

    ////////////////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [search, setSearch] = useState("");


    const columns = [
        {
            name: "Customer Name",
            selector: row => (
                <Link className="grid grid-2-4rem-1fr" to={`${row?._id}`}>
                    <span className='table-customer'>
                        {row?.image?.url ? (
                            <img src={row?.image?.url} />
                        ) : (
                            <FiUser />
                        )}
                    </span>
                    <p>{row?.fullname}</p>
                </Link>
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
            selector: row => `${row?.shippingAddress?.state?.name ? row?.shippingAddress?.state?.name + ", " : ""} ${row?.shippingAddress?.country?.name}`
        },
        {
            name: "Date Added",
            selector: row => (
                <TooltipUI placement='top' title={formatDate(row?.createdAt)}>
                    <p className='value'>{formatDate(row?.createdAt)}</p>
                </TooltipUI>
            )
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => navigate(`${row?._id}/edit`)}><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowDeleteModal(row?._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        }
    ];

    useEffect(function () {
        document.title = "Quicka | Your Customers";
    }, []);

    const handleShowDeleteModal = function(id) {
        setShowDeleteModal(true);
        setSelectedId(id);
    }

    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`customers/${selectedId}`);
            handleFetchMyStoreCustomers();
            setShowDeleteModal(false)
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            {/* {(showFilterModal?.name == "customer" && showFilterModal.isShown) && (
                <Drawer title={`Customer Filters`} setClose={() => handleToggleFilter("")}>
                    
                </Drawer>
            )} */}

            <PageUI
                pageName="customer"
                items={customers}
                columns={columns}
                data={customers}
                shouldSelect={true}
                addUrl="customers/add"
                addBtnStr="Add customer"
                emptyText={emptyText}
                emptyBtns={emptyBtns}
                emptyImg={emptyImg}
                emptyTitle={emptyTitle}
                headTabs={<TableHeadTabs pageName="customer" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchMyStoreCustomers}  />}

                deleteObj={{ 
                    fn: deleteItem,
                    title: "customer",
                    close: setShowDeleteModal,
                    show: showDeleteModal,
                    loader: loading
                }}
            >

                {showInsights?.customer && (
                    <div className='page__section--insights insight--grid'>
                        <Insight title='Total Customers' loader={loader?.customer} value={customers?.length || 0} icon={<FiUsers />} />
                        <Insight title='Newsletter Customers' loader={loader?.customer} value={0} icon={<TbUserSquare />} />
                    </div>
                )}
            </PageUI>
        </>
    )
}

export default index