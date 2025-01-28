import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import Line from '../../components/elements/Line';
import Template1 from "../../ui/templateUI/Template1"
import Template2 from "../../ui/templateUI/Template2"
import more_themes from '../../assets/images/illustrations/more_theme.png'
import './style.css'
import ConnectionError from '../../components/layout/ConnectionError';
import { useFetchedContext } from '../../context/FetchedContext';
import { useNavigate } from 'react-router-dom';


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { globalConnectionError } = useFetchedContext();
    const noLogo = "../../../faviconB.png"

    useEffect(function() {
        document.title = "Quicka | Customize your store"
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {globalConnectionError && <ConnectionError /> }

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
                        <h2>Theme Customization History</h2>
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

                        <figure className='theme__figure custom--display'>
                            <Template1 logo={noLogo} />
                            <figcaption className='theme__figure--detail'>
                                <span className='theme__figure--detail-main'>
                                    <h3 className='theme__figure--title'>Basic</h3>
                                    <span className='theme__figure--type active'>Current theme</span>
                                </span>
                                <button className='theme__figure--btn' onClick={() => navigate("customise/1")}>Customise!</button>
                            </figcaption>
                        </figure>

                        <figure className='theme__figure custom--display'>
                            <Template2 logo={noLogo} />
                            <figcaption className='theme__figure--detail'>
                                <span className='theme__figure--detail-main'>
                                    <h3 className='theme__figure--title'>Minimalist</h3>
                                    <span className='theme__figure--type'>free</span>
                                </span>
                                <button className='theme__figure--btn' onClick={() => navigate("customise/2")}>Customise!</button>
                            </figcaption>
                        </figure>

                    </div>
                </div>


                {width < 450 && <Line border={1.4} />}


                {/* PREMIUM THEMES CARD */}
                <div className="theme__card card">
                    <div className="section--heading" style={{ marginBottom: '2.8rem' }}>
                        <h2>Quicka <strong>premium</strong> themes</h2>
                        <p>Feature-rich <strong>premium</strong> templates&mdash; with effortless and easy customization.</p>
                    </div>

                    <div className="theme--grid">
                        <figure className='theme__figure custom--display'>
                            <Template1 logo={noLogo} />
                            <figcaption className='theme__figure--detail'>
                                <span className='theme__figure--detail-main'>
                                    <h3 className='theme__figure--title'>Elegant</h3>
                                    <span className='theme__figure--type'>premium</span>
                                </span>
                                <button className='theme__figure--btn' onClick={() => navigate("customise/3")}>Customise!</button>
                            </figcaption>
                        </figure>
                    </div>
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