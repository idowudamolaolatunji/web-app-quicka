import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiPlus } from 'react-icons/bi'
import { formatNumber } from '../../utils/helper';
import { useWindowSize } from 'react-use';
import Insight from '../../components/Insight';
import { LuClipboardList } from 'react-icons/lu';
import { GrTag } from 'react-icons/gr';
import { TbArrowWaveRightDown, TbListSearch } from 'react-icons/tb';
import { useFetchedContext } from '../../context/FetchedContext';
import { useDataContext } from '../../context/DataContext';
import { MdOutlineFilterList, MdOutlineRefresh, MdTableRows } from 'react-icons/md';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { BsFillGrid3X3GapFill, BsFillGridFill, BsTable } from 'react-icons/bs';
import TooltipUI from '../../components/TooltipUI';
import PageUI from '../pageUIComponents/PageUI';
import product_emptyImg from '../../assets/images/illustrations/product.png';
import collection_emptyImg from '../../assets/images/illustrations/collection.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchInput from '../../components/SearchInput';
import { AiOutlinePlus } from 'react-icons/ai';
import Tab from '../../components/Tab';


//////////////////////////////////////////////////////
const BASE_URL = import.meta.env.VITE_BASE_URL

const product_emptyTitle = "Add new product!";
const product_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const product_emptyBtns = [
    { title: <><AiOutlinePlus />Add Product</>, link: "/dashboard/products/upload" },
];

const collection_emptyTitle = "Add new collection!";
const collection_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const collection_emptyBtns = [
    { title: <><AiOutlinePlus />Create Collection</> },
];


