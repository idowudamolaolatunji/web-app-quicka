import React, { useState } from 'react'
import { MdContentCopy, MdOutlineAddAPhoto } from 'react-icons/md'
import { useWindowSize } from 'react-use'
import { useAuthContext } from '../../context/AuthContext';
import UserIntialsImage from '../../components/layout/UserIntialsImage';
import { HiOutlineCloudUpload } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';



function index() {
    const { width } = useWindowSize();
    const { user } = useAuthContext();

    const [profileImage, setProfileImage] = useState({ preview: "", file: "" });


    const handleImageChange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setProfileImage({ file, preview });
        }
    }


    const handleRemove = function() {
        setProfileImage({ file: "", preview: "" })
    }


    return (
            <div className="profile__container" style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "60rem", marginTop: width > 600 ? "4rem" : "0" }}>

                <div className='page__section--heading' style={{ margin: 0 }}>
                    <h2 className="page__section--title">Account Profile</h2>
                </div>

                <div className="profile__container--top">
                    <div className="profile--image">
                        <input type='file' id='profile--image-input' name='image' onChange={handleImageChange} accept="image/*" />

                        <label htmlFor='profile--image-input' className={`profile-image-label ${profileImage.preview ? 'hoverable' : ""}`}>

                            <span className='profile--image-label'>
                                <HiOutlineCloudUpload style={{ fontSize: '2.4rem' }} />
                                <p>{(user?.image?.url || profileImage.preview) ? "Change Image" : "Choose Image"}</p>
                            </span>
                            
                            {(profileImage.preview) ? (
                                <img src={profileImage.preview} className='profile--image-preview' />
                            ) : (
                                <UserIntialsImage />
                            )}
                        </label>

                        {profileImage.preview && (
                            <button onClick={handleRemove} className='profile--delete-btn '><AiOutlineDelete /></button>
                        )}
                    </div>

                    <span>{user?.firstName}</span>
                </div>


                <div className="card form">
                        <div className="section--heading">
                            <h2>Store Main Information</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>

                        <div className="form--item">
                            <label htmlFor="name" className="form--label">Business Name <Asterisk /></label>
                            <input type="text" className="form--input" placeholder='Business Name' name="name" id='name' value={""} onChange={() => {}} />

                            <span className="form--error-message">
                                {/* {storeDataErrors.name && storeDataErrors.name} */}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor="slogan" className="form--label">Business Slogan</label>
                            <input type="text" id="slogan" name='slogan' className="form--input" placeholder='Slogan: Meeting your every needs..'value={""} onChange={() => {}} />
                        </div>

                        <div className="form--item">
                            <label htmlFor="description" className="form--label">Business Description</label>
                            <textarea name="description" id="description" className="form--input" placeholder='Description..' value={""} onChange={() => {}} />
                        </div>
                    </div>
            </div>
    )
}

export default index