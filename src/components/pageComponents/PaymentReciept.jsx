import React from 'react'
import { capAllFirstLetters, formatNumber } from '../../utils/helper'


const styles = {
  recieptContainer: {
    padding: '3rem',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    height: '100%',
    fontFamily: '"Montserrat", sans-serif',
  },
  recieptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6rem',
  },
  img: {
    width: '8rem',
    height: '8rem',
  },
  recieptTitle: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
    color: '#333',
  },
  recieptNumber: {
    fontSize: '1.4rem',
    color: '#666',
  },
  businessInfo: {
    textAlign: 'right',
  },
  businessName: {
    fontWeight: 'bold',
  },
  businessAddress: {
    fontSize: '1.4rem',
    color: '#666',
  },
  deliveredTo: {
    marginBottom: '3.2rem',
  },
  deliveredToTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1.6rem',
  },
  customerInfo: {
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  customerInfoP: {
    fontSize: '1.4rem',
    fontWeight: 500,
  },
  customerInfoPSpan: {
    fontWeight: 600,
  },
  recieptTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '3.2rem',
  },
  tableHeader: {
    backgroundColor: '#f7f7f7',
  },
  tableHeaderCell: {
    border: '1px solid #ccc',
    padding: '2.4rem 1.2rem',
    textAlign: 'left',
    backgroundColor: '#ddd',
  },
  tableCell: {
    border: '1px solid #ccc',
    padding: '2rem 1rem',
  },
  textRight: {
    textAlign: 'right',
  },
  recieptTotal: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  totalContainer: {
    width: '35rem',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #ddd',
  },
  totalRowSpanLastChild: {
    fontWeight: 500,
  },
  totalFinal: {
    fontWeight: 'bold',
    fontSize: '1.8rem',
  },
};


