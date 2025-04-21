import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/layout/Insight';
import { FiUser, FiUsers } from 'react-icons/fi';
import { TbUserSquare } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { formatDate } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { MdOutlineFilterList, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/layout/TooltipUI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import Drawer from '../../components/modal/Drawer';
import Tab from '../../components/elements/Tab';
import { TbUsersGroup } from "react-icons/tb";
import customer_emptyImg from '../../assets/images/illustrations/customer.png'
import group_emptyImg from '../../assets/images/illustrations/group.png'
import newsletter_emptyImg from '../../assets/images/illustrations/newletter.png'



const customer_emptyTitle = "Add new customer!";
const customer_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const customer_emptyBtns = [
    { title: <><AiOutlinePlus /> Add Customer</>, link: "/dashboard/customers/add" },
];

const group_emptyTitle = "Create a customer group!";
const group_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const group_emptyBtns = [
    { title: <><AiOutlinePlus /> Create Customer Group</> },
];

const newsletter_emptyTitle = "Newsletter Customers";
const newsletter_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";



function index() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab")
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, customers, customerGroups, newsletterCustomers, handleDeleteOneItem, handleFetchMyStoreCustomers } = useFetchedContext();

    ////////////////////////////////////////////////////////
    const [tabShown, setTabShown] = useState("customer");
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [search, setSearch] = useState("");
    const [showCustomerGroupForm, setShowCustomerGroupForm] = useState(false);


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
        document.title = `Quicka | ${tabShown == "customer" ? "Your Customers" : tabShown == "group" ? "Customer Group" : "Newsletter Customers"}`;
    }, [tabShown]);

    // SET THE SHOWN TABS DIRECTLY FROM THE PARAMS ROUTE
    useEffect(function () {
        if (tabParams) {
            setTabShown(tabParams)
        } else {
            navigate("?tab=customer")
        }
        setSearch("")
    }, [tabParams]);

    const handleShowDeleteModal = function(id) {
        setShowDeleteModal(true);
        setSelectedId(id);
    }

    const handleShowCustomerGroupForm = function() {
        setShowCustomerGroupForm(!showCustomerGroupForm);
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
        <PageUI
            pageName={tabShown}
            shouldSelect={true}
            items={tabShown == "customer" ? customers : tabShown == "group" ? customerGroups : newsletterCustomers}
            columns={tabShown == "customer" ? columns : tabShown == "group" ? "" : ""}
            data={tabShown == "customer" ? customers : tabShown == "group" ? customerGroups : newsletterCustomers}
            addBtnStr={tabShown == "customer" ? "Add customer" : tabShown == "group" ? "Create Group" : ""}
            emptyText={tabShown == "customer" ? customer_emptyText : tabShown == "group" ? group_emptyText : newsletter_emptyText}
            emptyBtns={tabShown == "customer" ? customer_emptyBtns : tabShown == "group" ? group_emptyBtns : null}
            emptyImg={tabShown == "customer" ? customer_emptyImg : tabShown == "group" ? group_emptyImg : newsletter_emptyImg}
            emptyTitle={tabShown == "customer" ? customer_emptyTitle : tabShown == "group" ? group_emptyTitle : newsletter_emptyTitle}
            hasLink={tabShown == "customer" ? true : false}

            {...(tabShown == "customer" ? { addUrl: "customers/add" } : tabShown == "group" ? { addAction: handleShowCustomerGroupForm, action: showCustomerGroupForm, addUrl: "" } : { addUrl: "" })}
            
            headTabs={tabShown == "customer" ? (
                <TableHeadTabs pageName="customer" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchMyStoreCustomers} />
            ) : ( tabShown == "group") ? (
                <TableHeadTabs pageName="group" searchVal={search} setSearchVal={setSearch} handleFetch={""} />
            ) : (
                <TableHeadTabs pageName="newsletter" handleFetch={""} />
            )}

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
                    <Insight title='Total Customers' loader={loader[tabShown]} value={customers?.length || 0} icon={<FiUsers />} />
                    <Insight title='Newsletter Customers' loader={loader[tabShown]} value={0} icon={<TbUserSquare />} />
                    <Insight title='Total Customer Groups' loader={loader[tabShown]} value={0} icon={<TbUsersGroup />} />
                </div>
            )}

            {/* THE TABS UI */}
            <div className="page--tabs">
                <Tab title="Customers" onClick={() => navigate("?tab=customer")} active={tabShown == "customer"} />
                <Tab title="Customer Groups" onClick={() => navigate("?tab=group")} active={tabShown == "group"} />
                <Tab title="Newsletters" onClick={() => navigate("?tab=newsletter")} active={tabShown == "newsletter"} />
            </div>
        </PageUI>
    )
}

export default index