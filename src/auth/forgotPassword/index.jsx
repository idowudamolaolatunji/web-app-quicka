import React, { useEffect } from 'react'
import AuthsUI from '../authComponents/AuthsUI';

// import data_img from '../../assets/images/resources/christina-wocintechchat-com-S3GrMiUhpNU-unsplash.jpg'
import data_img from '../../assets/images/resources/good-faces-lhMdsnK_KWk-unsplash.jpg'

const headingText = "The Power to Manage, at Your Fingertips."

function index() {

    useEffect(function() {
        document.title = "Quicka | Forgot Password";
    }, []);
    

    return (
        <>
            <AuthsUI backText="Back to login" backLink="/login" heading={headingText} dataimg={data_img} extras={{marginBottom: '5.6rem'}}>
                <form>

                </form>
            </AuthsUI>
        </>
    )
}

export default index