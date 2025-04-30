import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/layout/Insight';
import { FiUser } from 'react-icons/fi';
import emptyImg from '../../assets/images/illustrations/customer.png'
import { AiFillInstagram, AiFillTikTok, AiOutlinePlus } from 'react-icons/ai';
import { cap1stLetter, formatDate } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/layout/TooltipUI';
import { Link, useNavigate } from 'react-router-dom';
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import { GiEnvelope, GiPayMoney } from 'react-icons/gi';
import { PiNetwork } from 'react-icons/pi';
import { FaSnapchatSquare } from 'react-icons/fa';


const emptyTitle = "Add new supplier!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus /> Add Suppliers</>, link: "/dashboard/suppliers/add" },
];


export default function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, suppliers, handleDeleteOneItem, handleFetchMyStoreSuppliers } = useFetchedContext();

    ////////////////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [search, setSearch] = useState("");


    const columns = [
        {
            name: "Supplier",
            selector: row => (
                <p style={{ textTransform: "capitalize" }}>{row?.fullname}</p>
            ),
            width: width < 450 ? "180px" : ""
        },
        {
            name: "Phone Number",
            selector: row => (
                <p className='value'>+{row?.contact?.phone}</p>
            ),
        },
        {
            name: "Email",
            selector: row => (
                <span className='table--socials'>{
                    row?.contact?.email ? (
                        <a href={`mailto:${row?.contact?.email}`} target='_blank'><GiEnvelope /> Email</a>
                    ) : 
                    row?.contact?.socials?.instagram ? (
                        <a href={`https://www.instagram/${row?.contact?.socials?.instagram}`} target='_blank'><AiFillInstagram />Instagram</a>
                    ) : 
                    row?.contact?.socials?.tiktok ? (
                        <a href={`https://www.tiktok/${row?.contact?.socials?.tiktok}`} target='_blank'><AiFillTikTok />Tiktok</a>
                    ) : 
                    row?.contact?.socials?.snapchat ? (
                        <a href={`https://www.snapchat/${row?.contact?.socials?.snapchat}`} target='_blank'><FaSnapchatSquare />SnapChat</a>
                    ) : "--"
                }</span>
            ),
        },
        {
            name: "Location",
            selector: row => row?.location || cap1stLetter(row?.contact?.countryCode)
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
            handleFetchMyStoreSuppliers()
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