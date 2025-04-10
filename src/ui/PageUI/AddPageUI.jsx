import React, { useEffect } from 'react'
import { createPortal } from 'react-dom';
import Confetti from '../../components/layout/Confetti';
import CustomAlert from '../../components/layout/CustomAlert';
import Spinner from '../../components/spinner/mainSpinner';
import BackButton from '../../components/button/BackButton'
import "./addPage.css";

import { useWindowSize } from 'react-use';
import { useNavigate, useParams } from 'react-router-dom';
import { IoPlayCircleOutline } from 'react-icons/io5';



function AddPageActions({ id, loader, handleClear, handleSubmit, customStyle }) {
    const navigate = useNavigate();

    return (
        <div className="page__section--actions" style={customStyle}>
            {id ? (
                <button className='button clear--button' onClick={() => navigate(-1)}>Cancel</button>
            ) : (
                <button className='button clear--button' onClick={handleClear}>Clear Fields</button>
            )}
            <button className='button submit--button' disabled={loader} onClick={handleSubmit}>Submit</button>
        </div>
    )
}


function AddPageUI({ pageTitle, pageIcon, close, isnew, ismodal, mainLoader, response, handleClear, handleSubmit, confetti, children, hasExplainer=true, btnBelow=true, noClearField=false /* need to implement d hasExplainer */ }) {
    const { id } = useParams();
    const { width } = useWindowSize();

    const hasExplainerStyle = (hasExplainer) ? { alignItems: "flex-start" } : {}

    useEffect(function() {
        isnew || window.scrollTo(0, 0)
    }, []);

    return (
        <>
            {confetti && <Confetti />}
            {mainLoader && ((isnew || ismodal) ? createPortal(<Spinner />, document.body) : <Spinner />)}

            {(response.message || response.status) && (
                (isnew || ismodal) ? createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
                : <CustomAlert type={response.status} message={response.message} />
            )}

            <section className='product__upload-section'>
                <div className='page__section--heading' style={hasExplainerStyle}>
                    <span className={`${hasExplainer ? "page__heading--box" : "flex" }`} style={{ gap: "1.4rem", ...hasExplainerStyle }}>
                        <BackButton close={close} />

                        {hasExplainer ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: ".84rem", justifyContent: "center" }}>
                                <h2 className="page__section--title">{pageTitle} {pageIcon}</h2>
                                <button className="form--add" onClick={() => {}}>
                                    <IoPlayCircleOutline />
                                    <p>See how to {pageTitle}</p>
                                </button>
                            </div>
                        ) : (
                            <h2 className="page__section--title">{pageTitle} {pageIcon}</h2>
                        )}
                    </span>


                    {(width > 600) && (
                        <AddPageActions
                            id={id || noClearField}
                            loader={mainLoader}
                            handleClear={handleClear}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </div>

                <React.Fragment>
                    {children}
                </React.Fragment>


                {(width < 600 || btnBelow) && (
                    <AddPageActions
                        id={id || noClearField}
                        loader={mainLoader}
                        handleClear={handleClear}
                        handleSubmit={handleSubmit}
                        customStyle={{ marginTop: "4rem" }}
                    />
                )}
            </section>
        </>
    )
}

export default AddPageUI