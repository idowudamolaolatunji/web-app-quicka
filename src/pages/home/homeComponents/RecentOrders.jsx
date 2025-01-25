import React from 'react'
import DataTable from 'react-data-table-component'
import { cap1stLetter, formatDate, formatNumber, truncateString } from '../../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';

import TooltipUI from '../../../components/layout/TooltipUI';
import Empty from '../../../components/layout/Empty';
import { useFetchedContext } from '../../../context/FetchedContext';
import { useWindowSize } from 'react-use';
import ErrorComponent from '../../../components/layout/ErrorComponent';
import { imgString } from '../../../assets/images/png_elements';
import { GoDotFill } from 'react-icons/go';
import { useAuthContext } from '../../../context/AuthContext';


function RecentOrders() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { orders, error } = useFetchedContext();
    
    const currency = store?.currency?.symbol;

    const isData = orders?.length > 0;
    const recentOrders = orders?.slice(0, 3);
    /////////////////////////////////////////////

    const customStyles = {
        table: {
            style: {
                overflowX: 'auto',
            },
        },    
        head: {
            style: {
                fontSize: "14px",
                fontWeight: "500",
                color: "#eee",
                height: width < 450 ? "4rem" : "4.5rem"
            },
        },
        rows: {
            style: {
                minHeight: '6rem',
                cursor: 'pointer'
            },
        },
        headCells: {
            style: {
                paddingRight: '5px',
                backgroundColor: '#343434',
                height: width < 450 ? "4rem" : "4.5rem"
            },
        },
        cells: {
            style: {
                textAlign: 'center'
            }
        }
    };

    const columns = [
        {
            name: 'Channel', selector: row => (
                <TooltipUI placement='top' title={cap1stLetter(row.channel)}>
                    <img width={'40px'} alt={row.channel} src={imgString(row.channel)} />
                </TooltipUI>
            ), width: '70px'
        },
        {
            name: 'Order Id', selector: row => (
                <p className='value'>{row.orderId}</p>
            ), width: '100px'
        },
        {
            name: 'Custumer', selector: row => row.customer?.name || "-- Not Added --",
            width: '150px'
        },
        {
            name: 'Product', selector: row => (
                <TooltipUI placement='top' title={
                    <ul className='table--list'>
                        {row.products?.map((item, index) => (
                            <li key={index}><GoDotFill /> {item?.name}</li>
                        ))}
                    </ul>
                }>
                    <ul className='table--list'>
                        {row.products?.slice(0, 3)?.map((item, index) => (
                            <li key={index}><GoDotFill /> {truncateString(item?.name, 18)}</li>
                        ))}
                        {row.products?.length > 3 && <li>...</li>}
                    </ul>
                </TooltipUI>
            ),
            width: '180px'
        },
        {
            name: 'Amount', selector: row => (
                <span className='value'>{currency}{formatNumber(row?.profit)}</span>
            ),
            width: '100px'
        },
        {
            name: 'Payment', selector: row => (
                <span className={`status status--${( row?.paymentStatus != "unpaid" ? "success" : "pending" )}`}>
                    <p>{row.paymentStatus}</p>
                </span>
            ),
            width: '120px'
        },
        {
            name: 'Delievery', selector: row => (
                <span className={`status status--${(row.deliveryStatus)}`}>
                    <p>{row.deliveryStatus}</p>
                </span>
            ),
            width: '135px'
        },
        {
            name: 'Status', selector: row => (
                <span className={`status status--${(row.orderStatus)}`}>
                    <p>{row.orderStatus}</p>
                </span>
            ),
            width: '120px'
        },
        {
            name: 'Date Ordered', selector: row => (
                <TooltipUI placement='top' title={formatDate(row.orderDate)}>
                    <p>{formatDate(row.orderDate)}</p>
                </TooltipUI>
            ), width: '150px'
        },
    ];


    return (
        <div className='card recent-section' style={{ padding: 0 }}>
            <div className="section--top" style={{ padding: '2rem' }}>

                <div className="section--heading" style={ width < 450 ? { width: "100%"} : {}}>
                    <span className='flex' style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <h2>Recent Order </h2>
                        {(width < 450 && isData) && <Link to="/dashboard/orders/">View more</Link>}
                    </span>
                    <p>Three most recent order for you!</p>
                </div>

                {(width > 450 && isData) && <Link to="/dashboard/orders/">View more</Link>}
            </div>

            {(error?.order && !isData) && <ErrorComponent text={error?.order} />}
            
            {(orders && !error?.order) && (
                <div className="table-h" style={(orders && orders?.length < 2) ? { paddingBottom: width < 850 ? "1.8rem" : "2.8rem" } : {} }>
                    <DataTable
                        data={recentOrders}
                        columns={columns}
                        pointerOnHover={true}
                        customStyles={customStyles}
                        onRowClicked={(row) => navigate(`/dashboard/orders/${row.id}`)}
                        noDataComponent={<Empty text="recent orders yet!" />}
                    />
                </div>
            )}
        </div>
    )
}

export default RecentOrders