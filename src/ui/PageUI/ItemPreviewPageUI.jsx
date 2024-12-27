import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/button/BackButton'
import Spinner from '../../components/spinner/spinner_two';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import TooltipUI from '../../components/layout/TooltipUI';


function ItemPreviewPageUI({ loading, item, pageType, pageTitle, extraInfo, children }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();

    useEffect(function () {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            {(loading && !item) ? (
                <Spinner />
            ) : (
                <section className='item__preview--section'>
                    <div className='page__section--heading'>
                        <span style={{ display: "flex", gap: "1rem", flexWrap: "wrap", ...(extraInfo ? { alignItems: "flex-start" } : { alignItems: "center" }) }}>
                            <BackButton close={() => navigate(-1)} />
                            <div>
                                <h2 className="page__section--title">{pageTitle}</h2>
                                {(extraInfo && extraInfo)}
                            </div>
                        </span>

                        <span className='page__section--btns'>
                            {pageType !== "order" && (
                                <>
                                    <TooltipUI title={"Edit " + pageType} placement='top'>
                                        <button className="page__section-top-btn add" onClick={() => { }}>
                                            <RiEdit2Line />
                                        </button>
                                    </TooltipUI>

                                    <TooltipUI title={"Delete " + pageType} placement='top'>
                                        <button className="page__section-top-btn table--btn" onClick={() => { }}>
                                            <RiDeleteBin5Line />
                                        </button>
                                    </TooltipUI>
                                </>
                            )}
                        </span>
                    </div>

                    {children}
                </section>
            )}
        </>
    )
}

export default ItemPreviewPageUI