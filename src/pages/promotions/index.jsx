import React, { useEffect, useState } from 'react'
import { useLocation, useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import { RiCoupon3Line, RiCouponLine, RiDeleteBin5Line, RiDiscountPercentLine, RiEdit2Line } from 'react-icons/ri';
import TooltipUI from '../../components/layout/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { calRemainingDays, cap1stLetter, dateTimeFormat, formatNumber, ymdDateFormat, ymdDateSlashFormat } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import Tab from '../../components/elements/Tab';
import { VscRunCoverage } from 'react-icons/vsc';
import discount_emptyImg from '../../assets/images/illustrations/discount.png';
import coupon_emptyImg from '../../assets/images/illustrations/coupon.png';
import special_sales_emptyImg from '../../assets/images/illustrations/special_sales.png';
import PageUI from '../../ui/PageUI/PageUI';
import { useDataContext } from '../../context/DataContext';
import Insight from '../../components/layout/Insight';
import { LuPartyPopper } from 'react-icons/lu';
import { TbBasketDiscount } from 'react-icons/tb';
import { GoDotFill } from 'react-icons/go';



///////////////////////////////////////////////
const discount_emptyTitle = "Add Discount";
const discount_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const discount_emptyBtns = [
    { title: <><RiDiscountPercentLine />Add Discount</>, link: "/dashboard/promotions/discounts/create" },
];
const coupon_emptyTitle = "Create Coupon Code";
const coupon_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const coupon_emptyBtns = [
    { title: <><RiCoupon3Line />Create Coupon</>, link: "/dashboard/promotions/coupon/create" },
];
const special_sales_emptyTitle = "Run Store Sales";
const special_sales_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const special_sales_emptyBtns = [
    { title: <><VscRunCoverage />Run Store Sales</>, link: "/dashboard/promotions/special-sales/run" },
];

// const dataTest = [
//     {
//         _id: "342593780f797d9ec2115cbd",
//         store: "6794dfc7a535c14711135078",
//         title: "10% Discount",
//         startDate: "2025-01-29T01:44:24.808Z",
//         endDate: "2025-02-27T01:44:24.812Z",
//         status: "active",
//         couponType: "percentage",
//         couponGroup: "all",
//         couponItems: null,
//         couponValue: 10,
//         couponValueInFigure: "10%",
//         couponValidity: "60days",
//         couponCode: "394EIDJS"
//     },
//     {
//         _id: "679593780f797d9ec2115cbd",
//         store: "6794dfc7a535c14711135078",
//         title: "New Product Discount",
//         couponType: "fixed-price",
//         couponGroup: "bundle",
//         couponItems: ["494989839id9dif93i9", "8838473e387e387e83"],
//         couponValue: 10000,
//         status: "inactive",
//         couponValueInFigure: "₦33,433",
//         startDate: "2025-01-26T01:44:24.808Z",        
//         endDate: "2025-03-27T01:44:24.812Z",
//         couponValidity: "60days",
//         couponCode: "JDN833E3"
//     }
// ]

// const dataTestD = [
//     {
//         _id: "342593780f797d9ec2115cbd",
//         store: "6794dfc7a535c14711135078",
//         title: "10% Discount",
//         startDate: "2025-01-29T01:44:24.808Z",
//         endDate: "2025-02-27T01:44:24.812Z",
//         status: "active",
//         discountType: "percentage",
//         items: ["494989839id9dif93i9", "8838473e387e387e83"],
//         discountValue: 10,
//         discountValueInFigure: "10%",
//         discountValidity: "60days" 
//     },
//     {
//         _id: "679593780f797d9ec2115cbd",
//         store: "6794dfc7a535c14711135078",
//         title: "New Product Discount",
//         discountType: "fixed-price",
//         items: ["8838473e387e387e83"],
//         discountValue: 10000,
//         status: "inactive",
//         discountValueInFigure: "₦33,433",
//         startDate: "2025-01-26T01:44:24.808Z",        
//         endDate: "2025-03-27T01:44:24.812Z",
//         discountValidity: "60days" 
//     }
// ]

function index() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab");
    ///////////////////////////////////////////
    const { showInsights } = useDataContext()
    const {
        loader, error, discounts, coupons, special_sales, handleDeleteOneItem, handleFetchMyStoreDiscounts
    } = useFetchedContext();
    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("discount");
    ///////////////////////////////////////////////////////
    const data = activeTab == "discount" ? discounts : activeTab == "coupon" ? coupons : special_sales; 
    const activeCoupons = coupons?.filter(coupon => coupon?.status === "active")?.length 

    const handleShowModal = function(id) {
        setShowModal(true);
        setSelectedId(id);
    }

    const discount_columns = [
        {
            name: "Discount Title",
            selector: (row) => row?.title,
            minWidth: "16rem"
        },
        {
            name: "Discount Type",
            selector: (row) => row?.discountType == "fixed-price" ? "Fixed Price" : "Percentage",
            minWidth: "12rem"
        },
        {
            name: "Applies To",
            selector: (row) => (
                <p>{row?.items?.length} products</p>
            ),
        },
        {
            name: "Discount value",
            selector: (row) => (
                <p className='value'>- {row?.discountValueInFigure}</p>
            )
        },
        {
            name: "Status",
            selector: row => (
                <span className={`status status--${(row?.status)}`}>
                    <p><GoDotFill />{row?.status}</p>
                </span>
            ),
            width: "120px"
        },
        {
            name: "Validity",
            selector: (row) => (
                <TooltipUI placement="top" title={`From ${dateTimeFormat(row?.startDate)} to ${dateTimeFormat(row?.endDate)}`}>
                    <p>{row?.discountValidity}</p>
                </TooltipUI>
            ),
        },
        {
            selector: (row) => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => handleShowModal(row._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
            width: "10rem"
        },
    ];

    const coupon_columns = [
        {
            name: "Coupon Title",
            selector: (row) => row?.title,
            minWidth: "16rem"
        },
        {
            name: "Coupon Type",
            selector: (row) => row?.couponType == "fixed-price" ? "Fixed Price" : "Percentage",
            minWidth: "12rem"
        },
        {
            name: "Code",
            selector: (row) => (
                <TooltipUI placement="top" title={`Expires in ${
                    calRemainingDays(row?.startDate, row?.endDate)
                } days`}>
                    <p className='value'>{row?.couponCode}</p>
                </TooltipUI>
            ),
        },
        {
            name: "Applies To",
            selector: (row) => row?.couponGroup == "all" ? "All products" : row?.couponGroup == "bundle" ? `${row?.couponItems?.length} products` : row?.couponGroup == "single" ? "Single product" : `${row?.couponItems?.length} collection${row?.couponItems?.length == 1 ? "s" : ""}`,
        },
        {
            name: "Value",
            selector: (row) => (
                <p className='value'>- {row?.couponValueInFigure}</p>
            )
        },
        {
            name: "Status",
            selector: (row) => (
                <span className={`status status--${(row?.status)}`}>
                    <p><GoDotFill />{row?.status}</p>
                </span>
            ),
            width: "12rem"
        },
        {
            name: "Validity",
            selector: (row) => (
                <TooltipUI placement="top" title={`From ${dateTimeFormat(row?.startDate)} to ${dateTimeFormat(row?.endDate)}`}>
                    <p>{row?.couponValidity}</p>
                </TooltipUI>
            ),
        },
        {
            selector: (row) => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => handleShowModal(row._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
            width: "10rem"
        }
    ];

    const special_sales_columns = [];
    
    const columns = activeTab == "discount" ? discount_columns : activeTab == "coupon" ? coupon_columns : special_sales_columns; 


    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh table">
                        <button className='table--btn' onClick={() => handleFetchMyStoreDiscounts()}><MdOutlineRefresh /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }

    useEffect(function() {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(function () {
        if (tabParams) {
            setActiveTab(tabParams)
        } else {
            navigate("?tab=discount")
        }
    }, [tabParams]);


    useEffect(function() {
        document.title = `Quicka | ${activeTab == "special_sales" 
            ? "Run special sales" 
            : cap1stLetter(activeTab)}s`;
    }, [activeTab]);


    // THE DELETE FUNCTION..
    async function deleteItem() {
        const urlparams = activeTab == "discount" 
            ? "discounts" : activeTab == "coupon" ? "discounts/coupons" 
            : ""
        ;

        try {
            setDeleteLoader(true)
            await handleDeleteOneItem(urlparams, selectedId);
            if(activeTab == "discount") handleFetchMyStoreDiscounts()
            setShowModal(false)
        } catch(err) {
            console.log(err);
        } finally {
            setDeleteLoader(false);
        }
    }

    return (
        <PageUI
            columns={columns}
            data={data}
            items={data}
            pageName={activeTab}
            addBtnStr={activeTab !== "special_sales" ? "Create " + activeTab : "run special sales"}
            emptyText={activeTab == "discount" ? discount_emptyText : activeTab == "coupon" ? coupon_emptyText : special_sales_emptyText}
            emptyImg={activeTab == "discount" ? discount_emptyImg : activeTab == "coupon" ? coupon_emptyImg : special_sales_emptyImg}
            emptyBtns={activeTab == "discount" ? discount_emptyBtns : activeTab == "coupon" ? coupon_emptyBtns : special_sales_emptyBtns}
            emptyTitle={activeTab == "discount" ? discount_emptyTitle : activeTab == "coupon" ? coupon_emptyTitle : special_sales_emptyTitle}
            addUrl={activeTab == "discount" ? "discounts/create" : activeTab == "coupon" ? "discounts/coupon/create" : "discounts/special-sales/run"}
            loader={loader} error={error}
            hasLink={false}
            headTabs={<HeadTabs />}
            shouldSelect={true}

            deleteObj={{ 
                fn: deleteItem,
                title: "",
                close: setShowModal,
                show: showModal,
                loader: deleteLoader
            }}
        >

            {showInsights?.discount && (
                <div className='page__section--insights insight--grid'>
                    <Insight loader={loader[activeTab]} title='Total Discounts' value={discounts?.length} icon={<TbBasketDiscount />} />
                    <Insight loader={loader[activeTab]} title='Active Coupons' value={activeCoupons || 0} icon={<RiCouponLine />} />
                    <Insight loader={loader[activeTab]} title='Running Special Sales' value={0} icon={<LuPartyPopper />} />
                </div>
            )}

            <div className="page--tabs">
                <Tab title="Discounts" onClick={() => navigate("?tab=discount")} active={activeTab == "discount"} />
                <Tab title="Coupons" onClick={() => navigate("?tab=coupon")} active={activeTab == "coupon"} />
                <Tab title="Special Sales" onClick={() => navigate("?tab=special_sales")} active={activeTab == "special_sales"} />
            </div>
      </PageUI>
    )
}

export default index