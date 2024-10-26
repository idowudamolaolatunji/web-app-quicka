import React, { useState, useEffect } from 'react'
import { useDataContext } from '../../../context/DataContext';
import MainDropdownSelect from '../../../components/MainDropdownSelect';
import { FiUser } from 'react-icons/fi';
import { useWindowSize } from 'react-use';
import Line from '../../../components/Line';
import AddPageUI from '../../pageUIComponents/AddPageUI';
import Asterisk from '../../../components/Asterisk';


function CreateCustomers({ close, isModal }) {
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


    const [customerFormErrors, setCustomerFormErrors] = useState({});
    const [customerData, setCustomerData] = useState({
        firstname: "",
        lastname: "",
    });


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
        <AddPageUI
            PageTitle="Record Customer"
            pageIcon={<FiUser />}
            close={close}
            isModal={isModal}
            mainLoader={loading.mainLoading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleCreateCustomer}
            confetti={showConfetti}
        >

            <div className="product__upload--container">
                <div className='left--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Customer Details</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>


                        <div className="form--grid">
                            <div className="form--item">
                                <label htmlFor="firstname" className="form--label">Firstname <Asterisk /></label>
                                <input type="text" id="firstname" name='lastname' className="form--input" placeholder='Taiwo' value={customerData.firstname} onChange={e => setCustomerData({ ...customerData, firstname: e.target.value })} />
                                <span className="form--error-message">
                                    {customerFormErrors?.firstname && customerFormErrors?.firstname}
                                </span>
                            </div>
                            <div className="form--item">
                                <label htmlFor="lastname" className="form--label">Lastname <Asterisk /></label>
                                <input type="text" id="lastname" name='lastname' className="form--input" placeholder='Matthew' value={customerData.lastname} onChange={e => setCustomerData({ ...customerData, lastname: e.target.value })} />
                                <span className="form--error-message">
                                    {customerFormErrors?.lastname && customerFormErrors?.lastname}
                                </span>
                            </div>
                        </div>

                        <div className="form--grid">
                            <div className="form--item">
                                <label htmlFor="email" className="form--label">Email Address <Asterisk /></label>
                                <input type="email" id="email" name='lastname' className="form--input" placeholder='Taiwo@mail.com' value={customerData.email} onChange={e => setCustomerData({ ...customerData, email: e.target.value })} />
                                <span className="form--error-message">
                                    {customerFormErrors?.email && customerFormErrors?.email}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="phone" className="form--label">Lastname <Asterisk /></label>
                                <input type="tel" id="phone" name='phone' className="form--input" placeholder='Phone' value={customerData.phone} onChange={e => setCustomerData({ ...customerData, phone: e.target.value })} />
                                <span className="form--error-message">
                                    {customerFormErrors?.phone && customerFormErrors?.phone}
                                </span>
                            </div>
                        </div>


                        
                        shippingAddress

                    </div>
                </div>



                <div className='right--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Customer Delivery Details</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>


                        <MainDropdownSelect title="a Country" options={location?.country} field="name" value={country} setValue={setCountry} clearOnSelect={true} />

                        <MainDropdownSelect title="a state" options={location?.state} field="name" value={state} setValue={setState} noDataLabel='No states' clearOnSelect={true} disabled={country?.length < 1} />

                        <MainDropdownSelect title="a city" options={location?.city} field="name" value={city} setValue={setCity} noDataLabel='No Cities' clearOnSelect={true} disabled={state?.length < 1} />

                    </div>
                </div>
            </div>

        </AddPageUI>
    )
}

export default CreateCustomers