import React, { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field';
import Asterisk from '../../components/elements/Asterisk';
import QuillEditor from '../../components/form/QuillEditor';
import { useWindowSize } from 'react-use';
import Line from '../../components/elements/Line';
import { PiCoinsBold } from 'react-icons/pi';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchedContext } from '../../context/FetchedContext';
import AddPageUI from '../../ui/PageUI/AddPageUI';
import isOnline from 'is-online';


const BASE_API_URL = import.meta.env.VITE_API_URL;


function index() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, store, handleStore, shouldKick } = useAuthContext();
    const { handleFetchMyStoreExpenses, handleFetchError, handleFetchOneItem } = useFetchedContext();

    const currency = store?.currency?.symbol;

    const [expensesFormErrors, setExpensesFormErrors] = useState({})
    const [expensesData, setExpensesData] = useState({ title: "", amount: null, date: "" });

    const [image, setImage] = useState({ preview: "", file: "" })
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });


    const handleImageChange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage({ preview: imageUrl, file });
        }
    };

    const handleExpensesDataChange = function (e) {
        const { name, value } = e?.target;
        setCollectionData({
            ...collectionData,
            [name]: value,
        })
    }

    const handleRemoveImage = function () {
        setImage({ preview: "", file: "" });
    }

    function handleClearFields() {
        setExpensesData({
            title: "",
            amount: null,
            date: ""
        });

        setDescription("");
        window?.scrollTo({ top: 0, behavior: "smooth" });
        setExpensesFormErrors({})
    }

    useEffect(function () {
        document.title = "Quicka | Record Expenses"
    }, []);


    async function handleRecordExpenses() { }


    return (
        <AddPageUI
            pageTitle={`${id ? "Edit" : "Record"} Expenses`}
            pageIcon={<PiCoinsBold />}
            close={() => navigate(-1)}
            mainLoader={loading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleRecordExpenses}
            hasExplainer={id ? false : true}
            btnBelow={false}
        >

            <form className="product__upload--container" onSubmit={e => e.preventDefault()}
                style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "75rem", marginTop: width > 600 ? "4rem" : "0" }}
            >
                {width < 400 && <Line border={1.4} />}

                <div className="card form">
                    <div className="section--heading">
                        <h2>Expenses Details</h2>
                        {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                    </div>

                    <div className="form--item">
                        <label htmlFor="title" className="form--label">Expenses Title <Asterisk /></label>
                        <input type="text" id="title" className="form--input" placeholder='Bills For Sept' value={expensesData.title} onChange={handleExpensesDataChange} />
                        <span className="form--error-message">
                            {expensesFormErrors.title && expensesFormErrors.title}
                        </span>
                    </div>

                    <div className="form--grid">
                        <div className="form--item">
                            <label htmlFor="amount" className="form--label">Expenses amount <Asterisk /></label>
                            <CurrencyInput
                                id="amount"
                                name="amount"
                                className="form--input"
                                placeholder="Expenses amount"
                                value={expensesData.amount}
                                prefix={currency}
                                decimalsLimit={0}
                                onValueChange={(value, name, _) => setExpensesData({ ...expensesData, anmount: value })}
                            />
                            <span className="form--error-message">
                                {expensesFormErrors.amount && expensesFormErrors.amount}
                            </span>
                        </div>

                        <div className="form--item">
                            <label id='date' className="form--label">Expenses Date <Asterisk /></label>
                            <input type="datetime-local" className='form--input' placeholder='Select date' max={new Date().toISOString().slice(0, 16)} name="date" id="date" value={expensesData.date} onChange={handleExpensesDataChange} />
                            <span className="form--error-message">
                                {expensesFormErrors.date && expensesFormErrors.date}
                            </span>
                        </div>
                    </div>

                    <div className="form--item">
                        <label htmlFor="" className="form--label">Additional Description (optional)</label>
                        <QuillEditor value={description} setValue={setDescription} />
                    </div>
                </div>
            </form>
        </AddPageUI>
    )
}

export default index