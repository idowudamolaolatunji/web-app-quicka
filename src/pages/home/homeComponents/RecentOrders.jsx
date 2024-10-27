import React from 'react'
import DataTable from 'react-data-table-component'
import { capitalizeFirstLetter, formatDate, formatNumber } from '../../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';

import TooltipUI from '../../../components/TooltipUI';
import Empty from '../../../components/Empty';
import { useFetchedContext } from '../../../context/FetchedContext';
import { useWindowSize } from 'react-use';
import ErrorComponent from '../../../components/ErrorComponent';
import { imgString } from '../../../assets/images';


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
            height: '45px'
		},
	},
	rows: {
        style: {
            minHeight: '70px',
            cursor: 'pointer'
        },
    },
    headCells: {
		style: {
			paddingRight: '5px',
            backgroundColor: '#333',
            height: '45px'
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
            <TooltipUI placement='top' title={capitalizeFirstLetter(row.channel)}>
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
        name: 'Custumer Name', selector: row => row.customer?.name || "-- Not Added --",
        width: '150px'
    },
    {
        name: 'Product', selector: row => (
            <ul className='table--list'>
                {row.products?.map(product => (
                    <li key={product?.name}>{product?.name}</li>
                ))}
            </ul>
        ),
        width: '150px'
    },
    {
        name: 'Amount', selector: row => (
            <span className='value'>₦{formatNumber(row?.orderPrice)}</span>
        ),
        width: '100px'
    },
    {
        name: 'Payment', selector: row => (
            <span className={`status status--${( row.paymentStatus != "unpaid" ? "success" : "pending" )}`}>
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
        name: 'Date', selector: row => (
            <TooltipUI placement='top' title={formatDate(row.orderDate)}>
                <p>{formatDate(row.orderDate)}</p>
            </TooltipUI>
        ), width: '150px'
    },
];


function RecentOrders() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { orders, error } = useFetchedContext();

    const isData = orders?.length > 0;
    const recentOrders = orders?.slice(0, 3);

    return (
        <div className='card recent-section' style={{ padding: 0 }}>
            <div className="section--top" style={{ padding: '2rem' }}>

                <div className="section--heading" style={ width < 450 ? { width: "100%"} : {}}>
                    <span className='flex' style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <h2>Recent Order </h2>
                        {width < 450 && <Link to="/dashboard/orders/">View-more</Link>}
                    </span>
                    <p>Three new & recent order for you!</p>
                </div>

                {width > 450 && <Link to="/dashboard/orders/">View-more</Link>}
            </div>

            <>
                {(error?.order && !isData) && <ErrorComponent text="Unable to fetch orders, Check Your Connection" />}
                
                {(orders && !error?.order) && (
                    <div className="table-h" style={(orders && orders?.length < 3) ? { paddingBottom: width < 850 ? "2.8rem" : "4.8rem" } : {} }>
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
                
            </>
        </div>
    )
}

export default RecentOrders