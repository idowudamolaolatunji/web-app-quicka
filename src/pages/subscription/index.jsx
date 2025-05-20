import React, { useEffect } from 'react'
import EmptyTableComponent from '../../components/layout/EmptyTableComponent'
import TableUI from '../../ui/PageUI/TableUI'
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Empty from '../../components/layout/Empty';
import emptyImg from "../../assets/images/illustrations/upgrade.png";
import { HiOutlineSquare3Stack3D } from 'react-icons/hi2';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom';
import "./style.css";


export default function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { plansHistory, error, loader } = useFetchedContext();
    const { subscription } = store;
    
    const columns = [];
    
    useEffect(function() {
        document.title = "Quicka | Subscription plans"
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <React.Fragment>
            <div className='page__section--heading' style={width < 550 ? { flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' } : {}}>
                <h2 className="page__section--title">Subscription</h2>
                <button className="page__section-top-btn more" onClick={() => navigate("choose-plan")}>Upgrade plans <HiOutlineSquare3Stack3D /></button>
            </div>
            
            <div className="item__preview--grid grid--2x1">
                <div className="left--side">
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
                            {(subscription?.type !== "free") && (
                                <button>Cancel Plan</button>
                            )}
                            <button onClick={() => navigate("choose-plan")}>Upgrade Subscription</button>
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
                </div>

                <div className="right--side"></div>
            </div>
        </React.Fragment>
    )
}