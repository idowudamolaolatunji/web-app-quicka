import React from 'react'
import { FiUsers } from 'react-icons/fi'
import { LuMousePointerClick, LuTags } from 'react-icons/lu'
import { MdOutlineShoppingBag } from 'react-icons/md'
import Insight from '../../../components/layout/Insight'
import { useFetchedContext } from '../../../context/FetchedContext';
import moment from 'moment'


function InsightGrid({ period }) {
    const { orders, customers } = useFetchedContext();

    const handleInsights = function(docs, dateKey) {
        const startDate = moment();
        if (period === 'this-week') startDate.startOf('week');
        else if (period === 'last-week') startDate.startOf('week').subtract(1, 'week');
        else if (period === 'this-month') startDate.startOf('month');
        else if (period === 'today') startDate.startOf('day'); 
        else startDate.startOf('year');
        
        return docs.filter((doc) => {
            const docDate = moment(doc[dateKey], 'YYYY-MM-DD');

            if (period === 'today') {
                return docDate.isSame(startDate);
            } else {
                return docDate.isSameOrAfter(startDate);
            }
        });
    }

    const websiteVisitorInsight = 0;
    const ordersInsight = handleInsights(orders, "orderDate")?.length;
    const productSoldInsight = handleInsights(orders, "orderDate")?.flatMap(order => order.products)?.reduce((acc, item) => acc + item?.quantity, 0);
    const customersInsight = handleInsights(customers, "createdAt")?.length;


    return (
        <div className='insight--grid'>
            <Insight title='Website Visits' value={websiteVisitorInsight} icon={<LuMousePointerClick />} />

            <Insight title='Orders' value={ordersInsight} icon={<MdOutlineShoppingBag />} link='/orders' />

            <Insight title='Products Sold' value={productSoldInsight} icon={<LuTags />} link='/products' />

            <Insight title='Customer' value={customersInsight} icon={<FiUsers />} link='/customers' />
        </div>
    )
}

export default InsightGrid;



// const endDate = moment();
// if (period === 'this-week') {
//     startDate.startOf('week');
//     endDate.endOf('week');
//   } else if (period === 'last-week') {
//     startDate.endOf('week').subtract(1, 'week').startOf('week');
//     endDate.endOf('week').subtract(1, 'week')
//   } else if (period === 'this-month') {
//     startDate.startOf('month');
//     endDate.endOf('month');
//   } else if (period === 'today') {
//     startDate.startOf('day');
//     endDate.endOf('day');
//   } else {
//     startDate.startOf('year');
//     endDate.endOf('year');
//   }