import React, { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field';
import Asterisk from '../../../components/elements/Asterisk';
import QuillEditor from '../../../components/form/QuillEditor';
import { useWindowSize } from 'react-use';
import Line from '../../../components/elements/Line';
import { PiCoinsBold } from 'react-icons/pi';
import { useAuthContext } from '../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import AddPageUI from '../../../ui/PageUI/AddPageUI';
import isOnline from 'is-online';
import moment from 'moment';
import { validateExpensesForm } from '../../../utils/validationHelper';


export default function RecordExpenses() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, store, shouldKick } = useAuthContext();
    const { handleFetchMyStoreExpenses, handleFetchError, handleFetchOneItem } = useFetchedContext();

    const currency = store?.currency?.symbol;
    const BASE_API_URL = import.meta.env.VITE_API_URL;

    const [expensesFormErrors, setExpensesFormErrors] = useState({})
    const [expensesData, setExpensesData] = useState({ title: "", amount: null, date: "" });

    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });

    const handleExpensesDataChange = function (e) {
        const { name, value } = e?.target;
        setExpensesData({
            ...expensesData,
            [name]: value,
        })
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
        document.title = `Quicka | ${id ? `Editing ${expensesData.title} expenses` : "Recording Expenses"}`
    }, []);


    useEffect(function() {
        (async () => {
            if(id) {
                setLoading(true);
                const fetchedItem = await handleFetchOneItem("expense", id);
                console.log(fetchedItem)

                if(fetchedItem) {
                    setLoading(false); 
                    setExpensesData({
                        title: fetchedItem?.title || "",
                        amount: fetchedItem?.amount || null,
                        date: new Date(fetchedItem?.date).toISOString().slice(0, 16) || ""
                    });
                    setDescription(fetchedItem?.description || "");
                }
            }
        })();

    }, [id]);


    async function handleRecordExpenses() {
        const newErrors = validateExpensesForm(expensesData, currency);
        setExpensesFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading(true);

        const parameter = id ? `/${id}` : "/"

        try {
            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/expenses${parameter}`, {
                headers,
                method: id ? "PATCH" : "POST",
                body: JSON.stringify({ ...expensesData, description })
            });

            shouldKick(res);

            const data = await res.json();
            if (res?.status != 201 && data?.status !== 'success') {
                throw new Error(data?.message);
            }
            
            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status: "success", message: data?.message });

            setTimeout(function () {
                handleFetchMyStoreExpenses()
                navigate(-1);
            }, 2000);

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading(false);
        }
    }


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
                        <input type="text" id="title" name='title' className="form--input" placeholder={"Shop rent for " + moment().format('MMMM')} value={expensesData.title} onChange={handleExpensesDataChange} />
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
                                onValueChange={(value, name, _) => setExpensesData({ ...expensesData, amount: value })}
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