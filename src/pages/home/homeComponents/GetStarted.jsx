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
import UploadProduct from '../../products/subPages/UploadProduct';
import CreateDelivery from '../../delivery/subPages/CreateDelivery';
import BankDetails from '../../../components/pageComponents/BankDetails';
import StoreCustom from '../../../components/pageComponents/StoreCustom';
import CustomAlert from '../../../components/layout/CustomAlert';
import BgSimple from '../../../components/modal/BgSimple';
import Welcome from './Welcome';
import { useFetchedContext } from '../../../context/FetchedContext';
import WatchedBtn from '../../../components/elements/WatchedBtn';


const BASE_API_URL = import.meta.env.VITE_API_URL;
const STEPS_PROGRESS = import.meta.env.VITE_ONBOARD_STEPS_PROGRESS_KEY;

function GetStarted() {
    const { width } = useWindowSize();
    const { globalConnectionError, handleFetchError } = useFetchedContext();
    const { user, store, token, handleStore, shouldKick } = useAuthContext();

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    
    const [stepsToComplete, setStepsToComplete] = useState(localStorage.getItem(STEPS_PROGRESS) ? JSON.parse(localStorage.getItem(STEPS_PROGRESS)) : [
        { id: 1, name: 'Onboard', tipText: 'Store and Dashboard Created!', completed: true },
        { id: 2, name: 'hasCustomizedStore', tipText: 'Store Customized!', completed: false, shortText: 'Customize your Store' },
        { id: 3, name: 'hasFirstProduct', tipText: 'First Product Uploaded!', completed: false, shortText: 'Upload First Product' },
        { id: 4, name: 'hasDeliveryRate', tipText: 'Delivery Rate Created!', completed: false, shortText: 'Set Delivery Rates' },
        { id: 5, name: 'hasPaymentDetails', tipText: 'Bank / payment Details Added!', completed: false, shortText: 'Set Payment details' }
    ]);

    const [showModal, setShowModal] = useState({
        customize: false,
        product: false,
        payment: false,
        delivery: false,
        welcome: globalConnectionError ? false : true,
    });

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
        localStorage.setItem(STEPS_PROGRESS, JSON.stringify(stepsToComplete));
    }, [stepsToComplete]);

    // THIS HERE IS BRILLIANT
    useEffect(function () {
        setLoading(true);
        const {
            hasPaymentDetails, hasFirstProduct, hasDeliveryRate, hasCustomizedStore
        } = store?.storeOnboard;

        updateState("hasFirstProduct", hasFirstProduct);
        updateState("hasDeliveryRate", hasDeliveryRate);
        updateState("hasPaymentDetails", hasPaymentDetails);
        updateState("hasCustomizedStore", hasCustomizedStore);

        setTimeout(() => setLoading(false), 200);
    }, [showModal]);


    async function handleFinalizeOnboarding() {
        console.log(completedSteps.length)
        if(completedSteps.length < 5) {
            setResponse({ status: "error", message: "Complete all onboarding Steps!!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        }
        setLoading(true);

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
                setLoading(false);
            }, 3000);

        } catch(err) {
            setLoading(false);
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        }
    }

    return (
        <React.Fragment>
            {loading && <Spinner />}
            {(response.status || response.message) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            <div className="get-started">
                <h2 className='get-started-title flex'>
                    Let's get you selling in just 5 mins!
                </h2>
                <p className='get-started-subtitle'>Finalize your setup to get your store running, and make your website visible to the world.</p>
                <span className='get-started-nums'>

                    {(width <= 450 && !showModal.welcome) && (
                        <WatchedBtn title="Watch how to setup"
                            style={{ margin: "-.3rem 0 .3rem" }}
                            action={() => setShowModal({...showModal, welcome: true })}
                        />
                    )}

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
                    <div className={`opts--items ${handleCheckIfCompleted("hasCustomizedStore") ? 'is-completed' : ''}`}>
                        <div className="opts--heading">
                            <span className='opts--icon'><MdOutlineStorefront /></span>
                            <h3>Customize your online store.</h3>
                        </div>
                        <p>Select a theme, upload your logo, choose colors, and add images to customize your website.</p>
                        <button name='customize' onClick={handleOpenModal}>{handleCheckIfCompleted("hasCustomizedStore") ? <CompletedTagUI /> : 'Customize store'}</button>
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

                    <div className={`opts--items ${handleCheckIfCompleted("hasPaymentDetails") ? 'is-completed' : ''}`}>
                        <div className="opts--heading">
                            <span className='opts--icon'><RiBankLine /></span>
                            <h3>Add payment details for payout.</h3>
                        </div>
                        <p>Bank or payment details is needed to allow you start collecting payment when you make sales through your website.</p>
                        <button name="payment" onClick={handleOpenModal}>{handleCheckIfCompleted("hasPaymentDetails") ? <CompletedTagUI /> : 'Set up payment'}</button>
                    </div>
                </div>

                <button className={`get-started-btn ${completedSteps.length < 5 ? 'disabled' : ''}`} disabled={completedSteps.length < 5} onClick={handleFinalizeOnboarding}>Finish!</button>
            </div>
            
            {(showModal.welcome) && (
                <BgSimple setClose={() => handleCloseModal("welcome")}>
                    <Welcome firstname={user?.firstname} setClose={() => handleCloseModal("welcome")} />
                </BgSimple>
            )}

            {(showModal.payment || showModal.delivery || showModal.product || showModal.customize) && (
                <FullScreen style={{ maxWidth: '100rem', margin: '0 auto' }}>
                    {showModal.payment && <BankDetails isnew close={() => handleCloseModal('payment')} />}
                    {showModal.customize && <StoreCustom isnew  close={() => handleCloseModal('customize')} />}
                    {showModal.product && <UploadProduct isnew close={() => handleCloseModal('product')} />}
                    {showModal.delivery && <CreateDelivery isnew close={() => handleCloseModal('delivery')} />}
                </FullScreen>
            )}
        </React.Fragment>
    )
}

export default GetStarted