function index() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { width } = useWindowSize();
    const { showInsights, activeDisplayTab, handleDisplayTab } = useDataContext();
    const { loader, error, products, collections, handleFetchUserStoreProducts, handleFetchUserStoreCollections, handleDeleteOneItem } = useFetchedContext();

    const route = pathname.split("/").at(-1);
    const productsSold = products?.reduce((acc, product) => acc + product?.soldAmount, 0);
    const outOfStock = products?.filter(product => product?.trackInventory && product?.stockAmount <= 1);
    const totalInventoryWorth = products?.reduce((acc, product) => acc + product?.price, 0);

    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [tabShown, setTabShown] = useState("products");
    ////////////////////////////////////////////////////////

    const handleTabShown = function(tab) {
        setTabShown(tab);
        if(tab == "products") {
            navigate(`/dashboard/${tab}`);
        } else {
            navigate(`/dashboard/products/${tab}`);
        }
    }

    const handleShowModal = function(id) {
        setShowModal(true);
        setSelectedId(id);
    }

    const product_columns = [
        { 
            name: 'Prduct',
            selector: row => (
                <Link className="table--flex table--link" to={`/dashboard/products/${row?.productId}`}>
                    <img alt={row?.name} src={BASE_URL + row?.images?.at(0)} />
                    <span className='table--info'>
                        <h3>{row?.name}</h3>
                        <span>{row?.productCollection}</span>
                    </span>

                </Link>
            ),
            width: width > 600 ? "32%" : "25%"
        },
        { 
            name: 'Price',
            selector: row => (
                <p className='value'>{'₦'+formatNumber(row?.price)}</p>
            ),
            width: width > 600 ? "10%" : ""
        },
        { 
            name: 'Inventory',
            selector: row => (
                <>
                    {row?.trackInventory ? (
                        <span className="flex table--info" style={{ gap: ".4rem", alignItems: "center" }}>
                            <p className='value'>{row?.stockAmount} <span>Stocks</span></p>
                            <span>/</span>
                            <p className='value'>{row?.variations.length} <span>Variations</span></p>
                        </span>
                    ) : (
                        <span className="flex table--info">
                            Inventory not tracked
                        </span>
                    )}
                </>
            ),
            width: width > 600 ? "18%" : ""
        },
        { 
            name: 'Status',
            selector: row => (
                <span className={`status status--${(row?.status)}`}>
                    <p>{row?.status}</p>
                </span>
            ),
        },
        { 
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => navigate(`${row?.productId}/edit`)}><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowModal(row?._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        },
    ];

    const collection_columns = [];

    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh table">
                        <button className='table--btn' onClick={handleFetchUserStoreProducts}><MdOutlineRefresh /></button>
                    </TooltipUI>

                    <SearchInput />
                </span>


                <span className="flex">
                    <button className='table--btn'>Clear filter</button>

                    <TooltipUI placement='top' title="Filters">
                        <button className='table--btn'><MdOutlineFilterList /></button>
                    </TooltipUI>

                    <span className='table--tabs'>
                        <TooltipUI placement='top' title="Table View">
                            <span className={activeDisplayTab == "table" ? "active" : ""} onClick={() => handleDisplayTab("table")}><BsTable /> </span>
                        </TooltipUI>


                        <TooltipUI placement='top' title="Grid View">
                            <span className={activeDisplayTab == "grid" ? "active" : ""} onClick={() => handleDisplayTab("grid")}>{width < 365 ? <MdTableRows /> : width <= 620 ? <BsFillGridFill /> : <BsFillGrid3X3GapFill />} </span>
                        </TooltipUI>
                    </span>
                </span>
            </div>
        );
    }

    useEffect(function() {
        document.title = `Quicka | ${tabShown == "product" ?
             "Your products" : "Product collections"
            }`;
    }, []);


    useEffect(function() {
        if(products?.length < 1 && error?.product) {
            handleFetchUserStoreProducts();
            handleFetchUserStoreCollections();
        }
    }, [])

    useEffect(function() {
        setTabShown(route)
    }, [route]);


    async function deleteItem() {
        try {
            setDeleteLoader(true)
            await handleDeleteOneItem(`${tabShown}s`, selectedId);
            handleFetchUserStoreProducts();
            setShowModal(false)
        } catch(err) {
            console.log(err);
        } finally {
            setDeleteLoader(false);
        }
    }


    return (
        <PageUI
            items={tabShown == "products" ? products : collections}
            data={tabShown == "products" ? products : collections}
            pageName={tabShown == "products" ? "product" : "collection"}
            columns={tabShown == "products" ? product_columns : collection_columns}
            emptyText={tabShown == "products" ? product_emptyText : collection_emptyText}
            emptyBtns={tabShown == "products" ? product_emptyBtns : collection_emptyBtns}
            emptyImg={tabShown == "products" ? product_emptyImg : collection_emptyImg}
            emptyTitle={tabShown == "products" ? product_emptyTitle : collection_emptyTitle}
            {...(tabShown == "products" && { activeDisplayTab })}
            loader={loader} error={error}
            headTabs={tabShown == "products" ? <HeadTabs /> : <></>}
            addBtnStr={tabShown == "products" ? (width < 377 && width > 364) ? "Add product" : "Upload product" : "Add collection"}
            addUrl="products/upload"
            
            // addAction={}


            deleteObj={{ 
                fn: deleteItem,
                title: (tabShown == "products") ? "product" : "collection",
                close: setShowModal,
                show: showModal,
                loader: deleteLoader,
                open: handleShowModal
            }}
        >

            {showInsights?.product && (
                <div className='page__section--insights insight--grid' style={{ marginBottom: '3rem', ...(width > 900 && {width: '85%'}) }}>
                    <Insight loader={loader?.product} title='Total Inventory worth' pre='₦' value={totalInventoryWorth} dec={totalInventoryWorth ? 0 : 2} icon={<LuClipboardList />} />
                    <Insight loader={loader?.product} title='Total Products Sold' value={productsSold} icon={<GrTag />} />
                    <Insight loader={loader?.product} title='Total Collection' value={collections?.length} icon={<TbListSearch />} />
                    <Insight loader={loader?.product} title='Out of stock' value={outOfStock?.length} icon={<TbArrowWaveRightDown />} />
                </div>
            )}


            <div className="page--tabs" style={{ margin: "0 0 1rem" }}>
                <Tab title="Products" onClick={() => handleTabShown("products")} active={tabShown == "products"} />
                <Tab title="Collections" onClick={() => handleTabShown("collections")} active={tabShown == "collections"} />
            </div>
        </PageUI>
    )
}

export default index