import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { RiDeleteBin5Line } from 'react-icons/ri';
import ProductCard from '../../components/layout/ProductCard';
import ErrorComponent from '../../components/layout/ErrorComponent';
import ProductCardSkeleton from '../../components/skeleton/ProductCardSkeleton';
import { TableCellSkeleton, TableHeadSkeleton, TableSkeleton } from '../../components/skeleton/TableSkeleton';
import { formatNumber } from '../../utils/helper';
import TableHeadTabs from '../../components/pageComponents/TableHeadTabs';


export default function TableUI({ name, columns, data, toLink, hasLink, hasDetailModal, emptyComponent,
    selectableRows, displayType = "table", open, loader, error, pointOnHover,
    setDetailModal, refetchItems, searchKey, inputPlaceholder
}) {
    
    const isData = data?.length > 0;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchedItems, setSearchedItems] = useState(null);
    
    ///////////////////////////////////////////////////////////////
    const [selectedRowsId, setSelectedRowsId] = useState([]);
    const [isRowSelected, setIsRowSelected] = useState(true);
    ///////////////////////////////////////////////////////////////

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
                minHeight: width < 450 ? "6.7rem" : (
                    name == "product" ? "8rem" : 
                    (name == "order" || name == "customer" || name == "transaction") ? "7rem" : "6rem"
                ),
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
        selectedRows?.map(row => ids.push(row?._id));
        setSelectedRowsId(ids);
    }

    const handleNavigate = function(row) {
        navigate(`${toLink}/${row[name == "product" ? "productId" : "_id"]}`);
    }

    const handleShowModal = function(row) {
        setDetailModal({ show: true, selectedData: row })
    }

    useEffect(function() {
        if(searchQuery && searchQuery?.length > 0) {
            setSearchLoader(true);
            setSearchedItems(data?.filter(item => {
                if (Array.isArray(searchKey)) {
                    return searchKey.some(key => item[key]?.toLowerCase()?.includes(searchQuery.toLowerCase()));
                } else {
                    return item[searchKey] && item[searchKey]?.toLowerCase()?.includes(searchQuery.toLowerCase());
                }

            }));

            setTimeout(() => setSearchLoader(false), 1000);
        } else {
            setSearchedItems(null);
        }
        
    }, [searchKey, searchQuery])

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
        <React.Fragment>
            {(error && !isData && !loader) && (
                <ErrorComponent text={error} customStyle={{ padding: "4.8rem 2rem" }} />
            )}

            {((!isData && !error && !loader) && <>{emptyComponent}</>)}

            {loader && (
                <React.Fragment>
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
                </React.Fragment>
            )}

            {(!loader && isData) && (
                <React.Fragment>
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
                                <span className="flex-align-center">
                                    <button className='table--btn delete'>Delete <RiDeleteBin5Line /></button>
                                    <button className='table--btn' onClick={() => {
                                        setSelectedRowsId([]);
                                        setIsRowSelected(!isRowSelected)
                                    }}>Cancel</button>
                                </span>
                            </span>
                        ) : (
                            <React.Fragment>
                                <TableHeadTabs pageName={name} searchVal={searchQuery} setSearchVal={setSearchQuery} inputPlaceholder={inputPlaceholder} handleFetch={refetchItems} />
                            </React.Fragment>
                        )}
                    </div>

                    {searchLoader ? (
                        <React.Fragment>
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
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {displayType == "grid" ? (
                                <div className='product__grid'>
                                    {data.map(data => (
                                        <ProductCard key={data._id} product={data} open={open} />
                                    ))}
                                </div>
                            ) : (
                                <DataTable
                                    // actions={actionsMemo}
                                    paginationRowsPerPageOptions={[10, 25, 50]}
                                    data={searchedItems ? searchedItems : data}
                                    columns={columns}
                                    pagination
                                    pointerOnHover={pointOnHover}
                                    persistTableHead
                                    noDataComponent={(isData && searchQuery && searchedItems?.length < 1) ? <p>No Data</p> : false}
                                    customStyles={customStyles}
                                    selectableRows={selectableRows}
                                    onSelectedRowsChange={handleSelectedRow}
                                    progressPending={searchLoader}
                                    clearSelectedRows={isRowSelected}
                                    progressComponent={<TableCellSkeleton title={name} />}
                                    {...( hasLink && { highlightOnHover: width > 600 ? true : false })}
                                    {...(hasLink && { onRowClicked: (row) => handleNavigate(row) })}
                                    {...(hasDetailModal && { onRowClicked: (row) => handleShowModal(row) })}
                                />
                            )}
                        </React.Fragment>
                    )}

                </React.Fragment>
            )}
        </React.Fragment>
    )
}