import React, { useEffect, useState } from 'react'
import { MdOutlineStorefront } from 'react-icons/md';
import { useWindowSize } from 'react-use'
import BackButton from '../../../components/button/BackButton';
import Line from '../../../components/Line';

import img from '../../../assets/images/png_elements/flutterwave-store.png'
import { Link } from 'react-router-dom';
import ImageUploadUI from '../../../components/ImageUploadUI';

function StoreCustom({ isnew, close }) {
    const { width } = useWindowSize();

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = function (event) {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };


    useEffect(function () {
        !isnew && window.scrollTo(0, 0);
    }, []);

  return (
    <section className='product__upload-section'>
            <div className='page__section--heading'>
                <span className='flex justify'>
                    <BackButton close={close} />
                    <h2 className="page__section--title">Customize Your Store<MdOutlineStorefront /></h2>
                </span>
            </div>


            <div className="product__upload--container" style={{ gridTemplateColumns: "1fr", margin: "0 auto", gap: "3.4rem" }}>
                {width < 600 && <Line border={1.4} />}

                <div className='custom--head'>
                    <div className="custom--img">
                        <img src={imagePreview || img} alt="" />
                    </div>
                    <span>
                        <h3>Luxewares</h3>
                        <Link to={""}>luxewares.quicka.shop</Link>
                    </span>
                </div>


                <Line border={1.4} />

                <div className="custom--item">
                    <span>
                        <p>Store name</p>
                        <p>Lorem ipsum dolor sit amet consectetur.</p>
                    </span>


                    <div className="form--item">
                        <input type="text" name="" className="form--input" />
                        <input type="text" name="" className="form--input" />
                    </div>
                </div>

                <Line border={1.4} />

                <div className="custom--item">
                    <span>
                        <p>Store name</p>
                        <p>Lorem ipsum dolor sit amet consectetur.</p>
                    </span>

                    <div>
                        <div className="custom--img">
                            <img src={imagePreview || img} alt="" />
                        </div>
                        
                        <ImageUploadUI handleChange={handleImageChange} />
                    </div>

                </div>

                <Line border={1.4} />

                <div className="custom--item">
                    <span>
                        <p>Store name</p>
                        <p>Lorem ipsum dolor sit amet consectetur.</p>
                    </span>


                    <div className="form--item">
                        <input type="text" name="" className="form--input" />
                        <input type="text" name="" className="form--input" />
                    </div>
                </div>

                <Line border={1.4} />

           </div>

           
        </section>
  )
}

export default StoreCustom