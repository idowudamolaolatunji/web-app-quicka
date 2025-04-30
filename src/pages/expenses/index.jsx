import React, { useEffect, useState } from 'react'
import PageUI from '../../ui/PageUI/PageUI'
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import { RiDeleteBin5Line, RiEdit2Line, RiMapPinUserFill } from 'react-icons/ri';
import TooltipUI from '../../components/layout/TooltipUI';
import { MdOutlineRefresh } from 'react-icons/md';
import { dateTimeFormat, formatNumber } from '../../utils/helper';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import emptyImg from '../../assets/images/illustrations/expenses.png'
import SimpleModal from '../../components/modal/SimpleModal';
import { BiNetworkChart } from 'react-icons/bi';
import { GiPayMoney } from 'react-icons/gi';
import { useDataContext } from '../../context/DataContext';
import Insight from '../../components/layout/Insight';
import Tab from '../../components/elements/Tab';
import { PiCoins } from 'react-icons/pi';
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';


///////////////////////////////////////////////
const emptyTitle = "Record your expenses";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
  { title: <><AiOutlinePlus />Record Expenses</>, link: "/dashboard/expenses/record" },
];

function index() {
    const navigate = useNavigate();
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const tabParams = queryParams.get("tab")
    
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { showInsights } = useDataContext()
    const { expenses, loader, handleDeleteOneItem, handleFetchMyStoreExpenses } = useFetchedContext();
    const currency = store?.currency?.symbol;
    const totalSpent = expenses?.reduce((acc, expense) => acc + expense?.amount, 0);
    
    ////////////////////////////////////////////////////////
    // const [tabShown, setTabShown] = useState("expense");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState({ show: false, selectedData: null });
    const { selectedData } = showDetailModal;

    const columns = [
        {
            name: 'Expenses Title',
            selector: row => <span className='table--info'>
                <h3>{row?.title}</h3>
            </span>,
            width: width > 600 && "18%",
        },
        {
            name: "Expense Amount",
            selector: row => (
              <p className='value'>{currency}{formatNumber(row?.amount)}</p>
            ),
        },
        {
            name: 'Supplier',
            selector: row => row?.supplier?._id ? (
                <Link className="grid grid-2-4rem-1fr" to={`/dashboard/suppliers/${row?.supplier?._id}/edit`}>
                    <span className='table-customer'>
                        <RiMapPinUserFill />
                    </span>
                    <p>{row?.supplier?.fullname}</p>
                </Link>
            ) : "-- None Selected --",
            width: "18%"
        },
        {
            name: 'Addtional description',
            selector: row => row?.description || "--",
        },
        {
            name: 'Expenses Date',
            selector: row => (
                <TooltipUI placement='top' title={dateTimeFormat(row?.date || row?.createdAt)}>
                    <p className='value'>{dateTimeFormat(row?.date || row?.createdAt)}</p>
                </TooltipUI>
            ),
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => navigate(`${row?._id}/edit`)}><RiEdit2Line /></button>
                    <button className='table--btn' onClick={() => handleShowDeleteModal(row?._id)}><RiDeleteBin5Line /></button>
                </span>
            ),
        },
    ];

    useEffect(function() {
        document.title = "Quicka | Expenses";
    }, []);

    // SET THE SHOWN TABS DIRECTLY FROM THE PARAMS ROUTE
    // useEffect(function () {
    //     if (tabParams) {
    //         setTabShown(tabParams)
    //     } else {
    //         navigate("?tab=expense")
    //     }
    //     setSearch("")
    // }, [tabParams]);

    const handleShowDeleteModal = function(id) {
        setShowDeleteModal(true);
        setSelectedId(id);
    }

    const handleCloseDetailModal = function() {
        setShowDetailModal({ show: false, selectedData: null });
    }

    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`expenses/${selectedId}`);
            handleFetchMyStoreExpenses();
            setShowDeleteModal(false)
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <React.Fragment>
            {showDetailModal.show && (
                <SimpleModal
                    setClose={handleCloseDetailModal}
                    icon={<AiOutlineClose />}
                    title={`Expenses Detail`}
                >
                
                    <div className="item__preview--summary" style={{ marginTop: "2rem" }}>
                        <div className='preview--body-item'>Expenses Title <span className='preview--body-value value'>{selectedData?.title}</span></div>
                    </div>
                </SimpleModal>
            )}

            <PageUI
                columns={columns}
                data={expenses}
                items={expenses}
                pageName="expenses"
                shouldSelect={true}
                addBtnStr="Record Expenses"
                emptyText={emptyText}
                emptyImg={emptyImg}
                emptyBtns={emptyBtns}
                emptyTitle={emptyTitle}
                addUrl="expenses/record"
                headTabs={<TableHeadTabs searchVal={search} setSearchVal={setSearch} handleFetch={handleFetchMyStoreExpenses} />}
                insights={true}
                hasLink={false}
                pointOnHover={false}
                hasDetailModal={true}
                setDetailModal={setShowDetailModal}

                deleteObj={{
                    fn: deleteItem,
                    title: "expenses",
                    close: setShowDeleteModal,
                    show: showDeleteModal,
                    loader: loading
                }}
            >
                {showInsights?.expenses && (
                    <div className='page__section--insights insight--grid'>
                        <Insight title='Total Expenses' loader={loader?.expenses} value={expenses?.length || 0} icon={<PiCoins />} />
                        <Insight title='Total Amount Spent' loader={loader?.expenses} pre={currency} value={totalSpent} dec={totalSpent < 0 ? 2 : 0} icon={<GiPayMoney />} />
                    </div>
                )}

                {/* THE TABS UI */}
                {/* <div className="page--tabs">
                    <Tab title="Expenses" onClick={() => navigate("?tab=expense")} active={tabShown == "expense"} />
                    <Tab title="Expense Groups" onClick={() => navigate("?tab=group")} active={tabShown == "group"} />
                </div> */}
            </PageUI>
        </React.Fragment>
    )
}

export default index