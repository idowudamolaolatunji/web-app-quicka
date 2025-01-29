import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use';
import { RiBankLine } from 'react-icons/ri';
import MainDropdownSelect from '../form/MainDropdownSelect.jsx';
import Asterisk from '../elements/Asterisk.jsx';
import Line from '../elements/Line.jsx';
import Info from '../elements/Info.jsx';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { validateBankForm } from '../../utils/validationHelper.js';
import AddPageUI from '../../ui/PageUI/AddPageUI.jsx';
import { useDataContext } from '../../context/DataContext.jsx';
import SpinnerTiny from '../spinner/tiny'

const BASE_API_URL = import.meta.env.VITE_API_URL;

function BankDetails({ isnew, close }) {
    const { width } = useWindowSize();
    const { headers, handleStore, shouldKick } = useAuthContext();
    const { handleFetchBanks, handleResolveAccount } = useDataContext();
    
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState({ mainLoading: false, tiny: false });
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false);
    const [bankName, setBankName] = useState([]);
    const [bankFormErrors, setBankFormErrors] = useState({})
    const [resolveFound, setResolveFound] = useState({ status: false, foundName: "" });

    const [bankData, setBankData] = useState({
        accountNumber: "",
        accountName: ""
    });

    function handleClearFields() {
        setBankName([]);
        setBankData({
            accountNumber: "",
            accountName: ""
        });
        setBankFormErrors({})
    }

    function handleBankFormChange(e) {
        const { name, value } = e.target;

        setBankData({
            ...bankData,
            [name]: value,
        });
    }

    const handleLoading = function (key, value) {
        setLoading({
            ...loading, [key]: value,
        });
    }

    const handleResetResponse = function () {
        setResponse({ status: null, message: null });
    }

    useEffect(function () {
        !isnew && window.scrollTo(0, 0);
    }, []);


    useEffect(function() {
        const hanldeFetch = async function() {
            const data = await handleFetchBanks();
            if(data?.status && data?.data?.length > 0) {
                setBanks([...data?.data])
            }
        }

        hanldeFetch()
    }, [])


    useEffect(function() {
        const handleResolve = setTimeout(async function () {
            if (bankData.accountNumber.length < 8 || !bankName[0]?.code) return;
            setLoading({ ...loading, tiny: true });
            setResolveFound({ status: false, foundName: "" })

            try {
                const result = await handleResolveAccount(bankData.accountNumber, bankName[0]?.code);
                const newErrors = {};
                if(!result.status || result.code == "invalid_bank_code") {
                    newErrors.accountNumber = "Could not find account name";
                } else {
                    const accountName = result?.data?.account_name
                    newErrors.accountNumber = "";
                    setBankData({ ...bankData, accountName });
                    setResolveFound({ status: true, foundName: accountName });
                }

                setBankFormErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
            } catch(err) {
                if (err?.name !== "AbortError")
                    return err?.message
            } finally {
                setLoading({ ...loading, tiny: false });
            }
        }, 400)

        return () => clearTimeout(handleResolve);
    }, [bankData.accountNumber, bankName[0]])


    useEffect(function() {
        if(bankData.accountName == "") {
            setResolveFound({ status: false, foundName: "" });
        }
    }, [bankData.accountName]);



    useEffect(function() {
        setBankData({ ...bankData, accountName: "" })
        setResolveFound({ status: false, foundName: "" });
    }, [bankName]);


    // HANDLE SUBMIT BANK DETAILS
    async function handleSubmitDetails() {
        let formData = { ...bankData, bankName };

        const newErrors = validateBankForm(formData);
        setBankFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        handleResetResponse()
        handleLoading("mainLoading", true);

        // GET COLLECTION NAMES
        const { code } = bankName[0];

        try {
            const res = await fetch(`${BASE_API_URL}/stores/onboard/bank`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    ...bankData, code, 
                })
            });
            shouldKick(res);
            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status: "success", message });
            isnew && setShowConfetti(true);

            // MODIFY THE STORE IN THE COOKIE
            const { store } = data?.data
            handleStore(store);

            setTimeout(function () {
                if (isnew) close();
                else navigate(-1)
            }, isnew ? 5000 : 3000);

        } catch (err) {
            setResponse({ status: "error", message: err.message });
        } finally {
            handleLoading("mainLoading", false);
        }
    }

    return (
        <AddPageUI
            pageTitle="Payment Details"
            pageIcon={<RiBankLine />}
            close={close} isnew={isnew}
            mainLoader={loading.mainLoading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleSubmitDetails}
            confetti={showConfetti}
            hasExplainer={false}
            btnBelow={false}
        >

            <div className="product__upload--container" style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "80rem", marginTop: width > 600 ? "4rem" : "0" }}>
                {width < 400 && <Line border={1.4} />}

                <div className="card form">
                    <div className="section--heading">
                        <h2>Bank Details</h2>
                        {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                    </div>

                    <div className="form--item">
                        <label className="form--label">Bank Name <Asterisk /></label>
                        <MainDropdownSelect title="Bank" options={banks} field="name" value={bankName} setValue={setBankName} noDataLabel="No Bank found, Reloading..." />
                        <span className="form--error-message">
                            {bankFormErrors.bankName && bankFormErrors.bankName}
                        </span>
                    </div>


                    <div className="form--grid">
                        <div className="form--item">
                            <label htmlFor='number' className="form--label">Account Number <Asterisk /></label>

                            <input type="text" name="accountNumber" id="number" className='form--input' value={bankData.accountNumber} onChange={handleBankFormChange} placeholder='1234567890' />
                            <span className="form--error-message">
                                {(loading.tiny && !resolveFound.status) && <SpinnerTiny />}

                                {(!loading.tiny && bankFormErrors.accountNumber && !resolveFound.status) && bankFormErrors.accountNumber}

                                {(resolveFound.status && !bankFormErrors.accountNumber) && (
                                    <span style={{ color: "#555" }}>
                                        Found Account Name: <span style={{ color: "green", fontSize: "1rem" }}>{resolveFound.foundName}</span>
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor='name' className="form--label">Account Name <Asterisk /></label>
                            <input type="text" name="accountName" id="name" className='form--input' value={bankData.accountName} onChange={handleBankFormChange} placeholder='Jane Doe Martha' />
                            {bankFormErrors.accountName && (
                                <span className="form--error-message">
                                    {bankFormErrors.accountName}
                                </span>
                            )}

                            <Info text="Account name should be as on BVN" />

                            {/* this right here is just to help us buy space, to avoid our content from jumping up and down */}
                            {!bankFormErrors.accountName && <span className="form--error-message" />}
                        </div>
                    </div>
                </div>
            </div>
        </AddPageUI>
    )
}

export default BankDetails