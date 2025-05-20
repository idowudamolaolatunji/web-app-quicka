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
import { useFetchedContext } from '../../context/FetchedContext';
import SimpleModal from "../../components/modal/SimpleModal"
import ExtraSmall from '../../components/modal/ExtraSmall';
import IntegrationModal from '../../components/modal/IntegrationModal';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import Info from "../../components/elements/Info"
import MainDropdownSelect from '../../components/form/MainDropdownSelect';


export default function index() {
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { isMenuCollapsed } = useDataContext();
    const { location, getStates, getCities, setLocation } = useDataContext();
    
    const { contact } = store;
    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1050);
    
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

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
        document.title = "Quicka | My profile";
        window.scrollTo(0, 0);

        setCountry(store?.location?.country?.name ? [store?.location?.country] : []);
        setState(store?.location?.state?.name ? [store?.location?.state] : []);
        setCity(store?.location?.city?.name ? [store?.location?.city] : []);
    }, []);

    // FETCHING STATES OF COUNTRIES
    useEffect(function () {
        if (country.length > 0) {
            getStates(country[0]?.iso2)
        }
    }, [country[0]]);

    // FETCHING CITIES OF STATES OF COUNTRIES
    useEffect(function () {
        setLocation({ ...location, city: [] });

        if (country.length > 0 && state.length > 0) {
            getCities(country[0]?.iso2, state[0]?.iso2);
        }
    }, [country[0], state[0]]);


    return (
        <React.Fragment>

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
                            <button className='profile--save-btn'>Save Image <HiOutlineSaveAs /></button>
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
                            <h2>Address & Location</h2>
                            <button className='profile--edit-btn' onClick={() => handleShowModal("location")}>Edit <AiOutlineEdit /></button>
                        </span>

                        <Line border={1.4} where="Top" value="1rem" />
                    </div>

                    <div className="profile--main-details" style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
                        <div className='profile--info'> <span className="info--title">Country</span> <span className='info--value'>{store?.location?.country?.name || "--"}</span></div>
                        <div className='profile--info'> <span className="info--title">State</span> <span className='info--value'>{store?.location?.state?.name || "--"}</span></div>
                        <div className='profile--info'> <span className="info--title">City</span> <span className='info--value'>{store?.location?.city?.name || "--"}</span></div>
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

            
            {showModal.personal && (
                <SimpleModal setClose={() => handleShowModal("personal")} title="Edit Personal Information" icon={<AiOutlineClose />} customstyle={{ width: "60rem" }}>
                    <h3 className="modal--title"></h3>

                </SimpleModal>
            )}

            {showModal.location && (
                <SimpleModal setClose={() => handleShowModal("location")} title="Edit Address & Location" icon={<AiOutlineClose />}>
                    <Info text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, unde amet? Ad accusantium ullam officia." />

                    <div className="profile--form">
                        <div className="form--item">
                            <label className="form--label">Country</label>
                            <MainDropdownSelect title="a Country" field="name" value={country} setValue={setCountry} noDataLabel={store?.location?.country?.name ? "Country cannot be changed" : "Loading..."} clearable={store?.location?.country?.name ? false : true} />
                        </div>

                        <div className="form--item">
                            <label className="form--label">State</label>
                            <MainDropdownSelect title="a state" options={location?.state} field="name" value={state} setValue={setState} noDataLabel="Choose country, Loading..." />
                        </div>

                        <div className="form--item">
                            <label className="form--label">City</label>
                            <MainDropdownSelect title="a city" options={location?.city} field="name" value={city} setValue={setCity} noDataLabel='Choose state, Loading...' />
                        </div>
                    </div>
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

        </React.Fragment>
    )
}