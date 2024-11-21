import React, { useEffect, useState } from 'react'
import AuthsUI from '../../ui/authUI';

import data_img from '../../assets/images/resources/good-faces-lhMdsnK_KWk-unsplash.jpg'

const headingText = "The Power to Manage, at Your Fingertips."

function index() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" })

    useEffect(function() {
        document.title = "Quicka | Forgot Password";
    }, []);
    

    return (
            <AuthsUI backText="Back to login" backLink="/login" heading={headingText} loading={loading} response={response} dataimg={data_img} extras={{marginBottom: '5.6rem'}}>
                <form>

                </form>
            </AuthsUI>
    )
}

export default index