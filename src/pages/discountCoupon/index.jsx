import React, { useEffect, useState } from 'react'
import { useLocation, useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import { RiCoupon3Line, RiCouponLine, RiDeleteBin5Line, RiDiscountPercentLine, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { formatNumber, ymdDateFormat, ymdDateSlashFormat } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import Tab from '../../components/Tab';
import { VscRunCoverage } from 'react-icons/vsc';
import discount_emptyImg from '../../assets/images/illustrations/discount.png';
import coupon_emptyImg from '../../assets/images/illustrations/coupon.png';
import special_sales_emptyImg from '../../assets/images/illustrations/special_sales.png';
import PageUI from '../../ui/PageUI/PageUI';
import { useDataContext } from '../../context/DataContext';
import Insight from '../../components/Insight';
import { LuPartyPopper } from 'react-icons/lu';
import { TbBasketDiscount } from 'react-icons/tb';


///////////////////////////////////////////////
const discount_emptyTitle = "Add Discount";
const discount_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const discount_emptyBtns = [
    { title: <><RiDiscountPercentLine />Add Discount</>, link: "/dashboard/discounts/create" },
];
const coupon_emptyTitle = "Create Coupon Code";
const coupon_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const coupon_emptyBtns = [
    { title: <><RiCoupon3Line />Create Coupon</>, link: "/dashboard/coupons/create" },
];
const special_sales_emptyTitle = "Run Store Sales";
const special_sales_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const special_sales_emptyBtns = [
    { title: <><VscRunCoverage />Run Store Sales</>, link: "/dashboard/store-sales/run" },
];


function index() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab");
    ///////////////////////////////////////////
    const { showInsights } = useDataContext()
    const { loader, error, discounts, coupons, special_sales, handleDeleteOneItem  } = useFetchedContext();
    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("discount");
    ///////////////////////////////////////////////////////
    const data = activeTab == "discount" ? discounts : activeTab == "coupon" ? coupons : special_sales; 
    const emptyText = activeTab == "discount" ? discount_emptyText : activeTab == "coupon" ? coupon_emptyText : special_sales_emptyText;
    const emptyTitle = activeTab == "discount" ? discount_emptyTitle : activeTab == "coupon" ? coupon_emptyTitle : special_sales_emptyTitle;
    const emptyBtns = activeTab == "discount" ? discount_emptyBtns : activeTab == "coupon" ? coupon_emptyBtns : special_sales_emptyBtns;
    const addBtnStr = activeTab !== "special_sales" ? "Create " + activeTab : "run special sales";
    const emptyImg = activeTab == "discount" ? discount_emptyImg : activeTab == "coupon" ? coupon_emptyImg : special_sales_emptyImg;

    const discount_columns = [];

    const coupon_columns = [];

    const special_sales_columns = [];
    
    const column = activeTab == "discount" ? discount_columns : activeTab == "coupon" ? coupon_columns : special_sales_columns; 


    const handleShowModal = function(id) {
        setShowModal(true);
        setSelectedId(id);
    }


    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh table">
                        <button className='table--btn' onClick={() => {}}><MdOutlineRefresh /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }


    useEffect(function() {
        document.title = "Quicka | Discounts, Coupons and Run special sales";
    }, []);

    
    useEffect(function () {
        if (tabParams) {
            setActiveTab(tabParams)
        } else {
            navigate("?tab=discount")
        }
    }, [tabParams]);



    // async function deleteItem() {
    //     try {
    //         setDeleteLoader(true)
    //         await handleDeleteOneItem("delivery-rates", selectedId);
    //         handleFetchUserStoreDeliveryRates();
    //         setShowModal(false)
    //     } catch(err) {
    //         console.log(err);
    //     } finally {
    //         setDeleteLoader(false);
    //     }
    // }

    return (
        <PageUI
            columns={column}
            data={data}
            items={data}
            pageName={activeTab}
            addBtnStr={addBtnStr}
            emptyText={emptyText}
            emptyImg={emptyImg}
            emptyBtns={emptyBtns}
            emptyTitle={emptyTitle}
            addUrl={"/"} // Comeback here...
            loader={loader} error={error}
            hasLink={false}
            headTabs={<HeadTabs />}

            // deleteObj={{ 
            //     fn: deleteItem,
            //     title: "",
            //     close: setShowModal,
            //     show: showModal,
            //     loader: deleteLoader
            // }}
        >

            {showInsights?.discount && (
                <div className='page__section--insights insight--grid'>
                    <Insight loader={loader[activeTab]} title='Total Discounts' value={0} icon={<TbBasketDiscount />} />
                    <Insight loader={loader[activeTab]} title='Active Coupons' value={0} icon={<RiCouponLine />} />
                    <Insight loader={loader[activeTab]} title='Running Special Sales' value={0} icon={<LuPartyPopper />} />
                </div>
            )}

            <div className="page--tabs">
                <Tab title="Discounts" onClick={() => navigate("?tab=discount")} active={activeTab == "discount"} value={discounts?.length > 0 && discounts?.length} />
                <Tab title="Coupons" onClick={() => navigate("?tab=coupon")} active={activeTab == "coupon"} value={coupons?.length > 0 && coupons?.length} />
                <Tab title="Special Sales" onClick={() => navigate("?tab=special_sales")} active={activeTab == "special_sales"} value={special_sales?.length > 0 && special_sales?.length} />
            </div>
      </PageUI>
    )
}

export default index