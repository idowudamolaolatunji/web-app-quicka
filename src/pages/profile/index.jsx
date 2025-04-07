import React, { useState } from 'react'
import { useWindowSize } from 'react-use'
import { useAuthContext } from '../../context/AuthContext';
import UserIntialsImage from '../../components/layout/UserIntialsImage';
import { HiOutlineCloudUpload } from 'react-icons/hi';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';
import { RiEditLine } from 'react-icons/ri';
import { useDataContext } from '../../context/DataContext';



function index() {
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { isMenuCollapsed } = useDataContext();
    
    const { location } = store;
    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1050);
    
    const [profileImage, setProfileImage] = useState({ preview: "", file: "" });


    const handleImageChange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setProfileImage({ file, preview });
        }
    }


    const handleRemove = function () {
        setProfileImage({ file: "", preview: "" })
    }


    return (
        <React.Fragment>

            <section className='page__section--heading'>
                <h2 className="page__section--title">My Profile</h2>

                {/* <span className='page__section--btns'>
                    <button className="page__section-top-btn more" onClick={() => {}}>
                        Edit Profile <RiEditLine />
                    </button>
                </span> */}
            </section>

            <form className="profile__container" onSubmit={e => e.preventDefault()}>

                <div className="card form">
                    <div className="profile--top">
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

                        <div className="profile--top-details">
                            <h3>{user?.firstname} {user?.lastname}</h3>
                            <p>Admin of {store?.name}</p>
                            <p>From {location?.state?.name && `${location?.state?.name}, `}{location?.country?.name}</p>
                        </div>
                    </div>
                </div>


                <div className="card form">
                    <div className="section--heading">
                        <span className='section--top'>
                            <h2>Personal Information</h2>
                            <button className='profile--edit-btn'>Edit <AiOutlineEdit /></button>
                        </span>

                        <Line border={1.4} where="Top" value="1rem" />
                    </div>


                    <div className="profile--main-details" style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
                        <div className='profile--info'> <span className="info--title">First Name</span> <span className='info--value'>Idowu</span></div>
                        <div className='profile--info'> <span className="info--title">Last Name</span> <span className='info--value'>Olatunji</span></div>
                        <div className='profile--info'> <span className="info--title">Date of Birth</span> <span className='info--value'>06-11-1998</span></div>
                        <div className='profile--info'> <span className="info--title">Email Address</span> <span className='info--value'>Idowu@gmail.com</span></div>
                        <div className='profile--info'> <span className="info--title">Phone Number</span> <span className='info--value'>+2349057643470</span></div>
                        <div className='profile--info'> <span className="info--title">Role</span> <span className='info--value'>Admin</span></div>
                    </div>
                </div>

                <div className="card form">
                    <div className="section--heading">
                        <span className='section--top'>
                            <h2>Address and Location</h2>
                            <button className='profile--edit-btn'>Edit <AiOutlineEdit /></button>
                        </span>

                        <Line border={1.4} where="Top" value="1rem" />
                    </div>


                    <div className="profile--main-details" style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
                        <div className='profile--info'> <span className="info--title">Country</span> <span className='info--value'>Nigeria</span></div>
                        <div className='profile--info'> <span className="info--title">State</span> <span className='info--value'>Lagos</span></div>
                        <div className='profile--info'> <span className="info--title">City</span> <span className='info--value'>Lagos</span></div>
                    </div>
                </div>

                <div className="card form">
                    <div className="section--heading">
                        <span className='section--top'>
                            <h2>Password</h2>
                            <button className='profile--edit-btn'>Edit <AiOutlineEdit /></button>
                        </span>

                        <Line border={1.4} where="Top" value="1rem" />
                    </div>


                    <div className="profile--main-details" style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
                        <div className='profile--info'> <span className="info--title">Password</span> <span className='info--value'>*********************</span></div>
                        <div className='profile--info'> <span className="info--title">Password Confirmation</span> <span className='info--value'>*********************</span></div>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}

export default index