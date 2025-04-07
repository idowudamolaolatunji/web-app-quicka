import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import Line from '../../components/elements/Line';
import Template1 from "../../ui/templateUI/Template1"
import Template2 from "../../ui/templateUI/Template2"
import demo_logo from '../../assets/images/dummy_items/dummy_logo.png'
import more_themes from '../../assets/images/illustrations/more_theme.png'
import './style.css'
import ConnectionError from '../../components/layout/ConnectionError';
import Spinner from '../../components/spinner/mainSpinner';
import { useFetchedContext } from '../../context/FetchedContext';
import { useNavigate } from 'react-router-dom';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import ComingSoon from '../../components/layout/ComingSoon';
import { useAuthContext } from '../../context/AuthContext';


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { globalConnectionError } = useFetchedContext();
    const [loading, setLoading] = useState(false);
    const { template } = store.customDetail;

    useEffect(function() {
        setLoading(true);
        document.title = "Quicka | Customize your store"
        window.scrollTo(0, 0);

        setTimeout(() => setLoading(false), 250);
    }, []);

    return (
        <>
            {globalConnectionError && <ConnectionError /> }
            {loading && <Spinner />}

            <div className='page__section--heading'>
                <span>
                    <h2 className="page__section--title">Store Customisation</h2>
                    <p className='page__section--text'>Personalize your store's appearance with our customizable themes.</p>
                </span>
            </div>

            <section className="theme__section">
                {/* THEME HISTORY CARD */}
                {/* <div className="card">
                    <div className="section--heading" style={{ marginBottom: '2.8rem' }}>
                        <h2>Recent Theme Customization</h2>
                        <p>Customizations are only visible to you. You can switch back to them anytime.</p>
                    </div>

                    <div className="more--theme-box">
                        <p>Refresh your style with new themes, seasonal updates, and customization options.</p>
                    </div>
                </div> */}

                {width < 450 && <Line border={1.4} />}


                {/* FREE THEMES CARD */}
                <div className="theme__card card">
                    <div className="section--heading" style={{ marginBottom: '2.8rem' }}>
                        <h2>Quicka free themes</h2>
                        <p>Feature-rich and customizable, user-friendly <strong>free</strong> templates.</p>
                    </div>


                    <div className="theme--grid">

                        <figure className={`theme__figure custom--display ${template == "basic" ? "active" : ""}`}>
                            <div className={`theme__figure--display ${template == "basic" ? "active" : ""}`}>
                                <button className='theme__figure--btn' onClick={() => navigate("customise/basic")}>Customize</button>

                                <Template1 logo={demo_logo} />
                            </div>

                            <figcaption className='theme__figure--detail'>
                                <span className='main'>
                                    <h3 className='theme__figure--title'>Basic</h3>
                                    <span className='theme__figure--type'>{template == "basic" ? "Current theme" : "Free"}</span>
                                </span>

                                {template !== "basic" && (
                                    <button className='theme__figure--btn' onClick={() => navigate("customise/basic")}>Preview</button>
                                )}
                            </figcaption>
                        </figure>


                        {width <= 600 && <Line border={1.4} />}

                        <figure className={`theme__figure custom--display ${template == "minimalist" ? "active" : ""}`}>
                            <div className={`theme__figure--display ${template == "minimalist" ? "active" : ""}`}>
                                <button className='theme__figure--btn' onClick={() => navigate("customise/minimalist")}>Customize</button>

                                <Template1 logo={demo_logo} />
                            </div>
                            
                            <figcaption className='theme__figure--detail'>
                                <span className='main'>
                                    <h3 className='theme__figure--title'>minimalist</h3>
                                    <span className='theme__figure--type'>{template == "minimalist" ? "Current theme" : "Free"}</span>
                                </span>

                                {template !== "minimalist" && (
                                    <button className='theme__figure--btn' onClick={() => navigate("customise/basic")}>Preview</button>
                                )}
                            </figcaption>
                        </figure>

                    </div>
                </div>


                {width < 450 && <Line border={1.4} />}


                {/* PREMIUM THEMES CARD */}
                <div className="theme__card card">
                    <div className="section--heading" style={{ marginBottom: '2.8rem' }}>
                        <h2>Quicka <strong>premium</strong> themes</h2>
                        <p>Feature-rich <strong>premium<MdOutlineWorkspacePremium style={{ fontSize: "1.8rem", marginBottom: "-.48rem" }} /></strong>templates&mdash; with effortless and easy customization.</p>
                    </div>

                    {/* <div className="theme--grid">
                        <figure className='theme__figure custom--display'>
                            <Template1 logo={demo_logo} />
                            <div className='theme__figure--detail'>
                                <span className='theme__figure--detail-main'>
                                    <h3 className='theme__figure--title'>Elegant</h3>
                                    <span className='theme__figure--type'>Premium</span>
                                </span>
                                <button className='theme__figure--btn' onClick={() => navigate("customise/3")}>Use Theme </button>
                            </div>
                        </figure>
                    </div> */}

                    <ComingSoon feature="Premium theme" />
                </div>


                {/* MORE THEME */}
                <div className='more--theme-box'>
                    <img src={more_themes} alt="more themes coming.." />
                    <p>Stay tuned for exciting new themes!</p>
                </div>
            </section>
        </>
    )
}

export default index