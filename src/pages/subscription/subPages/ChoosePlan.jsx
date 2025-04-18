import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from "../../../components/button/BackButton"

export default function ChoosePlan() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams?.get("option");
    const [subsOption, setSubsOption] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("basic")

    useEffect(function () {
        if (tabParams) {
            setSubsOption(tabParams)
        }
    }, [tabParams]);


    return (
        <React.Fragment>
            <section className="subscription__container">
                <div className="subscription--grid">

                    <div className="subscription--details">
                        {/* <h3>Choose a plan that best fit your business.</h3> */}
                        <h3 className='details--title'><BackButton />Choose a prefered plan.</h3>

                        {(subsOption == "trail") && (
                            <React.Fragment>
                                <p className="details--subtitle">Free trails for 14 days</p>
                                <p className="details--text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. At, obcaecati magni? Assumenda aliquam earum pariatur!</p>
                            </React.Fragment>
                        )}

                        {!subsOption && (
                            <p>Hello World</p>
                        )}

                    </div>

                    <div className="subcription--plans">

                        <div className={`plan--container ${selectedPlan == "basic" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("basic")}>
                            
                            <span />

                            <div className="">
                                <p>Lorem, ipsum dolor.</p>
                            </div>

                        </div>
                        <div className={`plan--container ${selectedPlan == "lite" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("lite")}>

                            <span />

                        </div>
                        <div className={`plan--container ${selectedPlan == "pro" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("pro")}>

                            <span />

                        </div>
                    </div>

                </div>
            </section>
        </React.Fragment>
    )
}