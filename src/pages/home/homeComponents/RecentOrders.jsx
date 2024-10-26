import React from 'react'
import DataTable from 'react-data-table-component'
import { capitalizeFirstLetter, formatDate, formatNumber } from '../../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';

import { facebook, online_store, physical_store, instagram,whatsapp, twitter, flutterwave_store, others, jiji, jumia, konga } from '../../../assets/images/index';
import TooltipUI from '../../../components/TooltipUI';
import Empty from '../../../components/Empty';
import { useFetchedContext } from '../../../context/FetchedContext';
import { useWindowSize } from 'react-use';
import TableError from '../../../components/TableError';


function imgString(imgType) {
    if (imgType === 'online store') return online_store;
    if (imgType === 'facebook') return facebook;
    if (imgType === 'physical shop') return physical_store;
    if (imgType === 'instagram') return instagram;
    if (imgType === 'whatsapp') return whatsapp;
    if (imgType === 'twitter') return twitter;
    if (imgType === 'flutterwave store') return flutterwave_store;
    if (imgType === 'jiji') return jiji;
    if (imgType === 'jumia') return jumia;
    if (imgType === 'konga') return konga;
    if (imgType === 'others') return others;
}

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
    const recentOrders = orders?.slice(0, 5);

    return (
        <div className='card recent-section' style={{ padding: 0 }}>
            <div className="section--top" style={{ padding: '2rem', width: "100%" }}>

                <div className="section--heading" style={ width < 450 ? { width: "100%"} : {}}>
                    <span className='flex' style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <h2>Recent Order </h2>
                        {width < 450 && <Link to="/dashboard/orders/">View-more</Link>}
                    </span>
                    <p>Five most recent order for you!</p>
                </div>

                {width > 450 && <Link to="/dashboard/orders/">View-more</Link>}
            </div>

            <>
                {(error?.order && !isData) && <TableError text="Unable to fetch, Check Your Connection" />}
                
                {(isData && !error?.order) && (
                    <div className="table-h" style={(orders && orders?.length < 3) ? { paddingBottom: width < 850 ? "2.8rem" : "4.8rem" } : {} }>
                        <DataTable
                            data={recentOrders}
                            columns={columns}
                            pointerOnHover={true}
                            customStyles={customStyles}
                            onRowClicked={(row) => navigate(`/dashboard/orders/${row.id}`)}
                            noDataComponent={<Empty customStyle={{ margin: "3rem 0" }} text="recent orders yet!" />}
                        />
                    </div>
                )}
                
            </>
        </div>
    )
}

export default RecentOrders