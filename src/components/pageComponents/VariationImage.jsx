import { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import Info from '../elements/Info';
import ImageUploadInput from '../form/ImageUploadInput';


export default function VariationImage({ images, setImages, selectedId, setSelectedId, closeModal, variations, setVariations }) {
    const { store } = useAuthContext();
    const maxImageAmount = store?.subscription?.type == "free" ? 4 : 10;

    const [selectedImageIndex, setSelectedImageIndex] = useState(null)
    const [uploadedImage, setUploadedImage] = useState({ file: null, data_url: null });
    const [previewImages, setPreviewimages] = useState([]);


    // VARIATION IMAGE
    const handleOnChangeVariantImage = function(event) {
        const file = event.target.files[0];
        if (file) {
            const data_url = URL.createObjectURL(file);
            setUploadedImage({ data_url, file });
            setPreviewimages([...previewImages, { data_url, file }]);
        }
    }

    const handleSaveVariantImg = function() {
        setVariations(prev => prev.map(variant => {
            if (variant?.id === selectedId) {
                return { ...variant, imageIndex: selectedImageIndex };
            }
            return variant;
        }));

        if(uploadedImage.data_url && previewImages?.at(selectedImageIndex)?.data_url == uploadedImage?.data_url) {
            setImages([ ...images, uploadedImage ]);
        }

        closeModal();
        setSelectedId("")
    }

    // HELP TO SET AND RESET THE PREVIEW IMAGES
    useEffect(function() {
        setPreviewimages([...images]);
    }, []);


    useEffect(() => {
        const currentVariant = variations.find(variant => variant?.id === selectedId);
        if (currentVariant) {
            setSelectedImageIndex(currentVariant?.imageIndex);
        }
    }, [selectedId, variations]);


    return (
        <div className='flex-column-spbtw' style={{ height: "90%" }}>
            <div className="form--variation" style={{ marginTop: "2.8rem" }}>
                <div className='form--item'>
                    <label className='form--label flex'>Option Image (Optional)</label>
                    <Info text="Choose from the existing images you have uploaded or upload a new image for the variation." />
                    {previewImages?.length > 0 ? (
                        <div className='modal--img-grid'>
                            {previewImages?.map((img, i) => (
                                <span className={`modal--img ${i == selectedImageIndex ? "selected" : ""}`} onClick={() => setSelectedImageIndex(i)} key={i}>
                                    <img src={img?.data_url} alt={`product image ${i + 1}`} />
                                </span>
                            ))}

                            {previewImages.length < maxImageAmount && <ImageUploadInput title="Select Image" height={{ height: "8rem" }} handleChange={handleOnChangeVariantImage} />}
                        </div>
                    ) : (
                        <ImageUploadInput height={{ height: "10rem" }} handleChange={handleOnChangeVariantImage} />
                    )}
                </div>
            </div>

            <div className="page__section--actions">
                <button className='button clear--button' onClick={() => {
                    setSelectedId("");
                    closeModal();
                }}>Cancel</button>
                <button className="button submit--button" onClick={handleSaveVariantImg}>Save</button>
            </div>
        </div>
    )
}
