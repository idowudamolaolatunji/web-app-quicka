import React, { useEffect, useState } from 'react'
import { cap1stLetter, formatNumber, truncateString, ymdDateFormat } from '../../utils/helper';
import { useWindowSize } from 'react-use';
import Insight from '../../components/layout/Insight';
import { LuClipboardList } from 'react-icons/lu';
import { GrTag } from 'react-icons/gr';
import { TbArrowWaveRightDown, TbListSearch } from 'react-icons/tb';
import { useFetchedContext } from '../../context/FetchedContext';
import { useDataContext } from '../../context/DataContext';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import PageUI from '../../ui/PageUI/PageUI';
import product_emptyImg from '../../assets/images/illustrations/product.png';
import collection_emptyImg from '../../assets/images/illustrations/collection.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import Tab from '../../components/elements/Tab';
import CollectionFormSm from '../../components/pageComponents/CollectionFormSm';
import Drawer from '../../components/modal/Drawer';
import { useAuthContext } from '../../context/AuthContext';
import empty_product from "../../assets/images/dummy_items/empty_product.png"
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';
import ProductFilterForm from '../../components/pageComponents/ProductFilterForm';
import FilterElement from '../../components/elements/FilterElement';
import { HiOutlineCollection } from 'react-icons/hi';
import { MdOutlineHistoryToggleOff } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import Info from '../../components/elements/Info';


//////////////////////////////////////////////////////

const product_emptyTitle = "Add new product!";
const product_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const product_emptyBtns = [
    { title: <><AiOutlinePlus />Add Product</>, link: "/dashboard/products/upload" },
];

const collection_emptyTitle = "Add new collection!";
const collection_emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const collection_emptyBtns = [
    { title: <><AiOutlinePlus />Create Collection</>, },
];


