import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import { useWindowSize } from 'react-use';
import { MdOutlineShoppingBag, MdOutlineStorefront } from 'react-icons/md';
import { RiBankLine } from 'react-icons/ri';
import TooltipUI from '../../../components/layout/TooltipUI';
import { IoCheckmarkDone } from 'react-icons/io5';
import { TbTruckDelivery } from 'react-icons/tb';
import Spinner from '../../../components/spinner/mainSpinner'
import FullScreen from '../../../components/modal/FullScreen';
import UploadProduct from '../../uploadProduct';
import CreateDelivery from '../../createDelivery';
import BankDetails from '../../../components/pageComponents/BankDetails';
import StoreCustom from '../../../components/pageComponents/StoreCustom';
import CustomAlert from '../../../components/layout/CustomAlert';
import BgSimple from '../../../components/modal/BgSimple';
import Welcome from './Welcome';
import { useFetchedContext } from '../../../context/FetchedContext';


const BASE_API_URL = import.meta.env.VITE_API_URL;


function GetStarted() {
    const { width } = useWindowSize();
    const { globalConnectionError, handleFetchError } = useFetchedContext();
    const { user, store, token, handleStore, shouldKick } = useAuthContext();

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

    const [loading, setLoading] = useState({ mainLoading: false, miniLoading: false });
    const [response, setResponse] = useState({ status: null, message: null });
    
    const [stepsToComplete, setStepsToComplete] = useState(localStorage.getItem("steps_progress") ? JSON.parse(localStorage.getItem("steps_progress")) : [
        { id: 1, name: 'Onboard', tipText: 'Store and Dashboard Created!', completed: true },
        { id: 2, name: 'hasCustomisedStore', tipText: 'Store Customized!', text: 'Customize your online store.', completed: false, shortText: 'Customize your Store' },
        { id: 3, name: 'hasFirstProduct', tipText: 'First Product Uploaded!', text: 'Add your first product', completed: false, shortText: 'Upload First Product' },
        { id: 4, name: 'hasDeliveryRate', tipText: 'Delivery Rate Created!', text: 'Add your delivery rates to your website', completed: false, shortText: 'Set Delivery Rates' },
        { id: 5, name: 'hasBankDetails', tipText: 'Bank Details Added!', text: 'Add bank details for payments', completed: false, shortText: 'Set Bank Info' }
    ]);

    const [showModal, setShowModal] = useState({
        store: false,
        product: false,
        bank: false,
        delivery: false,
        welcome: globalConnectionError ? false : true,
    })

    const completedSteps = stepsToComplete.filter(step => step.completed);
    const stepsSorted = stepsToComplete.sort((a, b) => b.completed - a.completed);

    // CHECKING IF A STEP IS COMPLETED (BEFORE WE MAKE IT ON THE UI AS COMPLETED)
    const handleCheckIfCompleted = function(name) {
        return stepsToComplete.find(step => (step.name === name && step.completed === true))
    }

    // THE COMPLETED UI COMPONENT
    const CompletedTagUI = function() {
        return <>Completed <IoCheckmarkDone /></>
    }

    // UPDATING THE STEPS ON MOUNT, CHECKING TO SEE WHICH WAS COMPLETED BEFORE
    const updateState = function(name, completed) {
        setStepsToComplete(prevState => prevState.map(step => (
            step.name === name ? { ...step, completed } : step
        )));
    };

    const handleLoading = function (key, value) {
        setLoading({ ...loading, [key]: value });
    }

    const handleOpenModal = function(e) {
        const { name } = e.target;
        setShowModal({...showModal, [name]: true });
    }

    const handleCloseModal = function(name) {
        setShowModal({...showModal, [name]: false });
    }

    useEffect(function () {
        document.title = 'Final onboarding steps!!';
    }, []);

    useEffect(function () {
        localStorage.setItem("steps_progress", JSON.stringify(stepsToComplete));
    }, [stepsToComplete]);

    // THIS HERE IS BRILLIANT
    useEffect(function () {
        handleLoading("mainLoading", true);

        const {
            hasBankDetails, hasFirstProduct, hasDeliveryRate, hasCustomisedStore
        } = store.storeOnboard;

        updateState("hasBankDetails", hasBankDetails);
        updateState("hasFirstProduct", hasFirstProduct);
        updateState("hasDeliveryRate", hasDeliveryRate);
        updateState("hasCustomisedStore", hasCustomisedStore);

        setTimeout(() => handleLoading("mainLoading", false), 200);
    }, [showModal]);


    async function handleFinalizeOnboarding() {
        console.log(completedSteps.length)
        if(completedSteps.length < 5) {
            setResponse({ status: "error", message: "Complete all onboarding Steps!!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        }
        handleLoading("mainLoading", true);

        try {
            const res = await fetch(`${BASE_API_URL}/stores/onboard/finalize`, {
                method: "PATCH", headers 
            });
            shouldKick(res);

            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            const { store } = data?.data;
            setResponse({ status, message });

            setTimeout(function() {
                handleStore(store);

                window.scrollTo(0, 0);
                handleLoading("mainLoading", false);
            }, 3000);

        } catch(err) {
            handleLoading("mainLoading", false);
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        }
    }

    return (
        <>
            {loading.mainLoading && <Spinner />}
            {(response.status || response.message) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            <div className="get-started">
                <h2 className='get-started-title'>Let's get you selling in just 5 mins!</h2>
                <p className='get-started-subtitle'>Finalize your setup to get your store up & running, and make your website visible to the world.</p>
                <span className='get-started-nums'>
                    <p>{
                        // HERE WE MODIFY THE TEXT BASED ON THE COMPLETED STEPS
                        (completedSteps?.length < 5) ? (
                            <><span style={{ fontFamily: "sans-serif" }}>{completedSteps.length}<strong>/</strong>5</span> completed - <strong>{completedSteps.length == 4 ? 'Final' : 'Next'}{width > 370 && " step"} 👉🏿</strong> {stepsSorted[completedSteps.length]?.shortText}</>
                        ) : (
                            <>Completed all Step 🎉 - <strong>Click Finish!</strong> </>
                        )
                    }</p>

                    <div className="get-started-tabs">
                        {stepsSorted.map((step, i) => (
                            (step.completed ? (
                                <TooltipUI title={step.tipText} key={i} placement='bottom'>
                                    <span className='is-completed' />
                                </TooltipUI>
                            ) : (
                                <span key={i} />
                            )
                            )))}
                    </div>
                </span>

                {/* GET STARTED ITEMS */}
                <div className="get-started-opts">
                    <div className={`opts--items ${handleCheckIfCompleted("hasCustomisedStore") ? 'is-completed' : ''}`}>
                        <div className="opts--heading">
                            <span className='opts--icon'><MdOutlineStorefront /></span>
                            <h3>Customize your online store.</h3>
                        </div>
                        <p>Select a theme, upload your logo, choose colors, and add images to customize your website.</p>
                        <button name='store' onClick={handleOpenModal}>{handleCheckIfCompleted("hasCustomisedStore") ? <CompletedTagUI /> : 'Customize store'}</button>
                    </div>

                    <div className={`opts--items ${handleCheckIfCompleted("hasFirstProduct") ? 'is-completed' : ''}`}>
                        <div className="opts--heading">
                            <span className='opts--icon'><MdOutlineShoppingBag /></span>
                            <h3>Add your first product.</h3>
                        </div>
                        <p>Write a description, add photos, and set pricing for the products you plan to sell, you can always add more later from the sidebar.</p>

                        {handleCheckIfCompleted("hasFirstProduct") ? (
                            <button><CompletedTagUI /></button>
                        ) : (
                            <div className="opts--btns">
                                <button name='product' onClick={handleOpenModal}>Add product</button>
                                {/* <div onClick={() => navigate('/dashboard/products/import/add')}>Import product</div> */}
                            </div>
                        )}
                    </div>

                    <div className={`opts--items ${handleCheckIfCompleted("hasDeliveryRate") ? 'is-completed' : ''}`}>
                        <div className="opts--heading">
                            <span className='opts--icon'><TbTruckDelivery /></span>
                            <h3>Add your delivery rates to your website.</h3>
                        </div>
                        <p>Set up delivery areas and how much you charge so your customers can see their shipping costs at checkout.</p>
                        <button name="delivery" onClick={handleOpenModal}>{handleCheckIfCompleted("hasDeliveryRate") ? <CompletedTagUI /> : ' Add delivery rates'}</button>
                    </div>

                    <div className={`opts--items ${handleCheckIfCompleted("hasBankDetails") ? 'is-completed' : ''}`}>
                        <div className="opts--heading">
                            <span className='opts--icon'><RiBankLine /></span>
                            <h3>Add bank details for payments.</h3>
                        </div>
                        <p>Bank details is needed to allow you start collecting payment when you make sales through your website.</p>
                        <button name="bank" onClick={handleOpenModal}>{handleCheckIfCompleted("hasBankDetails") ? <CompletedTagUI /> : 'Set up payment'}</button>
                    </div>
                </div>

                <button className={`get-started-btn ${completedSteps.length < 5 ? 'disabled' : ''}`} disabled={completedSteps.length < 5} onClick={handleFinalizeOnboarding}>Finish!</button>
            </div>
            
            {showModal.welcome && (
                <BgSimple setClose={() => handleCloseModal("welcome")}>
                    <Welcome firstname={user?.firstname} setClose={() => handleCloseModal("welcome")} />
                </BgSimple>
            )}

            {(showModal.bank || showModal.delivery || showModal.product || showModal.store) && (
                <FullScreen style={{ maxWidth: '108rem', margin: '0 auto' }}>
                    {showModal.bank && <BankDetails isnew close={() => handleCloseModal('bank')} />}
                    {showModal.store && <StoreCustom isnew  close={() => handleCloseModal('store')} />}
                    {showModal.product && <UploadProduct isnew close={() => handleCloseModal('product')} />}
                    {showModal.delivery && <CreateDelivery isnew close={() => handleCloseModal('delivery')} />}
                </FullScreen>
            )}
        </>
    )
}

export default GetStarted