import React, { useState } from 'react'
import { MdContentCopy, MdOutlineAddAPhoto } from 'react-icons/md'
import { useWindowSize } from 'react-use'
import { useAuthContext } from '../../context/AuthContext';
import UserIntialsImage from '../../components/layout/UserIntialsImage';
import { HiOutlineCloudUpload } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';



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
        <>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Your Account Profile</h2>
            </div>


            <form className="product__upload--container" style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "70rem", marginTop: width > 600 ? "4rem" : "0" }}>



                <div className="profile--image">
                    <input type='file' id='profile--image-input' name='image' onChange={handleImageChange} accept="image/*" />

                    <label htmlFor='profile--image-input' className={`profile-image-label ${profileImage.preview ? 'hoverable' : ""}`}>

                        <span className='profile--image-label'>
                            <HiOutlineCloudUpload style={{ fontSize: '2.4rem' }} />
                            <p>{(user?.image.url || profileImage.preview) ? "Change Image" : "Choose Image"}</p>
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
            </form>

        </>
    )
}

export default index