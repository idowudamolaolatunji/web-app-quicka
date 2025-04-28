import React, { useEffect, useState } from 'react'
import Spinner from "../spinner/simple";
import Asterisk from '../elements/Asterisk'
import { createPortal } from 'react-dom';
import CustomAlert from '../layout/CustomAlert';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import { validateGroupForm } from '../../utils/validationHelper';
import MainDropdownSelect from '../form/MainDropdownSelect';
import Info from '../elements/Info';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function CustomerGroupFormSm({ close, editingItem }) {
    const { shouldKick, headers, store } = useAuthContext();
    const { customers, handleFetchMyStoreCustomerGroups } = useFetchedContext();

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [customerGroupData, setCustomerGroupData] = useState({
        name: "", description: "", groupCustomers: []
    });
    const [customerGroupFormError, setCustomerGroupFormError] = useState("");


    const handleChangeGroupData = function (e) {
        const { name, value } = e?.target;
        setCustomerGroupData({
            ...customerGroupData,
            [name]: value,
        })
    }

    const handleClearFields = function () {
        setCustomerGroupData({
            name: "",
            description: ""
        });
    }


    useEffect(function() {
        if(editingItem) {
            setCustomerGroupData({
                name: editingItem?.name,
                description: editingItem?.description,
            });

        }
    }, [editingItem])


    async function handleSubmit() {
        const newError = validateGroupForm(customerGroupData.name, "group");
        setCustomerGroupFormError(newError);
        if(newError) return;
        setLoading(true)
        setResponse({ status: "", message: "" });

        const parameter = editingItem ? `/${editingItem?._id}` : `?slug=${store?.slug}`;

        try {
            const res = await fetch(`${BASE_API_URL}/customers/groups/${parameter}`, {
                headers, method: editingItem ? "PATCH" : "POST",
                body: JSON.stringify({ ...customerGroupData  })
            });

            shouldKick(res);
            const data = await res.json();
            if (res?.status !== 201 && data?.status !== 'success') {
                throw new Error(data?.message);
            }

            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            handleClearFields()
            setResponse({ status: "success", message: data?.message });

            handleFetchMyStoreCustomerGroups()
            setTimeout(() => close(), 1000);

        } catch (err) {
            setResponse({ status: "error", message: err?.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            {(response.message || response.status) && (
                createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
            )}

            <div className='modal--form'>
                <div className="form--item">
                    <label htmlFor="name" className="form--label">Group Name <Asterisk /></label>
                    <input type="text" name="name" id="name" className="form--input" placeholder='New customers' value={customerGroupData.name} onChange={handleChangeGroupData} />
                    <span className="form--error-message">
                        {customerGroupFormError && customerGroupFormError}
                    </span>
                </div>

                <div className="form--item">
                    <label htmlFor="description" className="form--label">Description (optional)</label>
                    <textarea name="description" id="description" className="form--input" placeholder='Description..' value={customerGroupData.description} onChange={handleChangeGroupData} />
                </div>

                <div className="form--item">
                    <label className="form--label">Customer (optional)</label>
                    <MainDropdownSelect title="Customer" multiple={true} options={customers} field="fullname" value={customerGroupData.groupCustomers} setValue={(value) => setCustomerGroupData({ ...customerGroupData, groupCustomers: value })} noDataLabel='No customer found!' />
                    <Info text="If you don't have customer's details, Leave blank" />
                </div>

                <div className="page__section--actions">
                    {editingItem ? (
                        <button className='button clear--button' onClick={() => {}} disabled={loading}>Close</button>
                    ) : (
                        <button className='button clear--button' onClick={handleClearFields} disabled={loading}>Clear Fields</button>
                    )}
                    <button className='button submit--button' onClick={handleSubmit} disabled={loading}>{loading ? <Spinner /> : "Submit"}</button>
                </div>
            </div>
        </React.Fragment>

    )
}