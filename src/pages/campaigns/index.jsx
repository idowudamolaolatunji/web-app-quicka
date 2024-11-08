import React, { useEffect, useState } from 'react'
import PageUI from '../pageUIComponents/PageUI'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/Insight';
import { FiUser, FiUsers } from 'react-icons/fi';
import { TbUserSquare } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { ymdDateFormat, ymdDateSlashFormat, ymdDateSlashTimeFormat } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { MdOutlineCampaign, MdOutlineFilterList, MdOutlineRefresh, MdOutlineSpeakerNotes } from 'react-icons/md';
import TooltipUI from '../../components/TooltipUI';
import { useNavigate } from 'react-router-dom';
import emptyImg from '../../assets/images/illustrations/campaign.png'
import { BsSendCheck } from 'react-icons/bs';
import { useAuthContext } from '../../context/AuthContext';


const emptyTitle = "Star a Campaign!";
const emptyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat aliquam vero perferendis sapiente iste assumenda nam, vel dicta ducimus at perferendis sapiente iste.";
const emptyBtns = [
    { title: <><AiOutlinePlus /> Run your first campaign</>, link: "/dashboard/campaign/run" },
];


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { showInsights } = useDataContext();
    const { loader, error, campaigns } = useFetchedContext();

    const columns = [];

    const HeadTabs = function () {
        return (
            <div className='content'>
                <span className='flex'>
                    <TooltipUI placement='top' title="Refresh table">
                        <button className='table--btn' onClick={() => { }}><MdOutlineRefresh /></button>
                    </TooltipUI>

                    <input type="text" className="table--input form--input" placeholder='search..' />
                </span>


                <span className="flex">
                    <button className='table--btn'>Clear filter</button>

                    <TooltipUI placement='top' title="Filters">
                        <button className='table--btn'><MdOutlineFilterList /></button>
                    </TooltipUI>
                </span>
            </div>
        );
    }


    useEffect(function () {
        document.title = "Quicka | Run Campaign";
    }, []);


    return (
        <PageUI
            pageName="campaign"
            items={campaigns}
            columns={columns}
            data={campaigns}
            addUrl="campaigns/new"
            addBtnStr="New Campaign"
            emptyText={emptyText}
            emptyBtns={emptyBtns}
            emptyImg={emptyImg}
            emptyTitle={emptyTitle}
            headTabs={<HeadTabs />}
            loader={loader} error={error}

        >

            {showInsights?.campaign && (
                <div className='page__section--insights insight--grid' style={{ marginBottom: '3rem', ...(width > 900 && { width: '90%' }) }}>
                    <Insight title='Total Campaigns' loader={loader?.campaign} value={campaigns?.length || 0} icon={<MdOutlineCampaign />} />
                    <Insight title='SMS Campaigns' loader={loader?.campaign} value={0} icon={<MdOutlineSpeakerNotes />} />
                    <Insight title='Email Campaigns' loader={loader?.campaign} value={0} icon={<BsSendCheck />} />
                </div>
            )}

            <div className="top--bar success">
                <span>
                    <p className='sub--text-sub no-hyphens'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta sit architecto assumenda, cumque quaerat amet esse vel reiciendis!.</p>
                    <p className="sub--text-sub flex">
                        <span className='url--label'>Campaign credit</span>{" "}
                        <p className='url--link'>{store?.storeCredits}</p>
                    </p>
                </span>
            </div>
        </PageUI>
    )
}

export default index