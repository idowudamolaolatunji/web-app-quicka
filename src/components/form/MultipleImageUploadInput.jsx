import React, { useState } from 'react'
import { GoStack } from 'react-icons/go';
import { IoCloseOutline, IoCloudDownloadOutline } from 'react-icons/io5';
import ReactImageUploading from 'react-images-uploading'
import TooltipUI from '../layout/TooltipUI';
import { RxUpdate } from 'react-icons/rx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { PiFrameCorners } from 'react-icons/pi';
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../context/AuthContext';
import Delete from '../modal/Delete';
import isOnline from 'is-online';
import { useFetchedContext } from '../../context/FetchedContext';


function MultipleImageUploadInput({ images, productId, handleChange, setResponse, setLoading }) {
    const maxImageAmount = 6;
    const maxSize = 4 * 1024 * 1024; //4mb
    
    const { width } = useWindowSize();
    const { headers, shouldKick } = useAuthContext();
    const { handleFetchUserStoreProducts } = useFetchedContext();
    /////////////////////////////////////////////////
    const [removeImageFn, setRemoveImageFn] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    
    const handleError = function (errMessage) {
        setResponse({ status: "error", message: errMessage })
    }
    
    const handleResetResponse = function () {
        setResponse({ status: '', message: '' });
    }
    
    const handleDeleteUploaded = function (onRemoveImage, index) {
        setShowModal(true);
        setSelectedIndex(index);
        // this is to help us to store a function as state
        setRemoveImageFn(() => () => onRemoveImage(index));
    }
    
    async function handleDelete() {
        setLoading(true)
        handleResetResponse()
        
        const connected = await isOnline();
        if(!connected) throw new Error("Internet Error");
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/products/image/${productId}/${selectedIndex}`, {
                method: "DELETE", headers
            });
            shouldKick(res)

            const data = await res.json();
            setShowModal(false)
            setResponse({ status: "success", message: data?.message });
            // remove image via the setted state function
            removeImageFn();
            handleFetchUserStoreProducts()
        } catch(err) {
            setResponse({ status: "error", message: err?.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {showModal && <Delete close={() => setShowModal(false)} fn={handleDelete} text="This image will be deleted!" />}

            <ReactImageUploading
                multiple
                value={images}
                maxNumber={maxImageAmount}
                dataURLKey="data_url"
                acceptType={["jpg", "png", "jpeg"]}
                onChange={handleChange}
                maxFileSize={maxSize}
            >
                {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps, errors
                }) => (
                    <>
                        {errors && (
                            <>
                                {errors?.maxNumber && handleError("Number of selected images exceed max amount")}
                                {errors?.acceptType && handleError("Your selected file type is not allow")}
                                {errors?.maxFileSize && handleError("Selected file size exceed max file size")}
                                {errors?.resolution && handleError("Selected file is not match your desired resolution")}
                            </>
                        )}

                        <div className='form--image'>
                            {(imageList.length > 2 && width > 600 && !productId) && (
                                <button type='button' style={{ margin: '-3.4rem 0 .6rem auto' }} onClick={onImageRemoveAll}>Remove All Images <IoCloseOutline /></button>
                            )}

                            {imageList?.length < 1 && (
                                <div onClick={onImageUpload} className={`form--img-box ${isDragging ? 'dropping' : ''}`} {...dragProps}>
                                    {isDragging ? (
                                        <span className='img--container'>
                                            <GoStack />
                                            <h3>Drop It</h3>
                                        </span>
                                    ) : (
                                        <span className='img--container' {...dragProps}>
                                            <IoCloudDownloadOutline style={{ color: '#ff7a49' }} />
                                            <h3>Click to upload or Drag n drop Image</h3>
                                            <p>Recommeded formats: PNG, JPEG, and JPG <br />Max Size 4Mb</p>
                                        </span>
                                    )}
                                </div>
                            )}

                            {imageList.length > 0 && (
                                <div className='img--grid'>
                                    {imageList?.map((image, index) => (
                                        <div key={index} className="img--item">
                                            <img src={image?.data_url} />
                                            <div className="img--item-btns">
                                                <TooltipUI placement='bottom' title="Change Image">
                                                    <button onClick={() => onImageUpdate(index)}><RxUpdate /> </button>
                                                </TooltipUI>
                                                <TooltipUI placement='bottom' title="Remove Image">
                                                    <button onClick={() => {
                                                        productId ?
                                                        handleDeleteUploaded(onImageRemove, index)
                                                        :
                                                        onImageRemove(index)
                                                    }}><RiDeleteBin6Line /></button>
                                                </TooltipUI>
                                                {!productId && (
                                                    <TooltipUI placement='bottom' title="Crop Image">
                                                        {/* <button onClick={() => handleEdit(image.data_url)}><PiFrameCorners /> </button> */}
                                                        <button><PiFrameCorners /> </button>
                                                    </TooltipUI>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {imageList.length < maxImageAmount && (
                                        <div onClick={onImageUpload} className={`form--img-box ${isDragging ? 'dropping' : ''}`} {...dragProps}>
                                            {isDragging ? (
                                                <span className='img--container'>
                                                    <GoStack />
                                                    <h3>Drop It</h3>
                                                </span>
                                            ) : (
                                                <span className='img--container' {...dragProps}>
                                                    <IoCloudDownloadOutline />
                                                    <p>Click or drop more!</p>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(imageList.length > 2 && width < 600 && !productId) && (
                                <button type='button' style={{ marginTop: '1rem' }} onClick={onImageRemoveAll}>Remove All Images <IoCloseOutline /></button>
                            )}
                        </div>
                    </>
                )}
            </ReactImageUploading>
        </>
    )
}

export default MultipleImageUploadInput