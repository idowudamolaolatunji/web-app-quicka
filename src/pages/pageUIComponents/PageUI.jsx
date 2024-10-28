import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { PiShareFatFill } from 'react-icons/pi';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import EmptyTableComponent from '../../components/EmptyTableComponent';
import ExportCSV from '../../components/modal/ExportCSV';
import CustomAlert from '../../components/CustomAlert';
import TableUI from './TableUI';
import './generalStyle.css';
import Delete from '../../components/modal/Delete';
import Spinner from '../../components/spinner/spinner_two';



function PageUI({ items, pageName, columns, data, addUrl, addBtnStr, goto=true, emptyTitle, emptyText, emptyImg, emptyBtns, emptyClassName, headTabs, error, loader, activeDisplayTab = null, insights = true, children, deleteObj }) {

    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { handleToggleInsights, showInsights } = useDataContext();

    // CHECK THIS AGAIN LATER....
    const isItem = items && items.length > 0;
    const width500andIsItem = (isItem && width < 500);

    const [showMoreActions, setShowMoreActions] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });


    function handleShowExportModal() {
        if (!isItem) {
            setResponse({ status: "error", message: `No ${pageName} data to export! ` });
            setTimeout(() => setResponse({ status: null, message: null }), 2500)
        } else {
            setShowExportModal(true)
        }
    }

    useEffect(function() {
        window.scrollTo(0, 0);
    }, [])


    return (
        <>
            {/* THIS IS A REUSABLE DELETE IMPLEMENTATION */}
            {deleteObj?.loader && <Spinner />}
            {deleteObj?.show && <Delete {...deleteObj} />}
            {/* ======================================== */}

            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            <div className='page__section--heading' style={(width500andIsItem && addUrl) ? { flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' } : {}}>
                <h2 className="page__section--title">{pageName == "delivery" ? "delivery rate" : pageName}s</h2>
                    

                <span className='page__section--btns' style={(width500andIsItem && insights && addUrl) ? { display: "grid", gridTemplateColumns: "1fr 1fr" } : {}}>

                    {(isItem && addUrl) && (
                        <button className="page__section-top-btn add" onClick={() => navigate(`/dashboard/${addUrl}`)}>
                            {addBtnStr}<BiPlus />
                        </button>
                    )}

                    {insights && (
                        <span className="page__section--action" onMouseLeave={() => setShowMoreActions(false)}>
                            <button onClick={() => setShowMoreActions(!showMoreActions)} className="page__section-top-btn more">More Actions <BiChevronDown /></button>

                            {showMoreActions && (
                                <ul className="page__section--dropdown">
                                    <li onClick={() => handleToggleInsights(pageName)}>
                                        <span>
                                            {showInsights?.[pageName] ? <ImEyeBlocked /> : <ImEye />}
                                        </span>
                                        {showInsights?.[pageName] ? 'Hide' : 'Show'} Insights
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

            <div className="page__section--main card" style={{ padding: 0, ...((!insights && data?.length < 1) && { boxShadow: "unset", border: "none", padding: 0 })  }}>
                <TableUI
                    data={data}
                    columns={columns}
                    name={pageName}
                    selectableRows={true}
                    goto={goto}
                    toLink={`/dashboard/${pageName}s`}
                    loader={loader?.[pageName]}
                    error={error?.[pageName]}
                    headTabs={headTabs}
                    emptyComponent={
                        <EmptyTableComponent
                            img={emptyImg}
                            text={emptyText}
                            btns={emptyBtns}
                            title={emptyTitle}
                            className={emptyClassName}
                            customStyle={!insights ? { padding: "3rem 0" } : {}}
                        />
                    }
                    {...(activeDisplayTab && { displayType: activeDisplayTab, open: deleteObj?.open })}
                />
            </div>

            {showExportModal && (
                <ExportCSV
                    data={data}
                    title={pageName}
                    setClose={setShowExportModal}
                />
            )}
        </>
    )
}

export default PageUI