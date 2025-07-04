import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../../context/AuthContext';
import Delete from '../../../components/modal/Delete';
import { useFetchedContext } from '../../../context/FetchedContext';
import ErrorComponent from '../../../components/layout/ErrorComponent';
import CustomAlert from '../../../components/layout/CustomAlert';
import Spinner from '../../../components/spinner/MainSpinner';
import BackButton from '../../../components/button/BackButton';
import { RiDeleteBin5Line, RiEdit2Fill } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { capAllFirstLetters } from '../../../utils/helper';



export default function SupplierItem() {
    const title = "supplier"
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreSuppliers } = useFetchedContext();


    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


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
        document.title = `Quicka - Supplier Details: ${capAllFirstLetters(item?.fullname) || "Loading.."} | Business Management Tool for SME's`;

    }, [item]);
    
    
    useEffect(function () {
        setLoading(true);
        getItem();
    }, [id]);
    
    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`${title}s/${item?._id}`);
            setResponse({ message: "Successful!", response: "success" })
            handleFetchMyStoreSuppliers();
            
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

    if(!item && error) {
        return (
            <div style={{ height: "28rem" }} className='flex-align-center'>
                <ErrorComponent />
            </div>
        )
    }


    return (
        <React.Fragment>

            {showDeleteModal && (
                <Delete
                    title={`"Supplier"`}
                    close={setShowDeleteModal} 
                    fn={deleteItem}
                />
            )}

            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            {(loading && !item) ? (
                <Spinner />
            ) : (
                <div className='item__preview--section'>
                    <div className='page__section--heading' style={{ alignItems: "flex-start" }}>
                        <span style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                            <BackButton close={() => navigate(-1)} />

                            <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                <h2 className="page__section--title">
                                    Supplier Details
                                </h2>
                            </div>
                        </span>

                        <span className='page__section--btns'>
                            <button className="page__section-top-btn" onClick={() => navigate("edit")} style={{ fontWeight: "600", color: "#444" }}>
                                Edit Details<RiEdit2Fill size={20} />
                            </button>
                            <button className="page__section-top-btn add" onClick={() => setShowDeleteModal(true)} style={{ fontWeight: "600", color: "#444" }}>
                                Delete <RiDeleteBin5Line size={20} />
                            </button>
                        </span>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}
