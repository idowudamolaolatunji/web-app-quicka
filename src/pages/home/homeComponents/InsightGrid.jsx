import React from 'react'
import { FiUsers } from 'react-icons/fi'
import { LuMousePointerClick, LuTags } from 'react-icons/lu'
import { MdOutlineShoppingBag } from 'react-icons/md'
import Insight from '../../../components/Insight'
import { useFetchedContext } from '../../../context/FetchedContext';
import moment from 'moment'


function InsightGrid({ period }) {
    const { orders, customers } = useFetchedContext();

  const handleInsights = (docs, dateKey) => {
        const startDate = moment();
        if (period === 'this-week') startDate.startOf('week');
        else if (period === 'this-month') startDate.startOf('month');
        else if (period === 'today') startDate.startOf('day'); 
        else startDate.startOf('year');
        
        return docs.filter((doc) => {
            if (period === 'today') {
                return moment(doc[dateKey], 'YYYY-MM-DD').isSame(startDate);
            } else {
                return moment(doc[dateKey], 'YYYY-MM-DD').isSameOrAfter(startDate);
            }
        });
    }

    const websiteVisitorInsight = 0;
    const ordersInsight = handleInsights(orders, "orderDate")?.length;
    const productSoldInsight = handleInsights(orders, "orderDate")?.flatMap(order => order.orderQuantity)?.reduce((acc, order) => acc + order?.quantity, 0);
    const customersInsight = handleInsights(customers, "createdAt")?.length;


    return (
        <div className='insight--grid'>
            <Insight title='Website Visits' value={websiteVisitorInsight} dec={!websiteVisitorInsight && 1} icon={<LuMousePointerClick />} />

            <Insight title='Orders' value={ordersInsight} dec={!ordersInsight && 1} icon={<MdOutlineShoppingBag />} link='/orders' />

            <Insight title='Products Sold' value={productSoldInsight} dec={!productSoldInsight && 1} icon={<LuTags />} link='/products' />

            <Insight title='Customer' value={customersInsight} dec={!customersInsight && 1} icon={<FiUsers />} link='/customers' />
        </div>
    )
}

export default InsightGrid