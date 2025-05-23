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
import { IoArrowRedo, IoArrowRedoOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Info from '../../components/elements/Info';


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
    const { loader, orders, handleFetchMyStoreOrders } = useFetchedContext()
    const { showInsights, showFilterModal, handleToggleFilter } = useDataContext();
    const currency = store?.currency?.symbol;
    
    const [search, setSearch] = useState('');
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchResults, setSearchResult] = useState([]);

    const completedOrders = orders?.filter(order => order.orderStatus == "completed");
    const unCompletedOrders = orders?.filter(order => order.orderStatus != "completed");
    const newOrders = orders?.filter(order => order.channel == "online store" && order.orderStatus != "completed" && isWithinLast7Days(order.orderDate));
    

    const columns = [
        {
            name: "Channel", selector: row => (
                <TooltipUI placement="top" title={cap1stLetter(row?.channel)}>
                    <img width={width > 450 ? "32px" : "24px"} alt={row?.channel} src={imgString(row?.channel)} />
                </TooltipUI>
            ), width: "70px"
        },
        {
            name: "Order Id", selector: row => (
                <Link to={row?._id} className="value">{row?.orderId}</Link>
            ), width: "100px"
        },
        {
            name: "Custumer", selector: row => row?.customer?.fullname || "-- Not Added --", width: "150px"
        },
        {
            name: "Product(s)", selector: row => (
                <TooltipUI placement="top" title={
                    <ul className="table--list">
                        {row?.products?.map((item, index) => (
                            <li key={index}><IoArrowRedoOutline /> {item?.name}</li>
                        ))}
                    </ul>
                }>
                    <ul className="table--list">
                        {row?.products?.slice(0, 3)?.map((item, index) => (
                            <li key={index}>
                                {width > 600 ? (
                                    <Link to={item?.productId || "/"}><IoArrowRedo /></Link>
                                ) : (
                                    <IoArrowRedoOutline />
                                )}
                                {truncateString(item?.name, 18)}
                            </li>
                        ))}
                        {row?.products?.length > 3 && <li>...</li>}
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
                <span className={`status status--${row?.paymentStatus}`}>
                    <p><GoDotFill />{row?.paymentStatus}</p>
                </span>
            ),
            width: "120px"
        },
        {
            name: "Delievery", selector: row => (
                <span className={`status status--${row?.deliveryStatus}`}>
                    <p><GoDotFill />{row?.deliveryStatus}</p>
                </span>
            ),
            width: "135px"
        },
        {
            name: "Status", selector: row => (
                <span className={`status status--${row?.orderStatus}`}>
                    <p><GoDotFill />{row?.orderStatus}</p>
                </span>
            ),
            width: "120px"
        },
        {
            name: "Date Sold", selector: row => (
                <TooltipUI placement="top" title={formatDate(row?.orderDate)}>
                    <p>{formatDate(row?.orderDate)}</p>
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
        <React.Fragment>
            {(showFilterModal?.name == "order" && showFilterModal.isShown) && (
                <Drawer title={`Order Filters`} setClose={() => handleToggleFilter("")}>
                    
                </Drawer>
            )}

            <PageUI
                pageName="order"
                items={orders}
                data={search ? searchResults : orders}
                columns={columns}
                shouldSelect={false}
                addUrl="orders/record"
                addBtnStr="Record orders"
                emptyText={emptyText}
                emptyBtns={emptyBtns}
                emptyImg={emptyImg}
                emptyTitle={emptyTitle}
                emptyClassName="empty--order"
                headTabs={<TableHeadTabs pageName="order" handleFetch={handleFetchMyStoreOrders} searchVal={search} setSearchVal={setSearch} />}
                searchLoader={searchLoader}
            >

                {showInsights?.order && (
                    <div className='page__section--insights insight--grid' style={ width > 900 ? { width: '90%' } : {}}>
                        <Insight title='Total Orders' loader={loader?.order} value={orders?.length || 0} icon={<MdOutlineShoppingBag />} />
                        <Insight title='New Orders' loader={loader?.order} value={newOrders?.length || 0} icon={<MdOutlineNoteAlt />} />
                        <Insight title='Completed Orders' loader={loader?.order} value={completedOrders?.length || 0} icon={<TbNotes />} />
                        <Insight title='Uncompleted Orders' loader={loader?.order} value={unCompletedOrders?.length || 0} icon={<TbNotesOff />} />
                    </div>
                )}

                {orders?.length > 0 && (
                    <div className="top--bar info" style={{ margin: "2rem 0" }}>
                        <Info text="Recieve orders from your online store and record order from any offline channel" />
                    </div>
                )}
            </PageUI>
        </React.Fragment>
    )
}

export default index