import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../../context/AuthContext';
import { useFetchedContext } from '../../../context/FetchedContext';
import Line from '../../../components/elements/Line';
import BackButton from '../../../components/button/BackButton';
import Spinner from '../../../components/spinner/mainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';
import Delete from '../../../components/modal/Delete';


export default function DiscountItem() {
    const title = "discount"
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreDiscounts } = useFetchedContext();

    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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

    useEffect(function() {
        window.scrollTo(0, 0);
        document.title = `Quicka | Discount Details`;
    }, [item]);


    useEffect(function () {
        getItem();
    }, [id]);

    
    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(title+"s", item?._id);
            setResponse({ message: "Successful!", response: "success" })
            handleFetchMyStoreDiscounts();
            
            setTimeout(function() {
                navigate(-1)
                setShowDeleteModal(false);
            }, 1000)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


  return (
    <React.Fragment>
        {showDeleteModal && (
            <Delete
                title={`"Customer"`}
                close={setShowDeleteModal} 
                fn={deleteItem}
            />
        )}

        {(response.message || response.status) && (
            <CustomAlert type={response.status} message={response.message} />
        )}

        {(error && !item && !loading) ? (
            <div style={{ height: "28rem" }} className='flex-align-center'>
                <ErrorComponent />
            </div>
        ) : (loading && !item && !error) ? (
            <Spinner />
        ) : (
            <div className='item__preview--section'>
                <div className='page__section--heading' style={{ alignItems: "flex-start" }}>
                    <span style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <BackButton close={() => navigate(-1)} />

                        <div className="heading--row" style={{ flexWrap: "wrap" }}>
                            <h2 className="page__section--title">
                                Disscount Details
                            </h2>
                        </div>
                    </span>

                    {/* hed based thingss go here */}
                </div>

                {/* Section based things go here */}


                <div className="item__preview--grid grid--2x1">
                    <div className="left--side">
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Title</h2>
                                <Line border={1.4} where="Top" value="1rem" />
                            </div>

                            {/*  */}
                        </div>

                        {/*  */}
                    </div>

                    <div className="right--side">
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Contact</h2>
                                <Line border={1.4} where="Top" value="1rem" />
                            </div>

                            {/*  */}
                        </div>

                        {/*  */}
                    </div>
                </div>
            </div>
        )}
    </React.Fragment>

  )
}
