import React, { useEffect, useState } from 'react'
import { useLocation, useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import { RiCoupon3Line, RiDeleteBin5Line, RiDiscountPercentLine, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { formatNumber, ymdDateFormat, ymdDateSlashFormat } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import Tab from '../../components/Tab';
import { VscRunCoverage } from 'react-icons/vsc';
import discount_emptyImg from '../../assets/images/illustrations/discount.png';
import coupon_emptyImg from '../../assets/images/illustrations/coupon.png';
import store_sales_emptyImg from '../../assets/images/illustrations/store_sales.png';
import PageUI from '../../ui/PageUI/PageUI';
import { useDataContext } from '../../context/DataContext';
import Insight from '../../components/Insight';


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
const store_sales_emptyTitle = "Run Store Sales";
const store_sales_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const store_sales_emptyBtns = [
    { title: <><VscRunCoverage />Run Store Sales</>, link: "/dashboard/store-sales/run" },
];


function index() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab");
    ///////////////////////////////////////////
    const { showInsights } = useDataContext()
    const { loader, error, discounts, coupons, store_sales, handleDeleteOneItem  } = useFetchedContext();
    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("");
    ///////////////////////////////////////////////////////
    const data = activeTab == "discount" ? discounts : activeTab == "coupon" ? coupons : store_sales; 
    const emptyText = activeTab == "discount" ? discount_emptyText : activeTab == "coupon" ? coupon_emptyText : store_sales_emptyText;
    const emptyTitle = activeTab == "discount" ? discount_emptyTitle : activeTab == "coupon" ? coupon_emptyTitle : store_sales_emptyTitle;
    const emptyBtns = activeTab == "discount" ? discount_emptyBtns : activeTab == "coupon" ? coupon_emptyBtns : store_sales_emptyBtns;
    const addBtnStr = activeTab !== "run-sales" ? "Create " + activeTab : "run new store sales";
    const emptyImg = activeTab == "discount" ? discount_emptyImg : activeTab == "coupon" ? coupon_emptyImg : store_sales_emptyImg;

    const discount_columns = [];

    const coupon_columns = [];

    const store_sales_columns = [];
    
    const column = activeTab == "discount" ? discount_columns : activeTab == "coupon" ? coupon_columns : store_sales_columns; 


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
        document.title = "Quicka | Discounts, Coupons and Run store sales";
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
            addUrl={"/comeback"}
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
                    <Insight loader={loader?.discount} title='Pending Settlement' value={0} icon={""} />
                    <Insight loader={loader?.discount} title='Total Website transaction' value={0} icon={""} />
                    <Insight loader={loader?.discount} title='Total Offline transaction' value={0} icon={""} />
                </div>
            )}

            <div className="page--tabs">
                <Tab title="Discounts" onClick={() => navigate("?tab=discount")} active={activeTab == "discount"} value={discounts?.length > 0 && discounts?.length} />
                <Tab title="Coupons" onClick={() => navigate("?tab=coupon")} active={activeTab == "coupon"} value={coupons?.length > 0 && coupons?.length} />
                <Tab title="Run Sales" onClick={() => navigate("?tab=run-sales")} active={activeTab == "run-sales"} value={store_sales?.length > 0 && store_sales?.length} />
            </div>
      </PageUI>
    )
}

export default index