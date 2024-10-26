import React, { useState, useEffect } from 'react'
import { useDataContext } from '../../../context/DataContext';
import ConfettiUI from '../../../components/ConfettiUI';
import CustomAlert from '../../../components/CustomAlert';
import Spinner from '../../../components/spinner/spinner_two';
import MainDropdownSelect from '../../../components/MainDropdownSelect';
import { FiUser } from 'react-icons/fi';
import BackButton from '../../../components/button/BackButton';
import { createPortal } from 'react-dom';
import { useWindowSize } from 'react-use';
import Line from '../../../components/Line';


function CreateCustomers({ close, isnew }) {
    const { width } = useWindowSize();
    const { location, getContries, getStates, getCities, setLocation } = useDataContext();

    const [showConfetti, setShowConfetti] = useState(false)
    const [loading, setLoading] = useState({
        mainLoading: false,
        imageLoading: false
    });
    const [response, setResponse] = useState({
        status: null,
        message: null
    });

    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);


    function handleClearFields() { }


    function handleClearLocation() {
        setState([]);
        setCity([]);
        setLocation({ ...location, state: [], city: [] })
    }

    useEffect(function () {
        handleClearLocation()
        getContries()
    }, []);


    useEffect(function () {
        handleClearLocation();

        if (country.length > 0) {
            getStates(country[0]?.iso2)
        }
    }, [country[0]]);

    useEffect(function () {
        setCity([]);
        setLocation({ ...location, city: [] });

        if (country.length > 0 && state.length > 0) {
            getCities(country[0]?.iso2, state[0]?.iso2);
        }
    }, [country[0], state[0]]);


    function handleCreateCustomer() { }


    return (
        <>
            {showConfetti && <ConfettiUI />}
            {loading.mainLoading && (isnew ? createPortal(<Spinner />, document.body) : <Spinner />)}

            {(response.message || response.status) && (
                isnew ? createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
                    : <CustomAlert type={response.status} message={response.message} />
            )}

            <section className='product__upload-section'>
                <div className='page__section--heading'>
                    <span className='flex'>
                        <BackButton close={close} />
                        <h2 className="page__section--title">Note Customer<FiUser /></h2>
                    </span>


                    {width > 600 && (
                        <div className="page__section--actions">
                            <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                            <button className='button submit--button' onClick={handleCreateCustomer}>Submit</button>
                        </div>
                    )}
                </div>



                <div className="product__upload--container">
                    <div className='left--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Customer Details</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>




                        </div>
                    </div>



                    <div className='right--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Customer Locations</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>


                            <MainDropdownSelect title="a Country" options={location?.country} field="name" value={country} setValue={setCountry} clearOnSelect={true} />

                            <MainDropdownSelect title="a state" options={location?.state} field="name" value={state} setValue={setState} noDataLabel='No states' clearOnSelect={true} disabled={country?.length < 1} />

                            <MainDropdownSelect title="a city" options={location?.city} field="name" value={city} setValue={setCity} noDataLabel='No Cities' clearOnSelect={true} disabled={state?.length < 1} />

                        </div>
                    </div>
                </div>


                {width < 600 && (
                    <div className="page__section--actions" style={{ marginTop: "4rem" }}>
                        <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                        <button className='button submit--button' onClick={handleCreateCustomer}>Submit</button>
                    </div>
                )}
            </section>
        </>
    )
}

export default CreateCustomers