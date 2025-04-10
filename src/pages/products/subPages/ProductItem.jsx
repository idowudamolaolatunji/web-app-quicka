import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { useParams } from 'react-router-dom';
import { GoDotFill } from 'react-icons/go';
import Spinner from '../../../components/spinner/mainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';


function ProductItem() {
    const title = "product"
    const { id } = useParams();
    const { handleFetchOneItem } = useFetchedContext();
    
    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////


    const getItem = async function () {
        try {
            const data = await handleFetchOneItem(title, id);
            if (!data) throw new Error("Connection Error");
            setItem(data)
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function() {
        window.scrollTo(0, 0);
        document.title = `Quicka | Product Item: #${item?.productId}`;
    }, [item]);

    
    useEffect(function () {
        getItem();
    }, [id])


    const PageTitle = function () {
        return (
            <React.Fragment>
                {item?.name}
                <span className={`status status--${(item?.status)}`}>
                    <p><GoDotFill />{item?.status}</p>
                </span>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {loading && <Spinner />}
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

           
            <p>Product</p>

        </React.Fragment>
    )
}

export default ProductItem