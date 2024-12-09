import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { useParams } from 'react-router-dom';
import ItemPreviewPageUI from '../../../ui/PageUI/ItemPreviewPageUI';

function OrderItem() {
    const title = "order"
    const { id } = useParams();
    const { handleFetchItem } = useFetchedContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////

    const Title = function () {
        return (
            <>
                Order{" "}
                <span className='value' style={{ fontSize: "2rem" }}>
                    {item?.orderId}
                </span>
                {" "}Details
            </>
        )
    }

    const getItem = async function () {
        setError(false);
        try {
            const data = await handleFetchItem(title, id);
            if (!data) throw new Error("Connection Error");
            setItem(data)
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function () {
        getItem();
    }, [id])

    return (
        <>
            <ItemPreviewPageUI
                pageType={title}
                item={item}
                pageTitle={item?.orderId ? <Title /> : "Order Details"}
                loading={loading}
            >
                <p>Order</p>
            </ItemPreviewPageUI>
        </>
    )
}

export default OrderItem