import React, { useEffect, useState } from 'react'
import { formatNumber, truncateString, ymdDateFormat } from '../../utils/helper';
import { useWindowSize } from 'react-use';
import Insight from '../../components/Insight';
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
import Tab from '../../components/Tab';
import CollectionFormSm from '../../components/pageComponents/CollectionFormSm';
import Drawer from '../../components/modal/Drawer';
import { useAuthContext } from '../../context/AuthContext';
import empty_product from "../../assets/images/dummy_items/empty_product.png"
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';


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
    { title: <><AiOutlinePlus />Create Collection</>, },
];


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { pathname } = useLocation();
    const { store } = useAuthContext();
    const { showInsights, activeDisplayTab } = useDataContext();
    const { loader, error, products, collections, handleFetchUserStoreProducts, handleFetchUserStoreCollections, handleDeleteOneItem } = useFetchedContext();

    const { currencies, mainCurrency } = store;
    const currency = currencies[mainCurrency]?.symbol;
    const route = pathname.split("/").at(-1);
    const productsSold = products?.reduce((acc, product) => acc + product?.soldAmount, 0);
    const outOfStock = products?.filter(product => product?.trackInventory && product?.stockAmount <= 1);
    const totalInventoryWorth = products?.reduce((acc, product) => acc + product?.price, 0);

    ////////////////////////////////////////////////////////
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [tabShown, setTabShown] = useState("products");
    const [showCollectionForm, setShowCollectionForm] = useState(false);
    const [showCollectionEditForm, setShowCollectionEditForm] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(false);
    const [search, setSearch] = useState("");
    ////////////////////////////////////////////////////////

    // THE FUNCTION THAT CHANGES THE ROUTE WHEN WE CLICK A DIFFERENT TAB
    const handleTabShown = function (tab) {
        setTabShown(tab);
        if (tab == "products") {
            navigate(`/dashboard/${tab}`);
        } else {
            navigate(`/dashboard/products/${tab}`);
        }
    }

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
    const findProductsInCollection = function(name) {
        const collectionProducts = products?.filter(product => product?.productCollection.includes(name));
        return collectionProducts?.length || 0;
    }

    const product_columns = [
        {
            name: 'Prduct',
            selector: row => (
                <Link className="table--flex table--link" to={`/dashboard/products/${row?.productId}`}>
                    <img alt={row?.name} src={row?.images?.length > 0 ? BASE_URL + row?.images?.at(0) : empty_product} />
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
                <p className='value'>{currency}{formatNumber(row?.price)}</p>
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
                <span className="value">{formatNumber(findProductsInCollection(row?.name) || 0)}</span>
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
        }
    ];


    // DISPLAY THE DOCUMENT TITLE
    useEffect(function () {
        document.title = `Quicka | ${tabShown == "product" ?
            "Your products" : "Product collections"
            }`;
    }, []);

    // REFETCH IF THERE'S ERROR
    useEffect(function () {
    }, []);

    // SET THE SHOWN TABS DIRECTLY FROM THE PARAMS ROUTE
    useEffect(function () {
        setTabShown(route);
        setSearch("")
    }, [route]);


    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setDeleteLoader(true)
            await handleDeleteOneItem(`${tabShown}`, selectedId);
            if (tabShown == "products") {
                handleFetchUserStoreProducts();
            } else {
                handleFetchUserStoreCollections()
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

            <PageUI
                /* THIS HERE WAS NEEDED FOR, FOR THE REUSABILITY FOR BOTH THE PRODUCT AND THE COLLECTION..*/
                items={tabShown == "products" ? products : collections}
                data={tabShown == "products" ? products : collections}
                pageName={tabShown == "products" ? "product" : "collection"}
                columns={tabShown == "products" ? product_columns : collection_columns}
                emptyText={tabShown == "products" ? product_emptyText : collection_emptyText}
                emptyBtns={tabShown == "products" ? product_emptyBtns : collection_emptyBtns}
                emptyImg={tabShown == "products" ? product_emptyImg : collection_emptyImg}
                emptyTitle={tabShown == "products" ? product_emptyTitle : collection_emptyTitle}
                headTabs={tabShown == "products" ? (
                    <TableHeadTabs pageName="product" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchUserStoreProducts} />
                ) : (
                    <TableHeadTabs pageName="collection" searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchUserStoreCollections} />
                )}
                addBtnStr={tabShown == "products" ? (width < 377 && width > 364) ? "Add product" : "Upload product" : "Add collection"}
                loader={loader} error={error}
                {...(tabShown == "products" && { activeDisplayTab })}

                // THIS PART HERE IS FOR THE PRODUCT COLLECTION SORT OF MODAL
                {...(tabShown == "products" ? { addUrl: "products/upload" } : { addAction: handleShowCollectionForm, action: showCollectionForm })}
                hasLink={tabShown == "products" ? true : false}
                shouldSelect={true}

                // THIS IS A RESUABLE DELECTING OBJECT (FOR BOTH THE PRODUCT AND COLLECTION)
                deleteObj={{
                    fn: deleteItem,
                    title: (tabShown == "products") ? "product" : "collection",
                    close: setShowDeleteModal,
                    show: showDeleteModal,
                    loader: deleteLoader,
                    open: handleShowDeleteModal
                }}
            >

                {/* THE INSIGHTS UI */}
                {showInsights?.product && (
                    <div className='page__section--insights insight--grid' style={{ marginBottom: '3rem', ...(width > 900 && { width: '85%' }) }}>
                        <Insight loader={loader?.product} title='Total Inventory worth' pre={currency} value={totalInventoryWorth} dec={totalInventoryWorth ? 0 : 2} icon={<LuClipboardList />} />
                        <Insight loader={loader?.product} title='Total Products Sold' value={productsSold} icon={<GrTag />} />
                        <Insight loader={loader?.product} title='Total Collection' value={collections?.length} icon={<TbListSearch />} />
                        <Insight loader={loader?.product} title='Out of stock' value={outOfStock?.length} icon={<TbArrowWaveRightDown />} />
                    </div>
                )}

                {/* THE TABS UI */}
                <div className="page--tabs">
                    <Tab title="Products" onClick={() => handleTabShown("products")} active={tabShown == "products"} />
                    <Tab title="Collections" onClick={() => handleTabShown("collections")} active={tabShown == "collections"} />
                </div>
            </PageUI>
        </>
    )
}

export default index