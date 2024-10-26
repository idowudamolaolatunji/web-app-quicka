import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { useWindowSize } from 'react-use';
import BackButton from '../../../components/button/BackButton';
import { RiBankLine } from 'react-icons/ri';
import MainDropdownSelect from '../../../components/MainDropdownSelect';
import Asterisk from '../../../components/Asterisk.jsx';
import Line from '../../../components/Line.jsx';
import Info from '../../../components/Info.jsx';
import { useAuthContext } from '../../../context/AuthContext.jsx';
import { validateBankForm } from '../../../utils/validationHelper.js';
import CustomAlert from '../../../components/CustomAlert.jsx';
import Spinner from '../../../components/spinner/spinner_two';
import { banks } from '../../../utils/data.js';
import AddPageUI from '../../pageUIComponents/AddPageUI.jsx';


function BankDetails({ isnew, close }) {
    const { width } = useWindowSize();
    const { bank, token } = useAuthContext();

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

    const [loading, setLoading] = useState({
        mainLoading: false,
        imageLoading: false
    });

    const [response, setResponse] = useState({
        status: null,
        message: null
    });

    const [bankName, setBankName] = useState(bank?.bankname ? [bank] : []);
    const [bankFormErrors, setBankFormErrors] = useState({})

    const [bankData, setBankData] = useState({
        accountNumber: bank?.accountNumber || "",
        accountName: bank?.accountName || ""
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


    async function handleSubmitDetails() {
        let formData = { ...bankData, bankName };

        const newErrors = validateBankForm(formData);
        setBankFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill up all required fields!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 1500);
            return;
        };

        // SET LOADER
        handleResetResponse()
        handleLoading("mainLoading", true);

        // GET COLLECTION NAMES
        const [bankname, slug, code] = bankName;

        try {
            const res = await fetch(`${BASE_API_URL}/stores/add-payment-details/${bank._id}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    bankname,
                    slug, code,
                    ...bankData,
                })
            });

            if (!res.ok) throw new Error('Something went wrong! Check intenet connection');

            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            setResponse({ status: "success", message });

            setTimeout(function () {
                if (isnew) close();
                else navigate(-1)
            }, 5000);


        } catch (err) {

        } finally {
            handleLoading("mainLoading", false);
        }
    }

    return (
        <AddPageUI
            PageTitle="Payment Details"
            pageIcon={<RiBankLine />}
            close={close} isnew={isnew}
            isModal={isModal}
            mainLoader={loading.mainLoading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleCreateCustomer}
            confetti={showConfetti}
        >

            <div className="product__upload--container" style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "80rem", marginTop: width > 600 ? "4rem" : "0" }}>
                <div className="card form">
                    <div className="section--heading">
                        <h2>Bank Details</h2>
                        {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                    </div>

                    <div className="form--item">
                        <label className="form--label">Bank Name <Asterisk /></label>
                        <MainDropdownSelect title="Bank" options={banks} field="bankname" value={bankName} setValue={setBankName} noDataLabel="No Bank found with that name" disabled={bank?.bankname ? true : false} />
                        <span className="form--error-message">
                            {bankFormErrors.bankName && bankFormErrors.bankName}
                        </span>
                    </div>


                    <div className="form--grid">
                        <div className="form--item">
                            <label htmlFor='number' className="form--label">Account Number <Asterisk /></label>

                            <input type="number" name="accountNumber" id="number" className='form--input' value={bankData.accountNumber} onChange={handleBankFormChange} placeholder='1234567890' readOnly={bank?.accountNumber ? true : false} />
                            <span className="form--error-message">
                                {bankFormErrors.accountNumber && bankFormErrors.accountNumber}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor='name' className="form--label">Account Name <Asterisk /></label>
                            <input type="text" name="accountName" id="name" className='form--input' value={bankData.accountName} onChange={handleBankFormChange} placeholder='Jane Doe Martha' readOnly={bank?.accountName ? true : false} />
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