import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../context/FetchedContext';
import { useParams } from 'react-router-dom';
import ItemPreviewPageUI from '../../ui/PageUI/ItemPreviewPageUI';

function OrderItem() {
    const title = "product"
    const { id } = useParams();
    const { handleFetchItem } = useFetchedContext();
    // const [loading, setLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////

    const getItem = async function () {
        try {
            const data = await handleFetchItem(title, id);
            setItem(data)
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function () {
        // getItem();
    }, [id])

    return (
        <>
            <ItemPreviewPageUI
                pageType={title}
                pageTitle="Product Details"
                loading={loading}
            >
                <p>Product</p>
            </ItemPreviewPageUI>
        </>
    )
}

export default OrderItem