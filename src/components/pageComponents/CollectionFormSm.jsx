import React, { useEffect, useState } from 'react'
import Spinner from "../spinner/TallSpin";
import Asterisk from '../elements/Asterisk'
import { createPortal } from 'react-dom';
import CustomAlert from '../layout/CustomAlert';
import ImageUploadInput from '../form/ImageUploadInput';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import { validateGroupForm } from '../../utils/validationHelper';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function CollectionFormSm({ close, editingItem }) {
    const { shouldKick, formdataHeader, store } = useAuthContext();
    const { handleFetchMyStoreCollections } = useFetchedContext();

    const [image, setImage] = useState({ preview: "", file: "" });
    const [collectionData, setCollectionData] = useState({ name: "", description: "" });
    const [collectionFormError, setCollectionFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });


    const handleImageChange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage({ preview: imageUrl, file });
        }
    };

    const handleChangeCollectionData = function (e) {
        const { name, value } = e?.target;
        setCollectionData({
            ...collectionData,
            [name]: value,
        })
    }

    const handleRemoveImage = function() {
        setImage({ preview: "", file: "" });
    }

    const handleClearFields = function () {
        handleRemoveImage();
        setCollectionData({
            name: "",
            description: ""
        });
    }


    useEffect(function() {
        if(editingItem) {
            setCollectionData({
                name: editingItem?.name,
                description: editingItem?.description,
            });

            setImage({ preview: editingItem?.image?.url, file: "" })
        }
    }, [editingItem])


    async function handleSubmit() {
        const newError = validateGroupForm(collectionData.name);
        setCollectionFormError(newError);
        if (newError) return;
        setLoading(true)
        setResponse({ status: "", message: "" });

        const formData = new FormData();
        formData.append('name', collectionData.name);
        formData.append('description', collectionData.description);
        if(image.file) formData.append('image', image.file);

        // check if it's creating or editing
        const parameter = editingItem ? `/${editingItem?._id}` : `?slug=${store?.slug}`;

        try {
            const res = await fetch(`${BASE_API_URL}/collections${parameter}`, {
                headers: formdataHeader,
                method: editingItem ? "PATCH" : "POST",
                body: formData
            });
            shouldKick(res);
            const data = await res.json();
            if (res?.status !== 201 && data?.status !== 'success') {
                throw new Error(data?.message);
            }

            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            // handleClearFields()
            setResponse({ status: "success", message: data?.message });

            handleFetchMyStoreCollections()
            setTimeout(() => close(), 500);

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
                    <label htmlFor="name" className="form--label">Collection Name <Asterisk /></label>
                    <input type="text" name="name" id="name" className="form--input" placeholder='Baggie Jeans' value={collectionData.name} onChange={handleChangeCollectionData} />
                    <span className="form--error-message">
                        {collectionFormError && collectionFormError}
                    </span>
                </div>

                <div className="form--item collection">
                    <label className="form--label">Collection Image (optional)</label>

                    <ImageUploadInput preview={image.preview} handleChange={handleImageChange} text="Recommend format (png, jpeg, jpg)" extraText="Resolution (700 x 250) | Banner-like view" height={{ height: "18rem" }} handleRemove={handleRemoveImage} />
                </div>

                <div className="form--item">
                    <label htmlFor="description" className="form--label">Collection Description (optional)</label>
                    <textarea name="description" id="description" className="form--input" placeholder='Description..' value={collectionData.description} onChange={handleChangeCollectionData} />
                </div>

                <div className="page__section--actions">
                    {editingItem ? (
                        <button className='button clear--button' onClick={() => close()} disabled={loading}>Close</button>
                    ) : (
                        <button className='button clear--button' onClick={handleClearFields} disabled={loading}>Clear Fields</button>
                    )}
                    <button className={`button ${loading ? "spinner--button" : "submit--button"}`} onClick={handleSubmit} disabled={loading}>{loading ? <Spinner /> : "Submit"}</button>
                </div>
            </div>
        </React.Fragment>

    )
}