function index() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab")
    ///////////////////////////////////////
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { showInsights, activeDisplayTab, showFilterModal, handleToggleFilter } = useDataContext();
    const { loader, error, products, collections, handleFetchMyStoreProducts, handleFetchMyStoreCollections, handleDeleteOneItem } = useFetchedContext();

    const currency = store?.currency?.symbol;
    const productsSold = products?.reduce((acc, product) => acc + product?.soldAmount, 0);
    const outOfStock = products?.filter(product => product?.trackInventory && product?.stockAmount <= 1);
    const totalInventoryWorth = products?.reduce((acc, product) => acc + product?.price, 0);

    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCollectionForm, setShowCollectionForm] = useState(false);
    const [showCollectionEditForm, setShowCollectionEditForm] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(false);
    const [tabShown, setTabShown] = useState("product");
    const [search, setSearch] = useState("");
    ////////////////////////////////////////////////////////

    // THIS HERE IS THR DELETE MODAL
    const handleShowDeleteModal = function (id) {
        setShowDeleteModal(true);
        setSelectedId(id);
    }

    // FUNCTION THAT HELPS HANDLE THE COLLECTION FORM FOR CREATING
    const handleShowCollectionForm = function() {
        setShowCollectionForm(!showCollectionForm);
    }

    // HELP FIND COLLECTION BY ID
    const findCollection = function(id) {
        const collection = collections?.find(el => el?._id == id);
        return collection;
    }

    // HANDLE SHOW COLLECTION EDIT, PASSING IN AN ID AND CHANGE THE ROUTE
    const handleShowCollectionEditForm = function(id) {
        if(id) {
            const collection = findCollection(id)
            setSelectedCollection(collection);
            setShowCollectionEditForm(true);
        } else {
            setSelectedCollection(null);
            setShowCollectionEditForm(false);
        }
    }

    // HELP FIND THE PRODUCTS LENGTH IN COLLECTION BY COLLECTION NAME
    const findProductsInCollection = function(id) {
        return products.filter(product =>
            product.product_collection.some(col => col._id === id)
        ).length || 0;
    }

    const product_columns = [
        {
            name: 'Prduct',
            selector: row => (
                <Link className="table--flex table--link" to={`/dashboard/products/${row?.productId}`}>
                    <img alt={row?.name} src={row?.images?.length > 0 ? row?.images?.at(0)?.url : empty_product} />
                    <span className='table--info'>
                        <h3>{row?.name}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                            {row?.product_collection?.slice(0, width < 600 ? 2 : 3)?.map((collection, i) => (  
                                <span key={i}>{collection?.name}</span>
                            ))}
                        </div>
                    </span>

                </Link>
            ),
            width: width > 600 ? "30rem" : "25rem"
        },
        {
            name: 'Price',
            selector: row => (
                <p className='value'>{currency}{formatNumber(row?.price)}</p>
            ),
            width: width > 600 ? "8rem" : ""
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
        },
        {
            name: 'Status',
            selector: row => (
                <span className={`status status--${(row?.status)}`}>
                    <p><GoDotFill />{row?.status}</p>
                </span>
            ),
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => navigate(`${row?.productId}/edit`)}><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowDeleteModal(row?._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        },
    ];

    const collection_columns = [
        {
            name: 'Collection',
            selector: row => row?.name,
        },
        {
            name: 'Collection Products',
            selector: row => (
                <span className="value">{formatNumber(findProductsInCollection(row?._id) || 0)}</span>
            ),
        },
        {
            name: "Description",
            selector: row => truncateString(row?.description || "--"),
        },
        {
            name: "Date Created",
            selector: row => ymdDateFormat(row?.createdAt),
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => handleShowCollectionEditForm(row?._id)}><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowDeleteModal(row?._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
            width: "15rem"
        }
    ];


    // DISPLAY THE DOCUMENT TITLE
    useEffect(function () {
        document.title = `Quicka | ${tabShown == "product" ?
            "Your products" : "Product collections"}`;
    }, []);


    // SET THE SHOWN TABS DIRECTLY FROM THE PARAMS ROUTE
    useEffect(function () {
        if (tabParams) {
            setTabShown(tabParams)
        } else {
            navigate("?tab=product")
        }
        setSearch("")
    }, [tabParams]);


    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setDeleteLoader(true)
            await handleDeleteOneItem(`${tabShown}s`, selectedId);
            if (tabShown == "product") {
                handleFetchMyStoreProducts();
            } else {
                handleFetchMyStoreCollections()
            }
            setShowDeleteModal(false)
        } catch (err) {
            console.log(err);
        } finally {
            setDeleteLoader(false);
        }
    }


    return (
        <>
            {/* EDIT MODAL FOR THE COLLECTION EDIT */}
            {(showCollectionEditForm && selectedCollection) && (
                <Drawer title="Edit Collection" setClose={handleShowCollectionEditForm}>
                    <CollectionFormSm close={handleShowCollectionEditForm} editingItem={selectedCollection} />
                </Drawer>
            )}

            {(showFilterModal?.name == tabShown && showFilterModal.isShown) && (
                <Drawer title={`${cap1stLetter(tabShown)} Filters`} setClose={() => handleToggleFilter("")}>
                    <div className="filter--tabs">
                        <FilterElement data="Start" />
                        <FilterElement data="Start" />
                    </div>
                    <ProductFilterForm />
                </Drawer>
            )}

            <PageUI
                /* THIS HERE WAS NEEDED FOR, FOR THE REUSABILITY FOR BOTH THE PRODUCT AND THE COLLECTION..*/
                pageName={tabShown}
                items={tabShown == "product" ? products : collections}
                data={tabShown == "product" ? products : collections}
                columns={tabShown == "product" ? product_columns : collection_columns}
                emptyText={tabShown == "product" ? product_emptyText : collection_emptyText}
                emptyBtns={tabShown == "product" ? product_emptyBtns : collection_emptyBtns}
                emptyImg={tabShown == "product" ? product_emptyImg : collection_emptyImg}
                emptyTitle={tabShown == "product" ? product_emptyTitle : collection_emptyTitle}
                headTabs={tabShown == "product" ? (
                    <TableHeadTabs pageName="product" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchMyStoreProducts} />
                ) : (
                    <TableHeadTabs pageName="collection" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchMyStoreCollections} />
                )}
                addBtnStr={tabShown == "product" ? (width < 377 && width > 364) ? "Add product" : "Upload product" : "Add collection"}
                loader={loader} error={error}
                {...(tabShown == "product" && { activeDisplayTab })}

                // THIS PART HERE IS FOR THE PRODUCT COLLECTION SORT OF MODAL
                {...(tabShown == "product" ? { addUrl: "products/upload" } : { addAction: handleShowCollectionForm, action: showCollectionForm })}
                hasLink={tabShown == "product" ? true : false}
                shouldSelect={true}

                // THIS IS A RESUABLE DELECTING OBJECT (FOR BOTH THE PRODUCT AND COLLECTION)
                deleteObj={{
                    fn: deleteItem,
                    title: tabShown,
                    close: setShowDeleteModal,
                    show: showDeleteModal,
                    loader: deleteLoader,
                    open: handleShowDeleteModal
                }}
            >

                {/* THE INSIGHTS UI */}
                {showInsights?.product && (
                    <div className='page__section--insights insight--grid' style={ width > 900 ? { width: '90%' } : {}}>
                        <Insight loader={loader[tabShown]} title='Total Inventory worth' pre={currency} value={totalInventoryWorth} dec={totalInventoryWorth ? 0 : 2} icon={<LuClipboardList />} />
                        <Insight loader={loader[tabShown]} title='Total Products Sold' value={productsSold} icon={<GrTag />} />
                        <Insight loader={loader[tabShown]} title='Total Collection' value={collections?.length} icon={<HiOutlineCollection />} />
                        <Insight loader={loader[tabShown]} title='Out of stock' value={outOfStock?.length} icon={<MdOutlineHistoryToggleOff />} />
                    </div>
                )}

                {/* THE TABS UI */}
                <div className="page--tabs">
                    <Tab title="Products" onClick={() => navigate("?tab=product")} active={tabShown == "product"} />
                    <Tab title="Collections" onClick={() => navigate("?tab=collection")} active={tabShown == "collection"} />
                </div>

                {/*  */}
                <div className="top--bar info" style={{ margin: "2rem 0" }}>
                    <Info text="Products would be counted out of stock when it's has less than items 2 in stock" />
                </div>
            </PageUI>
        </>
    )
}

export default index