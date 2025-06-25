import React from 'react'
import Select from 'react-dropdown-select'
import { useWindowSize } from 'react-use'
import { truncateString } from '../../utils/helper';


function MainDropdownSelect({ options, multiple=false, field, title, value, searchable = true, setValue, noDataLabel="No Data", customClass="", clearable=true, subtitle="", loading=false }) {
    const { width } = useWindowSize();

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
                searchable={searchable}
                separator
                clearable={clearable}
                color='#ff7a49'
                onChange={(values) => setValue(values)}
                placeholder={`Select ${subtitle || title}`}
                clearOnSelect={true}
                noDataLabel={loading ? "Loading..." : noDataLabel}
                addPlaceholder={multiple ? " + add." : ""}

                ////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////
                // ONLY RENDER THIS WHEN TRYING TO SHOW PRODUCTS DROPDOWN - else ignore...!!
                ////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////
                itemRenderer={title === "Product" ? ({ item }) => (
                    <div key={item.id}
                        onClick={() => setValue((prev) => {
                            return prev.includes(item) ? prev.filter((val) => val !== item) : [...prev, item]
                        })}
                        className={`
                            product--dropdown-view ${value?.some(val => val.name === item.name) ? "selected" : ""}`
                        }
                    >
                        <img src={item.mainImageUrl} alt={item.name} />
                        <span className='table--info'>
                            <h3>{truncateString(item?.name, width < 450 ? 27 : 500)}</h3>
                            <div>
                                {item?.product_collection?.slice(0, 2)?.map((collection) => (  
                                    <span>{collection?.name}</span>
                                ))}
                            </div>
                        </span>
                    </div>
                ) : null}
                closeOnScroll={title === "Product" && width > 600}
            />
        </div>
    )
}

export default MainDropdownSelect