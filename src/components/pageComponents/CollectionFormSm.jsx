import React, { useEffect, useState } from 'react'
import Asterisk from '../elements/Asterisk'
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { useFetchedContext } from '../../context/FetchedContext';
import { validateCollectionForm } from '../../utils/validationHelper';

import Spinner from "../spinner/simple";
import { createPortal } from 'react-dom';
import CustomAlert from '../layout/CustomAlert';
import { useAuthContext } from '../../context/AuthContext';
import ImageUploadInput from '../form/ImageUploadInput';

const BASE_API_URL = import.meta.env.VITE_API_URL;

function CollectionFormSm({ close, editingItem }) {
    const { shouldKick, fdHeaders } = useAuthContext();
    const { handleFetchUserStoreCollections, handleImageUpload } = useFetchedContext();


    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [collectionData, setCollectionData] = useState({ name: "", description: "" });
    const [collectionFormError, setCollectionFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });

    const handleImageChange = function (event) {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    const handleChangeCollectionData = function (e) {
        const { name, value } = e?.target;
        setCollectionData({
            ...collectionData,
            [name]: value,
        })
    }

    const handleClearFields = function () {
        setCollectionData({
            name: "",
            description: ""
        });

        setImageFile(null);
        setImagePreview(null);
    }

    const handleRemoveImage = function() {
        setImageFile(null);
        setImagePreview(null);
    }


    useEffect(function() {

    }, [])


    async function handleSubmitCollection() {
        const newError = validateCollectionForm(collectionData.name);
        setCollectionFormError(newError);
        if (newError) return;
        setLoading(true)
        setResponse({ status: "", message: "" });

        const formData = new FormData();
        formData.append('name', collectionData.name);
        formData.append('description', collectionData.description);
        formData.append('image', imageFile);

        try {
            const res = await fetch(`${BASE_API_URL}/collections`, {
                headers: fdHeaders,
                method: "POST",
                body: formData
            });
            shouldKick(res);
            const data = await res.json();
            if (res?.status !== 201 && data?.status !== 'success') {
                throw new Error(data?.message);
            }
            setResponse({ status: "success", message: data?.message });

            handleFetchUserStoreCollections()
            setTimeout(() => close(), 1000);

        } catch (err) {
            setResponse({ status: "error", message: err?.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
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

                <div className="form--item">
                    <label className="form--label">Collection Image (optional)</label>

                    <ImageUploadInput preview={imagePreview} handleChange={handleImageChange} text="Recommend format (png, jpeg, jpg)" height={{ height: "18rem" }} handleRemove={handleRemoveImage} />
                </div>

                <div className="form--item">
                    <label htmlFor="description" className="form--label">Collection Description (optional)</label>
                    <textarea name="description" id="description" className="form--input" placeholder='Description..' value={collectionData.description} onChange={handleChangeCollectionData} />
                </div>


                <div className="page__section--actions">
                    <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                    <button className='button submit--button' onClick={handleSubmitCollection}>{loading ? <Spinner /> : "Submit"}</button>
                </div>

            </div>
        </>

    )
}

export default CollectionFormSm