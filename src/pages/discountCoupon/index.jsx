import React, { useEffect, useState } from 'react'
import PageUI from '../pageUIComponents/PageUI'
import { useLocation, useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import { RiCoupon3Line, RiDeleteBin5Line, RiDiscountPercentLine, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { formatNumber, ymdDateFormat, ymdDateSlashFormat } from '../../utils/helper';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import Tab from '../../components/Tab';
import { VscRunCoverage } from 'react-icons/vsc';
import discount_emptyImg from '../../assets/images/illustrations/discounts.png';
import coupon_emptyImg from '../../assets/images/illustrations/coupon.png';
import store_sales_emptyImg from '../../assets/images/illustrations/store_sales.png';


///////////////////////////////////////////////
const discount_emptyTitle = "Add Discount";
const discount_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const discount_emptyBtns = [
    { title: <><RiDiscountPercentLine />Create Discount</>, link: "/dashboard/discounts/create" },
];
const coupon_emptyTitle = "Add Coupon";
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
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { tab } = useParams();
    const { loader, error, discounts, coupons, store_sales, handleDeleteOneItem  } = useFetchedContext();

    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tabShown, setTabShown] = useState("discount");

    const data = tabShown == "discount" ? discounts : tabShown == "coupon" ? coupons : store_sales; 
    const emptyText = tabShown == "discount" ? discount_emptyText : tabShown == "coupon" ? coupon_emptyText : store_sales_emptyText;
    const emptyTitle = tabShown == "discount" ? discount_emptyTitle : tabShown == "coupon" ? coupon_emptyTitle : store_sales_emptyTitle;
    const emptyBtns = tabShown == "discount" ? discount_emptyBtns : tabShown == "coupon" ? coupon_emptyBtns : store_sales_emptyBtns;
    const addBtnStr = tabShown !== "run store sales" ? "Create " + tabShown : "run new store sales";
    const emptyImg = tabShown == "discount" ? discount_emptyImg : tabShown == "coupon" ? coupon_emptyImg : store_sales_emptyImg;

    const handleShowModal = function(id) {
        setShowModal(true);
        setSelectedId(id);
    }

    const handleTabShown = function (tab) {
        setTabShown(tab);
        if(tab == "run store sales") {
            navigate(`/dashboard/discount-coupon/store-sales`);
        } else {
            navigate(`/dashboard/discount-coupon/${tab}`);
        }
    }


    const discount_columns = [];

    const coupon_columns = [];

    const store_sales_columns = [];

    const column = tabShown == "discount" ? discount_columns : tabShown == "coupon" ? coupon_columns : store_sales_columns; 

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


    // SET THE SHOWN TABS DIRECTLY FROM THE PARAMS ROUTE
    useEffect(function () {
        if(tab) {
            if(tab == "store-sales") {
                setTabShown("run store sales");
            } else {
                setTabShown(tab);
            }
        } else {
            setTabShown("discount")
        }
    }, [tab]);

    console.log(tabShown)


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
            pageName={tabShown}
            addBtnStr={addBtnStr}
            emptyText={emptyText}
            emptyImg={emptyImg}
            emptyBtns={emptyBtns}
            emptyTitle={emptyTitle}
            addUrl="delivery-rates/add"
            loader={loader} error={error}
            goto={false}
            insights={false}
            headTabs={<HeadTabs />}

            // deleteObj={{ 
            //     fn: deleteItem,
            //     title: "",
            //     close: setShowModal,
            //     show: showModal,
            //     loader: deleteLoader
            // }}
      >
            <div className="page--tabs" style={{ margin: "0 0 1rem" }}>
                <Tab title="Discounts" onClick={() => handleTabShown("discount")} active={tabShown == "discount"} value={discounts?.length > 0 && discounts?.length} />
                <Tab title="Coupons" onClick={() => handleTabShown("coupon")} active={tabShown == "coupon"} value={coupons?.length > 0 && coupons?.length} />
                <Tab title="Store Sales" onClick={() => handleTabShown("run store sales")} active={tabShown == "run store sales"} value={store_sales?.length > 0 && store_sales?.length} />
            </div>
      </PageUI>
    )
}

export default index