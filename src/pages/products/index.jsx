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
// import emptyImg from '../../assets/images/resources/orange-woman-with-packages-in-shopping-cart.png';
import emptyImg from '../../assets/images/illustrations/add-product.png';
import { Link } from 'react-router-dom';
import SearchInput from '../../components/SearchInput';
import { AiOutlinePlus } from 'react-icons/ai';


//////////////////////////////////////////////////////
const BASE_URL = import.meta.env.VITE_BASE_URL

const emptyTitle = "Add new product!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Add Product</>, link: "/dashboard/products/upload" },
    // { title: "Import Product", link: "/dashboard/products/import/upload" }
];


function index() {
    const { width } = useWindowSize();
    const { showInsights, activeDisplayTab, handleDisplayTab } = useDataContext();
    const { loader, error, products, collections, handleFetchUserStoreProducts, handleFetchUserStoreCollections, handleDeleteOneItem } = useFetchedContext();

    const productsSold = products?.reduce((acc, product) => acc + product?.soldAmount, 0);
    const outOfStock = products?.filter(product => product?.isSoldout || product?.stockAmount <= 1);
    const totalInventoryWorth = products?.reduce((acc, product) => acc + product?.price, 0);

    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = function(id) {
        setShowModal(true);
        setSelectedId(id);
    }

    const columns = [
        { 
            name: 'Prduct',
            selector: row => (
                <Link className="table--flex table--link" to={`/dashboard/products/${row?.productId}`}>
                    <img alt={row?.name} src={BASE_URL + row?.images[0]} />
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
                    <button className='table--btn'><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowModal(row?._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        },
    ];

    const HeadTabs = function() {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh">
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
        document.title = "Quicka | Orders";

        if(products?.length < 1 && error?.product) {
            handleFetchUserStoreProducts();
            handleFetchUserStoreCollections();
        }
    }, []);


    async function deleteItem() {
        try {
            setDeleteLoader(true)
            await handleDeleteOneItem("products", selectedId);
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
            pageName="product"
            items={products}
            columns={columns}
            data={products}
            addUrl="products/upload"
            addBtnStr={(width < 377 && width > 364) ? "Add product" : "Upload product"}
            emptyText={emptyText}
            emptyBtns={emptyBtns}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            emptyClassName="empty--product"
            headTabs={<HeadTabs />}
            loader={loader} error={error}
            activeDisplayTab={activeDisplayTab}

            deleteObj={{ 
                fn: deleteItem,
                title: "product",
                close: setShowModal,
                open: showModal ,
                loader: deleteLoader
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

        </PageUI>
    )
}

export default index