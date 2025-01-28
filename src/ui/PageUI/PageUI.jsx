import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { PiShareFatFill } from 'react-icons/pi';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import EmptyTableComponent from '../../components/layout/EmptyTableComponent';
import ExportCSV from '../../components/modal/ExportCSV';
import CustomAlert from '../../components/layout/CustomAlert';
import TableUI from './TableUI';
import './generalStyle.css';
import Delete from '../../components/modal/Delete';
import Spinner from '../../components/spinner/mainSpinner';
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/layout/ConnectionError';
import Drawer from '../../components/modal/Drawer';
import CollectionFormSm from '../../components/pageComponents/CollectionFormSm';


function PageUI({
    items, pageName, columns, data, addUrl, addBtnStr, hasLink = true, emptyTitle,
    emptyText, emptyImg, emptyBtns, headTabs, error, loader, action, searchLoader, addAction,
    activeDisplayTab = null, insights = true, children, deleteObj, shouldSelect, pointOnHover = true
}) {

    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { globalConnectionError } = useFetchedContext();
    const { handleToggleInsights, showInsights } = useDataContext();

    // CHECK THIS AGAIN LATER....
    const isItem = items && items.length > 0;
    const width500andIsItem = (isItem && width < 500);
    const insightPageOrTabName = pageName == "collection" ? "product" : pageName == "settlement" ? "transaction" : (pageName == "special_sales" || pageName == "coupon") ? "discount" : pageName

    const [showMoreActions, setShowMoreActions] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });


    function handleShowExportModal() {
        if (!isItem) {
            setResponse({ status: "error", message: `No ${pageName == "special_sales" ? "running special sales" : pageName} data to export! ` });
            setTimeout(() => setResponse({ status: null, message: null }), 2500)
        } else {
            setShowExportModal(true)
        }
    }

    useEffect(function () {
        window.scrollTo(0, 0);
    }, [])


    return (
        <>
            {deleteObj?.loader && <Spinner />}

            {deleteObj?.show && <Delete {...deleteObj} />}
            {/* ======================================== */}

            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            {/* {error[pageName] && <ConnectionError /> } */}
            {globalConnectionError && <ConnectionError />}

            {/* THIS IS FOR THE COLLECTION MODAL */}
            {action && (
                <Drawer title="Create Collection" setClose={addAction}>
                    <CollectionFormSm close={addAction} />
                </Drawer>
            )}

            {showExportModal && (
                <ExportCSV data={data} title={pageName} setClose={setShowExportModal} />
            )}

            <div className='page__section--heading' style={(width500andIsItem && (addUrl || addAction)) ? { flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' } : {}}>
                <h2 className="page__section--title">{pageName == "delivery" ? "delivery rates" : pageName == "special_sales" ? "special sales" : pageName + "s"}</h2>

                <span className='page__section--btns' style={(width500andIsItem && insights && (addUrl || addAction)) ? { display: "grid", gridTemplateColumns: "1fr 1fr" } : {}}>
                    {(isItem && (addUrl || addAction)) && (
                        <button className="page__section-top-btn add" onClick={() => pageName == "collection" ? addAction() : navigate(`/dashboard/${addUrl}`)}>
                            {addBtnStr}<BiPlus />
                        </button>
                    )}

                    {insights && (
                        <span className="page__section--action" onMouseLeave={() => setShowMoreActions(false)}>
                            <button onClick={() => setShowMoreActions(!showMoreActions)} className="page__section-top-btn more">More Actions <BiChevronDown /></button>

                            {showMoreActions && (
                                <ul className="page__section--dropdown">
                                    <li onClick={() => handleToggleInsights(insightPageOrTabName)}>
                                        <span>
                                            {showInsights?.[insightPageOrTabName] ? <ImEyeBlocked /> : <ImEye />}
                                        </span>
                                        {showInsights?.[insightPageOrTabName] ? 'Hide' : 'Show'} Insights
                                    </li>

                                    <li onClick={handleShowExportModal}>
                                        <span><PiShareFatFill /></span>Export CSV
                                    </li>
                                </ul>
                            )}
                        </span>
                    )}
                </span>
            </div>

            {children}

            <div className="page__section--main" style={{ padding: 0 }}>
                <TableUI
                    data={data}
                    columns={columns}
                    name={pageName}
                    hasLink={hasLink}
                    pointOnHover={pointOnHover}
                    selectableRows={shouldSelect}
                    toLink={`/dashboard/${pageName}s`}
                    loader={loader?.[pageName]}
                    error={error?.[pageName]}
                    headTabs={headTabs}
                    searchLoader={searchLoader}
                    emptyComponent={
                        <EmptyTableComponent
                            img={emptyImg}
                            text={emptyText}
                            btns={emptyBtns}
                            title={emptyTitle}
                            className="empty--main"
                            customStyle={!insights ? { padding: "3rem 0" } : {}}

                            // THIS IS BECAUSE THE COLLECTION AND OTHER MODAL LIKE ACTION NEEDS IT.. 
                            {...(addAction && { btnForAction: addAction })}
                        />
                    }
                    {...(activeDisplayTab && { displayType: activeDisplayTab, open: deleteObj?.open })}
                />
            </div>
        </>
    )
}

export default PageUI