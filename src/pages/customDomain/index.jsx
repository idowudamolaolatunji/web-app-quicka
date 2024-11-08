import React from 'react'
import { BiChevronDown, BiPlus, BiPurchaseTagAlt } from 'react-icons/bi';
import { PiPlugsConnectedBold } from 'react-icons/pi';
import { useWindowSize } from 'react-use'
import { useAuthContext } from '../../context/AuthContext';
import EmptyTableComponent from '../../components/EmptyTableComponent';
import TableUI from '../pageUIComponents/TableUI';
import emptyImg from "../../assets/images/illustrations/domain.png"
import { useFetchedContext } from '../../context/FetchedContext';
import { AiOutlinePlus } from 'react-icons/ai';


const emptyTitle = "Add Custom Domain URL!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus />Add Domain</> },
    { title: <><BiPurchaseTagAlt />Buy Domain</> },
];


function index() {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { domains, error, loader, } = useFetchedContext();

    const columns = [];


    return (
        <>
            <div className='page__section--heading' style={width < 550 ? { flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' } : {}}>
                <h2 className="page__section--title">Custom Domain</h2>

                <span className='page__section--btns' style={width < 500 ? { display: "grid", gridTemplateColumns: "1fr 1fr" } : {}}>
                    <button className="page__section-top-btn add" style={{ fontWeight: "500" }}><BiPlus /> Add Domain</button>
                    <button className="page__section-top-btn more">Buy Domain <BiPurchaseTagAlt /></button>
                </span>
            </div>


            <div className="top--bar success">
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
                    goto={false}
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