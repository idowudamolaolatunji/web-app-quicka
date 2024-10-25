import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import CheckBoxInput from './CheckBoxInput';
import { RiDeleteBin5Line } from 'react-icons/ri';
import ProductCard from './ProductCard';
import TableError from './TableError';
import ProductCardSkeleton from './ProductCardSkeleton';
import { TableHeadSkeleton, TableSkeleton } from './TableSkeleton';

const customStyles = {
    table: {
        style: {
            overflowX: 'auto',
            fontFamily: "inherit",
            color: "inherit",
        },
    },
    head: {
        style: {
            fontSize: "15px",
            fontWeight: "600",
            height: '65px',
        },
    },
    rows: {
        style: {
            minHeight: '75px',
            cursor: 'pointer',
        },
    },
    headCells: {
        style: {
            paddingRight: '5px',
            backgroundColor: '#333',
            color: '#fff',
            height: '65px'
        },
    },
    cells: {
        style: {
            textAlign: 'center'
        }
    }
};


function TableUI({ name, columns, data, toLink, goto, emptyComponent, selectableRows, headTabs, displayType = "table", loader, error }) {
    const isData = data?.length > 0;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const [selectedRowsId, setSelectedRowsId] = useState([]);
    

    const handleSelectedRow = function ({ allSelected, selectedCount, selectedRows }) {
        const ids = [];
        selectedRows?.map(row => ids.push(row._id));
        setSelectedRowsId(ids);
    }

    const handleNavigate = function(row) {
        navigate(`${toLink}/${row[name == "product" ? "productId" : "_id"]}`);
    }

    return (
        <>
            {(error && !isData && !loader) && <TableError text="Unable to fetch, Check Connection" />}
            {((!isData && !error && !loader) && <>{emptyComponent}</>)}

            {loader && (
                <>
                    <TableHeadSkeleton title={name} />
                    {displayType == "grid" ? (
                        <div className="product__grid">
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            {width > 600 && <ProductCardSkeleton />}
                        </div>
                    ) : (
                        <div style={{ overflow: "hidden" }}>
                            <TableSkeleton />
                        </div>
                    )}
                </>
            )}

            {(!loader && isData) && (
                <>
                    <div className='table--head'>
                        {selectedRowsId.length > 0 ? (
                            <span className='flex'>
                                <p>Selected: {selectedRowsId.length}</p>
                                <button className='table--btn'>delete <RiDeleteBin5Line /></button>
                            </span>
                        ) : (
                            <>{headTabs}</>
                        )}

                    </div>

                    {displayType == "grid" ? (
                        <div className='product__grid'>
                            {data.map(data => (
                                <ProductCard key={data._id} product={data} />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            data={data}
                            columns={columns}
                            pagination
                            pointerOnHover
                            highlightOnHover={width > 600 ? true : false}
                            persistTableHead
                            noDataComponent={false}
                            customStyles={customStyles}
                            selectableRows={selectableRows}
                            onSelectedRowsChange={handleSelectedRow}
                            {...(goto && { onRowClicked: (row) => handleNavigate(row) })}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default TableUI