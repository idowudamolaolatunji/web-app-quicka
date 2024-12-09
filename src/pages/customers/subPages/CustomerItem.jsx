import React, { useEffect, useState } from 'react'
import ItemPreviewPageUI from '../../../ui/PageUI/ItemPreviewPageUI'
import { useParams } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import { GoDotFill } from 'react-icons/go';
import { formatDateSince } from '../../../utils/helper';
import Insight from '../../../components/Insight';

function CustomerItem() {
    const title = "customer"
    const { id } = useParams();
    const { handleFetchItem } = useFetchedContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////

    const getItem = async function () {
        setError(false);
        try {
            const data = await handleFetchItem(title, id);
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
    }, [id])

    return (
        <>
            <ItemPreviewPageUI
                pageType={title}
                pageTitle={item?.fullname || "Customer Profile"}
                item={item}
                loading={loading}
                extraInfo={
                    <span style={{ fontSize: "1.24rem", fontWeight: "500", color: "#888", marginTop: ".8rem" }}>
                        {item?.shippingAddress?.country || "Null"} &bull; Customer Since, {formatDateSince(item?.createdAt)}
                    </span>
                }
            >

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
            </ItemPreviewPageUI>
        </>
    )
}

export default CustomerItem