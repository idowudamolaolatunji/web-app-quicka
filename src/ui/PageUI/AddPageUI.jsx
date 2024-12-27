import React, { useEffect } from 'react'
import { createPortal } from 'react-dom';
import Confetti from '../../components/layout/Confetti';
import CustomAlert from '../../components/layout/CustomAlert';
import Spinner from '../../components/spinner/spinner_two';
import BackButton from '../../components/button/BackButton'
import './uploadStyle.css';

import { useWindowSize } from 'react-use';
import { useNavigate, useParams } from 'react-router-dom';


function AddPageUI({ pageTitle, pageIcon, justify=false, close, isnew, ismodal, mainLoader, response, handleClear, handleSubmit, confetti, children }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();

    useEffect(function() {
        isnew || window.scrollTo(0, 0)
    }, [])

    return (
        <>
            {confetti && <Confetti />}
            {mainLoader && ((isnew || ismodal) ? createPortal(<Spinner />, document.body) : <Spinner />)}

            {(response.message || response.status) && (
                (isnew || ismodal) ? createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
                : <CustomAlert type={response.status} message={response.message} />
            )}

            <section className='product__upload-section'>
                <div className='page__section--heading'>
                    <span className={`flex ${justify ? "justify" : ""}`}>
                        <BackButton close={close} />
                        <h2 className="page__section--title">{pageTitle} {pageIcon}</h2>
                    </span>

                    {(width > 600) && (
                        <div className="page__section--actions">
                            {id ? (
                                <button className='button clear--button' onClick={() => navigate(-1)}>Cancel</button>
                            ) : (
                                <button className='button clear--button' onClick={handleClear}>Clear Fields</button>
                            )}
                            <button className='button submit--button' onClick={handleSubmit}>{id ? "Edit" : "Submit"}</button>
                        </div>
                    )}
                </div>

                <>{children}</>

                {(width < 600) && (
                    <div className="page__section--actions" style={{ marginTop: "3rem" }}>
                        {id ? (
                            <button className='button clear--button' onClick={() => navigate(-1)}>Cancel</button>
                        ) : (
                            <button className='button clear--button' onClick={handleClear}>Clear Fields</button>
                        )}
                        <button className='button submit--button' onClick={handleSubmit}>{id ? "Edit" : "Submit"}</button>
                    </div>
                )}
            </section>
        </>
    )
}

export default AddPageUI