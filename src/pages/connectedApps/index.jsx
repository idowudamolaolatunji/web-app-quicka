import React from 'react'
import Line from '../../components/Line';

import img from "../../assets/images/png_elements/facebook-48.png"
import { HiCheckBadge } from 'react-icons/hi2';

function index() {
    return (
        <>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Integrated App</h2>
            </div>

            <div className="page--tabs" style={{ marginTop: "-2rem" }}>
                <button className='page--tab active'>All (<span className='value'>10</span>)</button>
                <button className='page--tab'>Socials (<span className='value'>2</span>)</button>
                <button className='page--tab'>Others (<span className='value'>4</span>)</button>
            </div>


            <Line border={1.4} where="Top" value="2rem" />


            <div className="page__section--main connected__grid">
                
                <figure className="connected--figure">
                    <div className='connected--top'>
                        <img className='img' src={img} alt="" />
                        <button>Connect</button>
                    </div>

                    <div className="connected--details">
                        <span className='connected--heading'>
                            <p className='heading'>Facebook</p>
                            <span><HiCheckBadge /> by meta</span>
                        </span>

                        <p className='connected--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, debitis.</p>
                    </div>
                </figure>
                    
                <figure className="connected--figure">
                    <div className='connected--top'>
                        <img className='img' src={img} alt="" />
                        <button>Connect</button>
                    </div>

                    <div className="connected--details">
                        <span className='connected--heading'>
                            <p className='heading'>Facebook</p>
                            <span><HiCheckBadge /> by meta</span>
                        </span>

                        <p className='connected--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, debitis.</p>
                    </div>
                </figure>

                <figure className="connected--figure">
                    <div className='connected--top'>
                        <img className='img' src={img} alt="" />
                        <button>Connect</button>
                    </div>

                    <div className="connected--details">
                        <span className='connected--heading'>
                            <p className='heading'>Facebook</p>
                            <span><HiCheckBadge /> by meta</span>
                        </span>

                        <p className='connected--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, debitis.</p>
                    </div>
                </figure>

                <figure className="connected--figure">
                    <div className='connected--top'>
                        <img className='img' src={img} alt="" />
                        <button>Connect</button>
                    </div>

                    <div className="connected--details">
                        <span className='connected--heading'>
                            <p className='heading'>Facebook</p>
                            <span><HiCheckBadge /> by meta</span>
                        </span>

                        <p className='connected--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, debitis.</p>
                    </div>
                </figure>
                    
                <figure className="connected--figure">
                    <div className='connected--top'>
                        <img className='img' src={img} alt="" />
                        <button>Connect</button>
                    </div>

                    <div className="connected--details">
                        <span className='connected--heading'>
                            <p className='heading'>Facebook</p>
                            <span><HiCheckBadge /> by meta</span>
                        </span>

                        <p className='connected--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, debitis.</p>
                    </div>
                </figure>

                <figure className="connected--figure">
                    <div className='connected--top'>
                        <img className='img' src={img} alt="" />
                        <button>Connect</button>
                    </div>

                    <div className="connected--details">
                        <span className='connected--heading'>
                            <p className='heading'>Facebook</p>
                            <span><HiCheckBadge /> by meta</span>
                        </span>

                        <p className='connected--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, debitis.</p>
                    </div>
                    

                </figure>

            </div>

        </>
    )
}

export default index