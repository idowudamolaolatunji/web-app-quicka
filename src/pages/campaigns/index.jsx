import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../context/DataContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Insight from '../../components/layout/Insight';
import { AiOutlinePlus } from 'react-icons/ai';
import { ymdDateFormat, ymdDateSlashFormat, ymdDateSlashTimeFormat } from '../../utils/helper';
import { MdOutlineCampaign, MdOutlineFilterList, MdOutlineRefresh, MdOutlineSpeakerNotes } from 'react-icons/md';
import TooltipUI from '../../components/layout/TooltipUI';
import { useNavigate } from 'react-router-dom';
import emptyImg from '../../assets/images/illustrations/campaign.png'
import { BsSendCheck } from 'react-icons/bs';
import { useAuthContext } from '../../context/AuthContext';
import { GiCrownCoin } from 'react-icons/gi';
import PageUI from '../../ui/PageUI/PageUI';


const emptyTitle = "Star a Campaign!";
const emptyText = "Maximize customer engagement with strategically designed campaign messages, delivered through preferred communication channels, influencing purchasing decisions, and brand experiences always.";
const emptyBtns = [
    { title: <><AiOutlinePlus /> Run your first campaign</>, link: "/dashboard/campaigns/run" },
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
                    <button className='table--btn'>Reset filter</button>

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
                <div className='page__section--insights insight--grid'>
                    <Insight title='Total Campaigns' loader={loader?.campaign} value={campaigns?.length || 0} icon={<MdOutlineCampaign />} />
                    <Insight title='SMS Campaigns' loader={loader?.campaign} value={0} icon={<MdOutlineSpeakerNotes />} />
                    <Insight title='Email Campaigns' loader={loader?.campaign} value={0} icon={<BsSendCheck />} />
                </div>
            )}

            {!error?.campaign && (
                <div className="top--bar info">
                    <span>
                        <p className='sub--text-sub no-hyphens'>Effectively engage your customers by sending impactful and personalized campaign messages either by sms or email respectively.</p>
                        <p className="sub--text-sub flex">
                            <span className='url--label'>Campaign credit <GiCrownCoin /> </span>{" "}
                            <p className='url--link value'>{store?.storeCredits}</p>
                            points.
                        </p>
                    </span>
                </div>
            )}
        </PageUI>
    )
}

export default index