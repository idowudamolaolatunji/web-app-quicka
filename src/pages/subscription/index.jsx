import React, { useEffect } from 'react'
import EmptyTableComponent from '../../components/EmptyTableComponent'
import TableUI from '../../ui/PageUI/TableUI'
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Empty from '../../components/Empty';
import emptyImg from "../../assets/images/illustrations/upgrade.png";
import { HiOutlineSquare3Stack3D } from 'react-icons/hi2';
import { useWindowSize } from 'react-use';
import ConnectionError from '../../components/ConnectionError';


function index() {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { plansHistory, error, loader, globalConnectionError } = useFetchedContext();
    
    const columns = [];
    
    useEffect(function() {
        document.title = "Quicka | Subscription plans"
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <>
            {globalConnectionError && <ConnectionError /> }

            <div className='page__section--heading' style={width < 550 ? { flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' } : {}}>
                <h2 className="page__section--title">Subscription</h2>
                <button className="page__section-top-btn more">Upgrade plans <HiOutlineSquare3Stack3D /></button>
            </div>

            <div className="page__section--main card sub--details">
                <span className='sub--detail'>
                    <p className='subtitle'>Plan</p>
                    <h4 className='heading'>Quicka Lite</h4>
                </span>

                <span className='sub--detail'>
                    <p className='subtitle'>Pricing</p>
                    <h4 className='heading'>free forever</h4>
                </span>

                <div className='sub--btns'>
                    <button>Cancel Plan</button>
                    <button>Upgrade Subscription</button>
                </div>
            </div>


            <div className="page__section--main" style={{  marginTop: "7rem" }}>
                <TableUI
                    data={plansHistory}
                    columns={columns}
                    selectableRows={false}
                    hasLink={false}
                    error={error?.domain}
                    loader={loader?.domain}
                    emptyComponent={
                        <Empty
                            img={emptyImg}
                            text={"subscription history"}
                        />
                    }
                />
            </div>
        </>
    )
}

export default index