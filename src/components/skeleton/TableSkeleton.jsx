import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { useWindowSize } from 'react-use'

export function TableSkeleton({ title }) {
    const { width } = useWindowSize();
    const count = (title == "product") ? 3 : 2;
    const height = 9;


    return (
        <div style={{ minWidth: "90rem" }}>
            <Skeleton height={45} />
            <div className='table--grid' style={{ marginTop: "0.5rem" }}>
                <Skeleton height={height} count={count} />
                <Skeleton height={height} count={count} />
                <Skeleton height={height} count={count} />
                <Skeleton height={height} count={count} />
            </div>
            <div className='table--grid'>
                <Skeleton height={height} count={count} />
                <Skeleton height={height} count={count} />
                <Skeleton height={height} count={count} />
                <Skeleton height={height} count={count} />
            </div>

            <div style={width <= 450 ? { padding: "1rem 0", marginLeft: "unset", width: "100%" } : { padding: "1rem 2rem 2rem", marginLeft: "auto", width: "54rem" }}>
                <Skeleton height={15} width={500} />
            </div>
        </div>
    )
}


export function TableHeadSkeleton({ title }) {
    const { width } = useWindowSize();

    return (
        <>
            {(title == "delivery" || title == "collection" || title == "expenses" || title == "coupon" || title == "discount") ? (
                <div className='table--head'>
                    <div className='content'>
                        <Skeleton height={40} width={50} />
                    </div>
                </div>
            ) : (
                <div className='table--head'>
                    <div className='content'>
                        <span className='flex'>
                            <Skeleton height={40} width={50} />
                            <div style={{ width: "100%" }}>
                                <Skeleton height={40} width={width > 580 && 150} />
                            </div>
                        </span>

                        <span className='flex' style={{ justifyContent: "space-between" }}>
                            <span className='flex'>
                                <Skeleton height={40} width={100} />
                                <Skeleton height={40} width={60} />
                            </span>
                            {title == "product" && (
                                <Skeleton height={40} width={60} />
                            )}
                        </span>
                    </div>
                </div>
            )}
        </>
    )
}


// export function TableCellSkeleton({ title }) {
//     const count = (title == "product") ? 3 : 2;
//     const height = 9;

//     return (
//         <div style={{ minWidth: "90rem", padding: ".68rem .28rem", marginLeft: "-10rem" }}>
//             <div className='table--grid' style={{ marginTop: "0.5rem" }}>
//                 <Skeleton height={height} count={count} />
//                 <Skeleton height={height} count={count} />
//                 <Skeleton height={height} count={count} />
//                 <Skeleton height={height} count={count} />
//             </div>
//         </div>
//     )
// }