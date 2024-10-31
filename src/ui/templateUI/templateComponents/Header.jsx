import React from 'react';
import { Link } from 'react-router-dom';

import { SlArrowDown } from 'react-icons/sl';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';


function Header({ Logo, about }) {

    return (
        <header className="header main--desktop">
            <nav className="header__nav">
                <div className="header__logo">
                    <Link to={'/'}>
                        <img src={Logo} className="logo_img" alt="" />
                    </Link>
                </div>
                <ul className="nav__list">
                    <li className="nav__item">
                        <Link to="" className="nav__link">Home</Link>
                    </li>
                    {about && (
                        <li className="nav__item">
                            <Link to="" className="nav__link">About</Link>
                        </li>
                    )}
                    <li className="nav__item">
                        <Link to="" className="nav__link">Collection</Link>
                        <SlArrowDown className="nav_icon" />
                    </li>
                    <li className="nav__item">
                        <Link to="" className="nav__link">Contact</Link>
                    </li>
                </ul>
            </nav>


            <div className="header__actions">
                <div className="header__icon">
                    <IoSearchOutline className="icon__el" style={{ fontSize: "2.8rem"}} />
                </div>
                <span className="header__icon">
                    <IoMdHeartEmpty className="icon__el" />
                    <p className="icon--detail">{12}</p>
                </span>

                <span className="header__icon" onClick={() => navigate('/cart')}>
                    <AiOutlineShoppingCart className="icon__el" />
                    <p className="icon--detail">{2}</p>
                </span>
            </div>
        </header>
    )
}


export default Header