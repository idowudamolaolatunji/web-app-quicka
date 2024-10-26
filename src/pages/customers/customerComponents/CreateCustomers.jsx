import React, { useState, useEffect } from 'react'
import { useDataContext } from '../../../context/DataContext';
import MainDropdownSelect from '../../../components/MainDropdownSelect';
import { FiUser, FiUsers } from 'react-icons/fi';
import { useWindowSize } from 'react-use';
import Line from '../../../components/Line';
import AddPageUI from '../../pageUIComponents/AddPageUI';
import Asterisk from '../../../components/Asterisk';
import CurrencyInput from 'react-currency-input-field';
import PhoneInput from 'react-phone-input-2';


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

    function handleCustomerData(e) {
        const { name, value } = e?.target;
        setCustomerData({ 
            ...customerData,
            [name]: value
        });
    }

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
            pageIcon={<FiUsers />}
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
                                <input type="text" id="firstname" name='firstname' className="form--input" placeholder='Taiwo' value={customerData.firstname} onChange={handleCustomerData} />
                                <span className="form--error-message">
                                    {customerFormErrors?.firstname && customerFormErrors?.firstname}
                                </span>
                            </div>
                            <div className="form--item">
                                <label htmlFor="lastname" className="form--label">Lastname <Asterisk /></label>
                                <input type="text" id="lastname" name='lastname' className="form--input" placeholder='Matthew' value={customerData.lastname} onChange={handleCustomerData} />
                                <span className="form--error-message">
                                    {customerFormErrors?.lastname && customerFormErrors?.lastname}
                                </span>
                            </div>
                     
                            <div className="form--item">
                                <label htmlFor="email" className="form--label">Email Address <Asterisk /></label>
                                <input type="email" id="email" name='email' className="form--input" placeholder='Taiwo@mail.com' value={customerData.email} onChange={handleCustomerData} />
                                <span className="form--error-message">
                                    {customerFormErrors?.email && customerFormErrors?.email}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="phone" className="form--label">Lastname <Asterisk /></label>

                                <PhoneInput
                                    country={"ng"}
                                    value={customerData.phone}
                                    inputProps={{ name: 'phone', id: 'phone' }}
                                    onChange={(phone, country) => console.log(null, phone, country)}
                                    inputClass='phone-input'
                                    buttonStyle={{ backgroundColor: 'transparent', border: 'none', paddingLeft: '.4rem', height: '4rem', margin: '.2rem 0' }}
                                    countryCodeEditable={true}
                                    dropdownStyle={{ top: '100%', marginTop: 0, borderRadius: '.4rem', padding: '.2rem' }}
                                />


                                <span className="form--error-message">
                                    {customerFormErrors?.phone && customerFormErrors?.phone}
                                </span>
                            </div>
                        </div>

                        <div className="form--item">
                            <label htmlFor='description' className="form--label">Addtional Note(optional)</label>
                            <textarea name="description" id="description" placeholder='Additional...' className='form--input' />
                        </div>

                    </div>
                </div>



                <div className='right--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Customer Delivery Details</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>

                        <div className="form--item">
                            <label className="form--label">Delivery Address (optional)</label>
                            
                            <textarea id='address' name='address' className="form--input" placeholder='Block 12, Flat 3, Libra Estate, Lagos State Nigeria ' />
                        </div>
                        <div className="form--grid">
                            <div className="form--item">
                                <label className="form--label">Country <Asterisk /></label>
                                <MainDropdownSelect title="a Country" options={location?.country} field="name" value={country} setValue={setCountry} clearOnSelect={true} customClass='select-width' />
                            </div>

                            <div className="form--item">
                                <label className="form--label">State (optional)</label>
                                <MainDropdownSelect title="a state" options={location?.state} field="name" value={state} setValue={setState} noDataLabel='No states' clearOnSelect={true} disabled={country?.length < 1} customClass='select-width' />
                            </div>

                            <div className="form--item">
                                <label className="form--label">City (optional)</label>
                                <MainDropdownSelect title="a city" options={location?.city} field="name" value={city} setValue={setCity} noDataLabel='No Cities' clearOnSelect={true} disabled={state?.length < 1} customClass='select-width' />
                            </div>


                            <div className="form--item">
                                <label className="form--label">ZipCode (optional)</label>

                                <input type='number' placeholder='Zipcode' className='form--input' />
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </AddPageUI>
    )
}

export default CreateCustomers