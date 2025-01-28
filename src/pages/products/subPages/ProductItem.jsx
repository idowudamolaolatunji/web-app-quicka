import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { useParams } from 'react-router-dom';
import ItemPreviewPageUI from '../../../ui/PageUI/ItemPreviewPageUI';
import { GoDotFill } from 'react-icons/go';


function ProductItem() {
    const title = "product"
    const { id } = useParams();
    const { handleFetchItem } = useFetchedContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////

    const Title = function () {
        return (
            <>
                {item?.name}
                <span className={`status status--${(item?.status)}`}>
                    <p><GoDotFill />{item?.status}</p>
                </span>
            </>
        )
    }

    const getItem = async function () {
        setError(false)
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
                pageTitle={item?.name ? <Title /> : "Product Details"}
                loading={loading}
            >
                <p>Product</p>
            </ItemPreviewPageUI>
        </>
    )
}

export default ProductItem