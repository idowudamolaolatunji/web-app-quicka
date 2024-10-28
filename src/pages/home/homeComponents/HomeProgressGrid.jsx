import React from 'react'
import { GiPayMoney } from 'react-icons/gi'
import HomeProgressCard from './HomeProgressCard'
import { LuArchiveRestore } from 'react-icons/lu'
import { MdAddChart } from 'react-icons/md'
import { useFetchedContext } from '../../../context/FetchedContext'
import moment from 'moment'

function ProgressGrid() {
    const { orders } = useFetchedContext();

    // FILTERED HERE TO GET ALL COMPLETED SALES AND ALL COMPLETED OFFLINE SALES
    const allSales = orders?.filter(order => order.orderStatus == 'completed');
    const offlineSales = orders?.filter(order => order.orderStatus == 'completed' && order.channel != "online store");

    // HERE WE ARE GETTING THE TOTAL SETTLEMENT FROM OUR DB
    const totalSettlements = 0;

    // WE CALCULATED FOR THE TOTAL SALE AND TOTAL OFFLINE SALES, BY MAPPING AND REDUCING..
    const totalSales = allSales.reduce((acc, sale) => acc + sale?.orderAmount, 0);
    const totalOfflineSales = offlineSales.reduce((acc, sale) => acc + sale?.orderAmount, 0);


    // CALCULATED TODAY TOTAL SALE AND YESTERDAY'S JUST TO COMPARE THE VALUE
    function compareSalesByPercentage(array) {
        const todaySales = array?.filter((sale) => moment(sale.orderDate).isSameOrAfter(moment().startOf('day'))).reduce((acc, sale) => acc + sale?.orderAmount, 0);
    
        const yesterdaySales = array?.filter((sale) => moment(sale.orderDate).isBetween(moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day'))).reduce((acc, sale) => acc + sale?.orderAmount, 0);

        const salesPercent = yesterdaySales !== 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;
        return salesPercent;
    }

    const allSalesPercent = compareSalesByPercentage(allSales);
    const offlineSalesPercent = compareSalesByPercentage(offlineSales);

    return (
        <div className='prog--grid'>
            <HomeProgressCard title='Total Sales' icon={<MdAddChart />} value={totalSales} percent={allSalesPercent} upTrend={allSalesPercent > 0} days={1} />
            <HomeProgressCard title='Total Settlements' icon={<GiPayMoney />} value={totalSettlements} percent={0} upTrend={true} days={1} />
            <HomeProgressCard title='Offline Sales' icon={<LuArchiveRestore />} value={totalOfflineSales} percent={offlineSalesPercent} upTrend={offlineSalesPercent > 0} days={1} />
        </div>
    )
}

export default ProgressGrid