export default function PaymentReciept({ item }) {
  const currency = item?.currency?.symbol;

//   return (
//     <div className="invoice-container">
//       <div className="invoice-header">
//         <div>
//           <h1 className="invoice-title">Reciept</h1>
//           <p className="invoice-number">Order ID #{item?.orderId}</p>
//         </div>

//         <div className="company-info">
//           <img src={item?.storeLogo?.url} alt={item?.name} className='img' />
//           <h2 className="company-name">{item?.name}</h2>
//           <p className="company-address">{item?.storeUrl}</p>
//           <p className="company-address">+{item?.contact?.phone}</p>
//           <p className="company-address">{item?.contact?.email}</p>
//           <p className="company-address">{item?.location?.address}</p>
//         </div>
//       </div>
//       <div className="bill-to">
//         <h3 className="bill-to-title">Delivered To:</h3>
//         <p className="client-info">
//           <p className='flex-align-center'><span>Name:</span> {item?.customer?.firstname ? capAllFirstLetters(item?.customer?.fullname) : "--None Selected --"}</p>
//           <p className='flex-align-center'><span>Address:</span> {item?.addressDetails?.address || "-- Not Included --"}</p>
//           <p className='flex-align-center'><span>Payment Status:</span> {item?.paymentStatus}</p>
//         </p>
//       </div>
//       <table className="invoice-table">
//         <thead>
//           <tr className="table-header">
//             <th className="table-header-cell">Description</th>
//             <th className="table-header-cell text-right">Quantity</th>
//             <th className="table-header-cell text-right">Price</th>
//             <th className="table-header-cell text-right">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {item?.products?.map(product => (
//             <tr key={product?.id}>
//               <td className="table-cell">{product?.name || "--"}</td>
//               <td className="table-cell text-right">{product?.quantity || 1}</td>
//               <td className="table-cell text-right">{currency}{formatNumber(product?.price || 0)}</td>
//               <td className="table-cell text-right">{currency}{formatNumber(product?.price * product?.quantity || 0)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="invoice-total">
//         <div className="total-container">
//           <div className="total-row">
//             <span>Subtotal:</span>
//             <span>{currency}{formatNumber(item?.profit)}</span>
//           </div>
//           <div className="total-row">
//             <span>Delivery Fee:</span>
//             <span>{currency}{formatNumber(item?.orderDeliveryFee)}</span>
//           </div>
//           <div className="total-row">
//             <span>Total:</span>
//             <span>{currency}{formatNumber(item?.orderSubTotal)}</span>
//           </div>
//           <div className="total-row">
//             <span>Paid By Customer:</span>
//             <span>{item?.paymentStatus == "paid" ? `${currency}${formatNumber(item?.orderSubTotal)}` : "Partial"}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
return (
    <div style={styles.recieptContainer}>
      <div style={styles.recieptHeader}>
        <div>
          <h1 style={styles.recieptTitle}>Reciept</h1>
          <p style={styles.recieptNumber}>Order ID #{item?.orderId}</p>
        </div>
        <div style={styles.businessInfo}>
          <img src={item?.storeLogo?.url} alt={item?.name} style={styles.img} />
          <h2 style={styles.businessName}>{item?.name}</h2>
          <p style={styles.businessAddress}>{item?.storeUrl}</p>
          <p style={styles.businessAddress}>+{item?.contact?.phone}</p>
          <p style={styles.businessAddress}>{item?.contact?.email}</p>
          <p style={styles.businessAddress}>{item?.location?.address}</p>
        </div>
      </div>
      <div style={styles.deliveredTo}>
        <h3 style={styles.deliveredToTitle}>Delivered To:</h3>
        <div style={styles.customerInfo}>
          <p style={styles.customerInfoP}>
            <span style={styles.customerInfoPSpan}>Name:</span>{' '}
            {item?.customer?.firstname ? capAllFirstLetters(item?.customer?.fullname) : '--None Selected --'}
          </p>
          <p style={styles.customerInfoP}>
            <span style={styles.customerInfoPSpan}>Address:</span>{' '}
            {item?.addressDetails?.address || '-- Not Included --'}
          </p>
          <p style={styles.customerInfoP}>
            <span style={styles.customerInfoPSpan}>Payment Status:</span>{' '}
            {item?.paymentStatus}
          </p>
        </div>
      </div>
      <table style={styles.recieptTable}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableHeaderCell}>Description</th>
            <th style={{ ...styles.tableHeaderCell, ...styles.textRight }}>Quantity</th>
            <th style={{ ...styles.tableHeaderCell, ...styles.textRight }}>Price</th>
            <th style={{ ...styles.tableHeaderCell, ...styles.textRight }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {item?.products?.map((product) => (
            <tr key={product?.id}>
              <td style={styles.tableCell}>{product?.name || '--'}</td>
              <td style={{ ...styles.tableCell, ...styles.textRight }}>{product?.quantity || 1}</td>
              <td style={{ ...styles.tableCell, ...styles.textRight }}>
                {currency}
                {formatNumber(product?.price || 0)}
              </td>
              <td style={{ ...styles.tableCell, ...styles.textRight }}>
                {currency}
                {formatNumber(product?.price * product?.quantity || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.recieptTotal}>
        <div style={styles.totalContainer}>
          <div style={styles.totalRow}>
            <span>Subtotal:</span>
            <span>
              {currency}
              {formatNumber(item?.profit)}
            </span>
          </div>
          <div style={styles.totalRow}>
            <span>Delivery Fee:</span>
            <span>
              {currency}
              {formatNumber(item?.orderDeliveryFee)}
            </span>
          </div>
          <div style={styles.totalRow}>
            <span>Total:</span>
            <span>
              {currency}
              {formatNumber(item?.orderSubTotal)}
            </span>
          </div>
          <div style={styles.totalRow}>
            <span>Paid By Customer:</span>
            <span>
              {item?.paymentStatus == 'paid'
                ? `${currency}${formatNumber(item?.orderSubTotal)}`
                : 'Partial'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

}
