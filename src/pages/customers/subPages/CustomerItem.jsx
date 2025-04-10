import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import { GoDotFill } from 'react-icons/go';
import { formatDateSince } from '../../../utils/helper';
import Insight from '../../../components/layout/Insight';
import Spinner from '../../../components/spinner/mainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';


export default function CustomerItem() {
    const title = "customer"
    const { id } = useParams();
    const { handleFetchOneItem } = useFetchedContext();
   
    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////

    const getItem = async function () {
        setError(false);
        try {
            const data = await handleFetchOneItem(title, id);
            if(!data) throw new Error("Connection Error");
            setItem(data)
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function () {
        getItem();
    }, [id]);

    return (
        <React.Fragment>

            {loading && <Spinner />}
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}


            <div className="item__preview--grid grid--2x1">
                <div className="left--side">
                    <div className="card">
                        <div className="section--heading">
                            <h2>Brief Overview</h2>
                        </div>

                        
                    </div>


                    <div className="card">
                        <div className="section--heading">
                            <h2>Brief Overview</h2>
                        </div>


                    </div>
                </div>

                <div className="right--side">
                    <div className="card">

                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}