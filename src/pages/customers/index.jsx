import React, { useEffect } from 'react'
import PageUI from '../pageUIComponents/PageUI'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/Insight';
import { FiUsers } from 'react-icons/fi';
import emptyImg from '../../assets/images/illustrations/customer.png'
import { TbUserSquare } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { ymdDateFormat } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { MdOutlineFilterList, MdOutlineRefresh } from 'react-icons/md';
import TooltipUI from '../../components/TooltipUI';


const emptyTitle = "Add new customer!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus /> Add new Customer</>, link: "/dashboard/customers/add" },
];


function index() {
    const { width } = useWindowSize();
    const { showInsights } = useDataContext();
    const { loader, error, customers, handleFetchUserStoreCustomers } = useFetchedContext();

    const columns = [
        {
            name: "Customer Name",
            selector: row => `${row?.firstname} ${row?.lastname}`
        },
        {
            name: "Email",
            selector: row => row?.contact?.email,
        },
        {
            name: "Phone Number",
            selector: row => `+${row?.contact?.phone}`
        },
        {
            name: "Location",
            selector: row => `${row?.shippingAddress?.state ? row?.shippingAddress?.state + ", " : ""} ${row?.shippingAddress.country}`
        },
        {
            name: "Date Added",
            selector: row => ymdDateFormat(row.createdAt)
        },
        {
            selector: () => (
                <span className='table--actions'>
                    <button className='table--btn'><RiEdit2Line /></button>
                    <button className='table--btn'><RiDeleteBin5Line /></button>
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
        window.scrollTo(0, 0);

        if (customers?.length < 1 && error?.customer) {
            handleFetchUserStoreCustomers();
        }
    }, []);


    return (
        <PageUI
            pageName="customer"
            items={customers}
            columns={columns}
            data={customers}
            addUrl="customers/add"
            addBtnStr="Add new customer"
            emptyText={emptyText}
            emptyBtns={emptyBtns}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            emptyClassName="empty--product"
            headTabs={<HeadTabs />}
            loader={loader} error={error}
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