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
import { formatNumber } from '../../utils/helper';
import { Checkbox } from '@mui/material';


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
                fontSize: "1.5rem",
                fontWeight: "500",
                height: width < 450 ? "4.5rem" : "5rem",
            },
        },
        rows: {
            style: {
                minHeight: width < 450 ? "7rem" : (name == "product" ? "8rem" : "7rem"),
                cursor: 'pointer',
                fontSize: "1.34rem",
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


    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    function convertArrayOfObjectsToCSV(array) {
        let result;
    
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(data[0]);
    
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
    
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;
    
                result += item[key];
                
                ctr++;
            });
            result += lineDelimiter;
        });
    
        return result;
    }
    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;
    
        const filename = 'export.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }
    const Export = ({ onExport }) => <button onClick={e => onExport(e.target.value)}>Export</button>;
	const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////



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
                            <span className='flex' style={{ gap: "1.6rem" }}>
                                <p>
                                    <span style={{ fontSize: "1.28rem", marginRight: ".48rem" }}>
                                        Selected Items:
                                    </span>
                                    <span className='value'>
                                        {formatNumber(selectedRowsId.length)}
                                    </span>
                                </p>
                                <button className='table--btn'>delete <RiDeleteBin5Line /></button>
                            </span>
                        ) : (
                            <React.Fragment>
                                {headTabs}
                            </React.Fragment>
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
                            // actions={actionsMemo}
                            // selectableRowsComponent={Checkbox}
                            paginationRowsPerPageOptions={[5, 10, 25, 50]}
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