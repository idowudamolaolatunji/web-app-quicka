import React from 'react'
import { Link } from 'react-router-dom'
import Styles from './error.module.css';
import { IoIosLink } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';


function index() {
    return (
        <div className={Styles.error__container}>
            <h1 className={Styles.error__heading}>404 <MdErrorOutline style={{ fontSize: '5.6rem'}} /></h1>
            <p className={Styles.error__text}>Sorry! That page you are trying to access cannot be found, It is either broken or doesn't exist.</p>
            <Link to={'/'} className={Styles.error__btn}> <IoIosLink style={{ fontSize: '2rem'}} /> Go Home</Link>
        </div>
    )
}

export default index
