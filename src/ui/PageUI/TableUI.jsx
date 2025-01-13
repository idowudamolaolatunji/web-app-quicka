import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import CheckBoxInput from '../../components/form/CheckBoxInput';
import { RiDeleteBin5Line } from 'react-icons/ri';
import ProductCard from '../../components/layout/ProductCard';
import ErrorComponent from '../../components/layout/ErrorComponent';
import ProductCardSkeleton from '../../components/skeleton/ProductCardSkeleton';
import { TableCellSkeleton, TableHeadSkeleton, TableSkeleton } from '../../components/skeleton/TableSkeleton';


function TableUI({ name, columns, data, toLink, hasLink, emptyComponent, headTabs,
    selectableRows, displayType = "table", open, loader, error, searchLoader, pointOnHover,
}) {
    
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
                fontSize: "1.48rem",
                fontWeight: "500",
                height: width < 450 ? "4.5rem" : "5rem",
            },
        },
        rows: {
            style: {
                minHeight: width < 450 ? "7rem" : (name == "product" ? "8rem" : "7rem"),
                cursor: 'pointer',
                fontSize: "1.32rem",
                fontWeight: 500,
                color: "#444444"
            },
        },
        headCells: {
            style: {
                paddingRight: '0.5rem',
                backgroundColor: '#343434',
                color: '#fff',
                height: width < 450 ? "4.5rem" : "5rem",
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
                <ErrorComponent customStyle={{ padding: "4.8rem 2rem" }} />
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
                                <ProductCard key={data._id} product={data} open={open} />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            data={data}
                            columns={columns}
                            pagination
                            pointerOnHover={pointOnHover}
                            persistTableHead
                            noDataComponent={false}
                            customStyles={customStyles}
                            selectableRows={selectableRows}
                            onSelectedRowsChange={handleSelectedRow}
                            progressPending={searchLoader}
                            progressComponent={<TableCellSkeleton title={name} />}
                            {...( hasLink && { highlightOnHover: width > 600 ? true : false })}
                            {...(hasLink && { onRowClicked: (row) => handleNavigate(row) })}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default TableUI