import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { useAuthContext } from '../../context/AuthContext';
import IntialsImage from '../../components/layout/IntialsImage';
import { HiOutlineCloudUpload, HiOutlineSaveAs } from 'react-icons/hi';
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';
import { RiEditLine } from 'react-icons/ri';
import { useDataContext } from '../../context/DataContext';
import { cap1stLetter, hideEmail } from '../../utils/helper';
import SimpleModal from "../../components/modal/SimpleModal"
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import Info from "../../components/elements/Info"
import Spinner from '../../components/spinner/MainSpinner';
import CustomAlert from '../../components/layout/CustomAlert';
import { useCheckInternetConnection } from '../../hooks/useCheckInternetConnection';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function index() {
    const { width } = useWindowSize();
    const { user, store, headers, formdataHeader, handleUser, setShouldLoadAll } = useAuthContext();
    const { isMenuCollapsed } = useDataContext();
    const contact = store?.contact;
    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1050);
    const internetStatus = useCheckInternetConnection();
    
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState({ preview: "", file: null });
    const [showModal, setShowModal] = useState({ personal: false, location: false, password: false });
    const [formPassword, setFormPassword] = useState({ currentPassword: "", password: "", passwordConfirm: ""});
    const [formPasswordErrors, setFormPasswordErrors] = useState({});


    const handleImageChange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setProfileImage({ file, preview });
        }
    }

    const handleRemove = function () {
        setProfileImage({ preview: "", file: null })
    }

    const handleShowModal = function(name) {
        setShowModal({ ...showModal, [name]: !showModal[name] })
    }

    const handlePasswordChange = function() {
        const { name, value } = e?.target;
        setFormPassword({
            ...formPassword,
            [name]: value,
        });
    }

    useEffect(function() {
        document.title = "Quicka - Profile | Business Management Tool for SME's";
        window.scrollTo(0, 0);
    }, []);

    
    async function handleUploadAccountImage() {
        if(!profileImage.file) return;
        handleUser({ ...user, image: { url: profileImage.preview } });
        setShouldLoadAll(false);
        setProfileImage({ preview: "", file: null })

        // setLoading(true);
        try {
            if(internetStatus == "offline") throw new Error("Internet Error");
            const formData = new FormData();
            formData.append("image", profileImage.file);

            const res = await fetch(`${BASE_API_URL}/auth/upload-profileimage`, {
                method: "PATCH", headers: formdataHeader,
                body: formData
            });
            
            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error(data?.message);
            
            setResponse({ message: "Uploaded", response: "success" });
            handleUser(data?.data?.account);
            setShouldLoadAll(false);
        } catch(err) {
            setResponse({ message: err?.message, response: "error" })
        } finally {
            setLoading(false);
        }
    }


    return (
        <React.Fragment>
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            {showModal.personal && (
                <SimpleModal setClose={() => handleShowModal("personal")} title="Edit Personal Information" icon={<AiOutlineClose />} customstyle={{ width: "60rem" }}>
                    <h3 className="modal--title"></h3>

                </SimpleModal>
            )}

            {showModal.password && (
                <SimpleModal setClose={() => handleShowModal("password")} title="Change Password" icon={<AiOutlineClose />}>
                    <Info text="For you to change password you need to provide current password, a new password, and confirm new password!" />

                    <div className="profile--form">
                        <div className="form--item">
                            <label className='form--label' htmlFor="password">Current Password <Asterisk /></label>
                            <div className="form--input-box">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name='currentPassword'
                                    id="password"
                                    className='form--input'
                                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                    value={formPassword.currentPassword}
                                    onChange={handlePasswordChange}
                                />
                                <div className='form--input-icon' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                    {showCurrentPassword ? <ImEye /> : <ImEyeBlocked />}
                                </div>
                            </div>
                            <span className="form--error-message">
                                {formPasswordErrors.currentPassword && formPasswordErrors.currentPassword}
                            </span>
                        </div>

                        <div className="form--item">
                            <label className='form--label' htmlFor="password">New Password <Asterisk /></label>
                            <div className="form--input-box">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    id="password"
                                    className='form--input'
                                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                    value={formPassword.password}
                                    onChange={handlePasswordChange}
                                    autoComplete="new-password"
                                />
                                <div className='form--input-icon' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ImEye /> : <ImEyeBlocked />}
                                </div>
                            </div>
                            <span className="form--error-message">
                                {formPasswordErrors.password && formPasswordErrors.password}
                            </span>
                        </div>

                        <div className="form--item">
                            <label className='form--label' htmlFor="password">Re-enter New Password <Asterisk /></label>
                            <div className="form--input-box">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    id="password"
                                    className='form--input'
                                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                    value={formPassword.passwordConfirm}
                                    onChange={handlePasswordChange}
                                    autoComplete="new-password"
                                />
                                <div className='form--input-icon' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ImEye /> : <ImEyeBlocked />}
                                </div>
                            </div>
                            <span className="form--error-message">
                                {formPasswordErrors.passwordConfirm && formPasswordErrors.passwordConfirm}
                            </span>
                        </div>
                    </div>
                </SimpleModal>
            )}

            {loading && <Spinner />}

            <section className='page__section--heading'>
                <h2 className="page__section--title">My Profile</h2>
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
                                    <IntialsImage />
                                )}
                            </label>

                            {profileImage.preview && (
                                <button onClick={handleRemove} className='profile--delete-btn '><AiOutlineDelete /></button>
                            )}
                        </div>

                        <div className="profile--top-details">
                            <h3>{user?.firstname} {user?.lastname}</h3>
                            <p style={{ fontSize: "1.3rem" }}>Owner of {cap1stLetter(store?.name)}</p>
                            <p>From {store?.location?.state?.name && `${store?.location?.state?.name}, `}{store?.location?.country?.name}</p>
                        </div>
                        
                        {profileImage.file && (
                            <button className='profile--save-btn' onClick={handleUploadAccountImage}>Save Image <HiOutlineSaveAs /></button>
                        )}
                    </div>
                </div>


                <div className="card form">
                    <div className="section--heading">
                        <span className='section--top'>
                            <h2>Personal Information</h2>
                            <button className='profile--edit-btn' onClick={() => handleShowModal("personal")}>Edit <AiOutlineEdit /></button>
                        </span>

                        <Line border={1.4} where="Top" value="1rem" />
                    </div>

                    <div className="profile--main-details" style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
                        <div className='profile--info'> <span className="info--title">First Name</span> <span className='info--value'>{user?.firstname || "--"}</span></div>
                        <div className='profile--info'> <span className="info--title">Last Name</span> <span className='info--value'>{user?.lastname || "--"}</span></div>
                        <div className='profile--info'> <span className="info--title">Date of Birth</span> <span className='info--value'>{user?.dob || "--"}</span></div>
                        <div className='profile--info'> <span className="info--title">Email Address</span> <span className='info--value' style={{ textTransform: "lowercase" }}>{hideEmail(contact?.email) || "--"}</span></div>
                        <div className='profile--info'> <span className="info--title">Phone Number</span> <span className='info--value value'>+{contact?.phone}</span></div>
                        <div className='profile--info'> <span className="info--title">Role</span> <span className='info--value'>Owner</span></div>
                    </div>
                </div>

                <div className="card form">
                    <div className="section--heading">
                        <span className='section--top'>
                            <h2>{user?.authMethod == "google" ? "Create" : "Change"} Password</h2>
                            <button className='profile--edit-btn' onClick={() => handleShowModal("password")}>{user?.authMethod == "google" ? <>Create <AiOutlinePlus /></> : <>Edit <AiOutlineEdit /></>}</button>
                        </span>

                        <Line border={1.4} where="Top" value="1rem" />
                    </div>

                    <div className="profile--main-details" style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
                        <div className='profile--info'> <span className="info--title">Password</span> <span className='info--value'>{user?.authMethod == "google" ? "nill" : "*********************"}</span></div>
                        <div className='profile--info'> <span className="info--title">Password Confirmation</span> <span className='info--value'>{user?.authMethod == "google" ? "nill" : "*********************"}</span></div>
                    </div>
                </div>

                <div className="card form">
                    <h3>Connect Google Account</h3>
                    <p>Set up your ability to login with your Google account ({hideEmail(user?.email)})</p>
                    <button>Connect Googe Account</button>
                </div>
            </form>
        </React.Fragment>
    )
}