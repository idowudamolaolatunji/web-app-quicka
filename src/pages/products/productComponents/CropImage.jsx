import React, { useState } from 'react'

function CropImage() {
    const [cropModal, setCropModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleEdit = function (img) {
        setCropModal(true);
        setSelectedImage(img)
    }

    const onCropChange = function (crop) {
        setCrop(crop)
    }

    const onZoomChange = function (zoom) {
        console.log(zoom)
        setZoom(Number(zoom))
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleClearFields = function () {
        setCropModal(false)
        setSelectedImage(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null);
    }

    return (
        <>
            {cropModal && (
                <SimpleModal setClose={setCropModal} title="Crop Image" icon={<AiOutlineClose />}>
                    <div className='crop--container' style={{ height: width < 600 ? 250 : 300, background: "#333" }}>
                        <Cropper
                            image={selectedImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={onCropChange}
                            onCropComplete={onCropComplete}
                            onZoomChange={onZoomChange}
                        />
                    </div>

                    <div className="controls">
                        <div className="form--item" style={{ gap: 0, marginTop: '1rem' }}>
                            <label className="form--label">Zoom</label>
                            <Slider sx={{ color: '#ff7a49', width: "50%" }} max={3} min={1} step={0.1} value={zoom} onChange={(e) => onZoomChange(e.target.value)} />
                        </div>
                        <div className="button-area">
                            <button onClick={onCancel}>Cancel</button>
                            <button onClick={onResetImage}>Reset</button>
                            <button onClick={onCrop}>Crop</button>
                            <button onClick={() => setCropModal(false)}>Cancel</button>
                            <button>Reset</button>
                            <button>Crop</button>
                        </div>
                    </div>
                </SimpleModal>
            )}
        </>
    )
}

export default CropImage