import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../components/spinner/simple'
import Confetti from '../../components/layout/Confetti';
import { GiPartyPopper } from 'react-icons/gi';
import { useWindowSize } from 'react-use';


function index() {
    const [Loading, setLoading] = useState(false);
    const [nextData, setNextData] = useState({
        title: "",
        text: "",
        link: "",
        buttonText: ""
    });

    const navigate = useNavigate();
    const { search } = useLocation();
    const { width } = useWindowSize()

    function handleClick() {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            navigate(nextData.link);
            localStorage.removeItem(`${import.meta.env.VITE_CONGRATS_KEY}`);
            if (search.includes("?next=dashboard")) {
                localStorage.removeItem("user_id");
            }
        }, 1500);
    }


    useEffect(function () {
        window.scrollTo(0, 0);
        const userId = localStorage.getItem("user_id");
        const accessKey = localStorage.getItem(`${import.meta.env.VITE_CONGRATS_KEY}`);

        if (!userId || !accessKey) navigate(-1);
    }, []);


    useEffect(function () {
        if (search.includes("?next=onboarding")) setNextData({
            link: "/onboarding",
            title: "Congrats!",
            text: <>Your Quicka account is successfully created! {width > 400 ? <p>Set up your store in the next page 👉🏿</p> : 'Set up your store in the next page 👉🏿'}</>,
            buttonText: "Continue"
        });
        if (search.includes("?next=dashboard")) setNextData({
            link: "/dashboard",
            title: "Woo-hoo, You're all set!",
            text: <>Your store and dashboard is ready. {width > 400 ? <p>Go to dashboard and launch your store website</p> : 'Go to dashboard and launch your store website'}</>,
            buttonText: "Go to Dashboard"
        });

        if (!search) navigate(-1)
    }, []);

    return (
        <>
            <Confetti />

            <section className='congrats--section'>
                {nextData.title && (
                    <div className="congrats--container">
                        <GiPartyPopper style={{ fontSize: '7rem' }} />
                        <h4 className='congrats--title'>{nextData.title}</h4>
                        <p className='congrats--text'>{nextData.text}</p>
                        <button className='general--btn' onClick={handleClick}>{Loading ? <Spinner /> : nextData.buttonText}</button>
                    </div>
                )}
            </section>
        </>
    )
}

export default index