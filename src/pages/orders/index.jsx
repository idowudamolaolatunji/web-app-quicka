import React, { useEffect, useState } from 'react'
import { cap1stLetter, formatDate, formatNumber, isWithinLast7Days, truncateString } from '../../utils/helper';
import { useWindowSize } from 'react-use';
import Insight from '../../components/layout/Insight';
import { TbNotes, TbNotesOff } from 'react-icons/tb';
import { MdOutlineFilterList, MdOutlineNoteAlt, MdOutlineRefresh, MdOutlineShoppingBag } from 'react-icons/md';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import PageUI from '../../ui/PageUI/PageUI';
import TooltipUI from '../../components/layout/TooltipUI';
import { AiOutlinePlus } from 'react-icons/ai';
import { imgString } from '../../assets/images/png_elements';
import { GoDotFill } from 'react-icons/go';
import emptyImg from '../../assets/images/illustrations/sales.png';
import { useAuthContext } from '../../context/AuthContext';
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import Drawer from '../../components/modal/Drawer';


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
const emptyTitle = "Record a new sale!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Record new sales</>, link: "/dashboard/orders/record" },
];


function index() {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { showInsights, showFilterModal, handleToggleFilter } = useDataContext();
    const { loader, error, orders, handleFetchUserStoreOrders, handleDeleteOneItem } = useFetchedContext()
    const currency = store?.currencies[store?.mainCurrency]?.symbol;
    
    const [search, setSearch] = useState('');
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchResults, setSearchResult] = useState([]);

    const completedOrders = orders?.filter(order => order.orderStatus == "completed");
    const unCompletedOrders = orders?.filter(order => order.orderStatus != "completed");
    const newOrders = orders?.filter(order => order.channel == "online store" && order.orderStatus != "completed" && isWithinLast7Days(order.orderDate));
    

    const columns = [
        {
            name: "Channel", selector: row => (
                <TooltipUI placement="top" title={cap1stLetter(row.channel)}>
                    <img width={"40px"} alt={row.channel} src={imgString(row.channel)} />
                </TooltipUI>
            ), width: "70px"
        },
        {
            name: "Order Id", selector: row => (
                <p className="value">{row.orderId}</p>
            ), width: "100px"
        },
        {
            name: "Custumer", selector: row => row.customer?.name || "-- Not Added --", width: "150px"
        },
        {
            name: "Product(s)", selector: row => (
                <TooltipUI placement="top" title={
                    <ul className="table--list">
                        {row.products?.map((item, index) => (
                            <li key={index}><GoDotFill /> {item?.name}</li>
                        ))}
                    </ul>
                }>
                    <ul className="table--list">
                        {row.products?.slice(0, 3)?.map((item, index) => (
                            <li key={index}><GoDotFill /> {truncateString(item?.name, 18)}</li>
                        ))}
                        {row.products?.length > 3 && <li>...</li>}
                    </ul>
                </TooltipUI>
            ),
            width: "180px"
        },
        {
            name: "Amount", selector: row => (
                <span className="value">{currency}{formatNumber(row?.profit)}</span>
            ), width: "100px"
        },
        {
            name: "Payment", selector: row => (
                <span className={`status status--${( row.paymentStatus != "unpaid" ? "success" : "pending" )}`}>
                    <p>{row.paymentStatus}</p>
                </span>
            ),
            width: "120px"
        },
        {
            name: "Delievery", selector: row => (
                <span className={`status status--${(row.deliveryStatus)}`}>
                    <p>{row.deliveryStatus}</p>
                </span>
            ),
            width: "135px"
        },
        {
            name: "Status", selector: row => (
                <span className={`status status--${(row.orderStatus)}`}>
                    <p>{row.orderStatus}</p>
                </span>
            ),
            width: "120px"
        },
        {
            name: "Date Sold", selector: row => (
                <TooltipUI placement="top" title={formatDate(row.orderDate)}>
                    <p>{formatDate(row.orderDate)}</p>
                </TooltipUI>
            ),
        },
    ];


    useEffect(function () {
        document.title = "Quicka | Your orders";
    }, []);


    useEffect(function() {
        function handleSearch() {
            if(!search) return;
            setSearchLoader(true)

            const searchValue = search?.toLowerCase()
            const searchResult = orders?.filter(data => {
                return (
                    data.products?.some(({ name }) => name?.toLowerCase()?.includes(searchValue)) ||
                    data.status?.includes(searchValue) ||
                    data.channel?.includes(searchValue) ||
                    data.customer?.name?.includes(searchValue)
                );              
            });

            setSearchResult(searchResult)
            setTimeout(() => {
                setSearchLoader(false)
            }, 750);
        }
        
        if(search) {
            handleSearch()
        }
    }, [search])


    return (

        <>
            {(showFilterModal?.name == "order" && showFilterModal.isShown) && (
                <Drawer title={`Order Filters`} setClose={() => handleToggleFilter("")}>
                    
                </Drawer>
            )}

            <PageUI
                pageName="order"
                items={orders}
                data={search ? searchResults : orders}
                columns={columns}
                shouldSelect={true}
                addUrl="orders/record"
                addBtnStr="Record sales"
                emptyText={emptyText}
                emptyBtns={emptyBtns}
                emptyImg={emptyImg}
                emptyTitle={emptyTitle}
                emptyClassName="empty--order"
                headTabs={<TableHeadTabs pageName="order" handleFetch={handleFetchUserStoreOrders} searchVal={search} setSearchVal={setSearch} />}
                loader={loader} error={error}
                searchLoader={searchLoader}
            >

                {showInsights?.order && (
                    <div className='page__section--insights insight--grid' style={ width > 900 ? { width: '90%' } : {}}>
                        <Insight title='Total Orders' loader={loader?.order} value={orders?.length} icon={<MdOutlineShoppingBag />} />
                        <Insight title='New Orders' loader={loader?.order} value={newOrders?.length} icon={<MdOutlineNoteAlt />} />
                        <Insight title='Completed Orders' loader={loader?.order} value={completedOrders?.length} icon={<TbNotes />} />
                        <Insight title='Uncompleted Orders' loader={loader?.order} value={unCompletedOrders?.length} icon={<TbNotesOff />} />
                    </div>
                )}

            </PageUI>
        </>
    )
}

export default index