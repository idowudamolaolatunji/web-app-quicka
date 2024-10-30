import React, { useState } from 'react'
import Asterisk from '../../../components/Asterisk'
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { useFetchedContext } from '../../../context/FetchedContext';
import { validateCollectionForm } from '../../../utils/validationHelper';

import Spinner from "../../../components/spinner/simple";
import { createPortal } from 'react-dom';
import CustomAlert from '../../../components/CustomAlert';
import { useAuthContext } from '../../../context/AuthContext';
import ImageUploadUI from '../../../components/ImageUploadUI';

const BASE_API_URL = import.meta.env.VITE_API_URL;

function CollectionFormSm({ close }) {
    const { token } = useAuthContext();
    const { handleFetchUserStoreCollection } = useFetchedContext();

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

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


    async function handleSubmitCollection() {
        const newError = validateCollectionForm(collectionData.name);
        setCollectionFormError(newError);
        if (newError) return;
        setLoading(true)

        try {
            const res = await fetch(`${BASE_API_URL}/collections`, {
                headers,
                method: "POST",
                body: JSON.stringify({ ...collectionData })
            });
            const data = await res.json();
            const { status, message } = data;
            const { collection } = data?.data;

            if (status !== 'success') throw new Error(message);
            setResponse({ status: "success", message });

            // UPLOAD PRODUCT IMAGES
            // if(imageFile) {
            // const url = `collections/upload-image/${collection._id}`
            // await handleImageUpload(imageFile, url);
            // }

            handleFetchUserStoreCollection()
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

                    <ImageUploadUI preview={imagePreview} handleChange={handleImageChange} text="Recommend format (png, jpeg, jpg)" />
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