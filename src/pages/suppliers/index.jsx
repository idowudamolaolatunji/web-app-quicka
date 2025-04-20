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
import TooltipUI from '../../components/layout/TooltipUI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import { BiNetworkChart } from 'react-icons/bi';
import { GiPayMoney } from 'react-icons/gi';
import { PiNetwork } from 'react-icons/pi';


const emptyTitle = "Add new supplier!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus /> Add Suppliers</>, link: "/dashboard/suppliers/add" },
];


export default function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, suppliers, handleDeleteOneItem } = useFetchedContext();

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
        document.title = "Quicka | Your Suppliers";
    }, []);

    const handleShowDeleteModal = function(id) {
        setShowDeleteModal(true);
        setSelectedId(id);
    }

    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`suppliers/${selectedId}`);
            // function()
            setShowDeleteModal(false)
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageUI
            pageName="supplier"
            items={suppliers}
            columns={columns}
            data={suppliers}
            shouldSelect={true}
            addUrl="suppliers/add"
            addBtnStr="Add supplier"
            emptyText={emptyText}
            emptyBtns={emptyBtns}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            headTabs={<TableHeadTabs pageName="supplier" searchVal={search} setSearchVal={setSearch} handleFetch={""}  />}

            deleteObj={{
                fn: deleteItem,
                title: "supplier",
                close: setShowDeleteModal,
                show: showDeleteModal,
                loader: loading
            }}
        >

            {showInsights?.supplier && (
                <div className='page__section--insights insight--grid'>
                    <Insight title='Total Supplier' loader={loader?.supplier} value={0} icon={<PiNetwork />} />
                    <Insight title='Total Amount Spent' loader={loader?.supplier} value={0} icon={<GiPayMoney />} />
                </div>
            )}
        </PageUI>
    )
}