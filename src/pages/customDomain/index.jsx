import React, { useEffect } from 'react'
import { BiChevronDown, BiPlus, BiPurchaseTagAlt } from 'react-icons/bi';
import { PiPlugsConnectedBold } from 'react-icons/pi';
import { useWindowSize } from 'react-use'
import { useAuthContext } from '../../context/AuthContext';
import EmptyTableComponent from '../../components/EmptyTableComponent';
import emptyImg from "../../assets/images/illustrations/domain.png"
import { useFetchedContext } from '../../context/FetchedContext';
import { AiOutlinePlus } from 'react-icons/ai';
import TableUI from '../../ui/PageUI/TableUI';
import ConnectionError from '../../components/ConnectionError';
import { useNavigate } from 'react-router-dom';


const emptyTitle = "Add Custom Domain URL!";
const emptyText = "Establish a lasting impression and trust with a custom domain, reinforcing your unique brand identity and ensuring consistency across all online platforms.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Add Domain</>, link: "/dashboard/custom-domain/add-domain" },
    { title: <><BiPurchaseTagAlt />Buy Domain</>, link: "/dashboard/custom-domain/buy-domain" },
];


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { domains, error, loader, globalConnectionError } = useFetchedContext();

    const columns = [];

    useEffect(function() {
        document.title = "Quicka | Custom Domain";
        window.scrollTo(0, 0)
    }, []);

    return (
        <>
            {globalConnectionError && <ConnectionError /> }

            <div className='page__section--heading' style={width < 550 ? { flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' } : {}}>
                <h2 className="page__section--title">Custom Domain</h2>

                <span className='page__section--btns' style={width < 500 ? { display: "grid", gridTemplateColumns: "1fr 1fr" } : {}}>
                    <button className="page__section-top-btn add" style={{ fontWeight: "500" }} onClick={() => navigate(emptyBtns[0]?.link)}><BiPlus /> Add Domain</button>
                    <button className="page__section-top-btn more" onClick={() => navigate(emptyBtns[1]?.link)}>Buy Domain <BiPurchaseTagAlt /></button>
                </span>
            </div>


            <div className="top--bar info">
                <span>
                    <p className='sub--text-sub no-hyphens'>Your site is always accessible at a quicka.store subdomain based on the site name. Custom domains allow visitors to access your site at your own custom, branded, unique and memorable URL.</p>

                    <p className="sub--text-sub flex" style={{ marginTop: "2rem" }}>
                        <span className='url--label'>Your Quicka URL:</span>{" "}
                        <a href={`https://${store?.storeUrl}`} target='_blank' className='url--link'>{store?.storeUrl}</a>
                    </p>
                </span>
            </div>


            <div className="page__section--main" style={{ padding: 0 }}>
                <TableUI
                    data={domains}
                    columns={columns}
                    selectableRows={false}
                    hasLink={false}
                    error={error?.domain}
                    loader={loader?.domain}
                    emptyComponent={
                        <EmptyTableComponent
                            img={emptyImg}
                            text={emptyText}
                            btns={emptyBtns}
                            title={emptyTitle}
                            className="empty--main"
                            customStyle={{ padding: "3rem 0" }}
                        />
                    }
                />
            </div>
        </>
    )
}

export default index