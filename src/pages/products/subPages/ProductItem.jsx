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


    const getItem = async function () {
        console.log("me")
        
        try {
            console.log("me2", id)
            const data = await handleFetchItem(title, id);
            console.log("me3")
            if (!data) throw new Error("Connection Error");
            setItem(data)
            console.log("me3")
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function() {
        window.scrollTo(0, 0);
        document.title = `Quicka | Product Item ${item?.name}`;
    }, [item]);

    useEffect(function () {
        getItem();
    }, [id])


    const PageTitle = function () {
        return (
            <>
                {item?.name}
                <span className={`status status--${(item?.status)}`}>
                    <p><GoDotFill />{item?.status}</p>
                </span>
            </>
        )
    }

    return (
        <>
            <ItemPreviewPageUI
                pageType={title}
                item={item}
                pageTitle={item?.name ? <PageTitle /> : "Product Details"}
                loading={loading}
            >
                <p>Product</p>
            </ItemPreviewPageUI>
        </>
    )
}

export default ProductItem