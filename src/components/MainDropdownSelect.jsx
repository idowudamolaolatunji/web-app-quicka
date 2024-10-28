import React from 'react'
import Select from 'react-dropdown-select'


function MainDropdownSelect({ options, multiple=false, field, title, value, searchable = true, setValue, noDataLabel="No Data", disabled=false, customClass="" }) {
    return (
        <div style={{ width: "100%", textTransform: "capitalize" }}>
            <Select
                className={`form--select ${customClass}`}
                values={value}
                searchBy={field}
                multi={multiple}
                options={options}
                labelField={field}
                valueField={field}
                closeOnSelect
                // disabled={disabled}
                searchable={searchable}
                separator
                clearable
                color='#ff7a49'
                onChange={(values) => setValue(values)}
                placeholder={`Select ${title}`}
                clearOnSelect={true}
                noDataLabel={noDataLabel}
                addPlaceholder={multiple ? " + add." : ""}
                
            />
        </div>
    )
}

export default MainDropdownSelect