import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import CurrencyInput from 'react-currency-input-field';

function CurrencyInputField({ name, value, setValue, shared=true }) {
    // share just means the state value is shared
    const { currency } = useAuthContext();

    return (
        <CurrencyInput
            id="price"
            name={name}
            className="form--input"
            placeholder={`${currency}1,000`}
            prefix={currency}
            decimalsLimit={0}
            value={value}
            onValueChange={(value, name, _) => (
                shared ? 
                    setValue((prev) => ({ ...prev, [name]: value })) 
                :
                    setValue(value)
                )
            }
        />
    )
}

export default CurrencyInputField