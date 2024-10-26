import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import CheckBoxInput from '../../components/CheckBoxInput';
import { RiDeleteBin5Line } from 'react-icons/ri';
import ProductCard from '../../components/ProductCard';
import ErrorComponent from '../../components/ErrorComponent';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';
import { TableHeadSkeleton, TableSkeleton } from '../../components/TableSkeleton';


function TableUI({ name, columns, data, toLink, goto, emptyComponent, selectableRows, headTabs, displayType = "table", loader, error }) {
    const isData = data?.length > 0;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const [selectedRowsId, setSelectedRowsId] = useState([]);

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
                fontSize: "14px",
                fontWeight: "500",
                height: '55px',
            },
        },
        rows: {
            style: {
                minHeight: name == "product" ? "80px" : "70px",
                cursor: 'pointer',
            },
        },
        headCells: {
            style: {
                paddingRight: '5px',
                backgroundColor: '#333',
                color: '#fff',
                height: '55px'
            },
        },
        cells: {
            style: {
                textAlign: 'center'
            }
        }
    };
    

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
            {(error && !isData && !loader) && (
                <ErrorComponent customStyle={{ padding: "4.8rem 2rem" }} text="Unable to fetch, Check Your Connection" />
            )}

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
                            <TableSkeleton title={name} />
                        </div>
                    )}
                </>
            )}

            {(!loader && isData) && (
                <>
                    <div className='table--head' style={displayType == "grid" ? { borderRadius: "0.4rem" } : {}}>
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
                            persistTableHead
                            noDataComponent={false}
                            customStyles={customStyles}
                            selectableRows={selectableRows}
                            onSelectedRowsChange={handleSelectedRow}
                            {...( goto && { highlightOnHover: width > 600 ? true : false })}
                            {...(goto && { onRowClicked: (row) => handleNavigate(row) })}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default TableUI