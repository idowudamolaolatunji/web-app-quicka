import React from 'react'
import { GiPayMoney } from 'react-icons/gi'
import HomeProgressCard from './HomeProgressCard'
import { LuArchiveRestore } from 'react-icons/lu'
import { MdAddChart } from 'react-icons/md'
import { useFetchedContext } from '../../../context/FetchedContext'
import moment from 'moment'
import { useWindowSize } from 'react-use'
import { useDataContext } from '../../../context/DataContext'


function ProgressGrid() {
    const { width } = useWindowSize();
    const { orders, settlements } = useFetchedContext();
    const { isMenuCollapsed, homeInsightPeriod } = useDataContext();

    const hasData = orders && orders?.length > 1;
    const hasSettle = settlements && settlements?.length > 1;
    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1050);
    const period = homeInsightPeriod == "today" ? "day" : homeInsightPeriod?.replace("this-", "");

    // const noData = !orders || orders?.length < 1;
    // const noSettle = !settlements || settlements?.length < 1;

    // FILTERED HERE TO GET ALL COMPLETED SALES AND ALL COMPLETED OFFLINE SALES OR PAID SALES (COME BACK)
    // const allSales = orders?.filter(order => order.orderStatus == 'completed');
    // const offlineSales = orders?.filter(order => order.orderStatus == 'completed' && order.channel != "online store");
    // const settlementSales = orders?.filter(order => order.orderStatus == 'completed' && order.channel == "online store");
    const allSales = orders?.filter(order => order.paymentStatus == 'paid');
    const offlineSales = orders?.filter(order => order.paymentStatus == 'paid' && order.channel != "online store");
    const settlementSales = orders?.filter(order => order.paymentStatus == 'paid' && order.channel == "online store");

    // WE CALCULATED FOR THE TOTAL SALE AND TOTAL OFFLINE SALES, BY MAPPING AND REDUCING..
    // const totalSales = allSales.reduce((acc, sale) => acc + sale?.profit, 0);
    // const totalOfflineSales = offlineSales.reduce((acc, sale) => acc + sale?.profit, 0) || 0;
    // const totalSettlements = settlementSales?.reduce((acc, sale) => acc + sale?.profit, 0) || 0;


    // COMPARE SALES VS LAST PREIOD DURATION IN %
    function compareSalesByPercentage(array, hasItsData) {
        const allTimeSales = array?.reduce((acc, sale) => acc + sale?.profit, 0);
        const periodSales = array?.filter((sale) => moment(sale.orderDate).isSameOrAfter(moment().startOf(period))).reduce((acc, sale) => acc + sale?.profit, 0) || 0;

        const vsPeriodDurationSales = array?.filter((sale) => moment(sale.orderDate).isBetween(moment().subtract(1, period).startOf(period), moment().subtract(1, period).endOf(period))).reduce((acc, sale) => acc + sale?.profit, 0) || 0;
        
        const periodSalesPercent = vsPeriodDurationSales !== 0 ? ((periodSales - vsPeriodDurationSales) / vsPeriodDurationSales) * 100 : 0;
        const allTimeSalesPercent = hasItsData ? 100 : 0;
        // return periodSalesPercent;
        return {
            percent: period == "all-time" ? allTimeSalesPercent : (periodSalesPercent || 0),
            periodSales: period == "all-time" ? allTimeSales : periodSales,
        };
    }

    // const allSalesPercent = compareSalesByPercentage(allSales);
    // const offlineSalesPercent = compareSalesByPercentage(offlineSales);
    // const settlementPercent = compareSalesByPercentage(settlementSales);

    const allResult = compareSalesByPercentage(allSales, hasData);
    const offlineResult = compareSalesByPercentage(offlineSales, hasData);
    const settlementResult = compareSalesByPercentage(settlementSales, hasSettle);


    return (
        <div className='prog--grid' style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
            {/* <HomeProgressCard title='Total Sales' icon={<MdAddChart />} value={totalSales} percent={allSalesPercent} upTrend={noData || allSalesPercent > 0} days={1} />
            <HomeProgressCard title='Total Settlements' icon={<GiPayMoney />} value={totalSettlements} percent={settlementPercent} upTrend={noSettle || settlementPercent > 0} days={1} />
            <HomeProgressCard title='Offline Sales' icon={<LuArchiveRestore />} value={totalOfflineSales} percent={offlineSalesPercent} upTrend={noData || offlineSalesPercent > 0} days={1} /> */}
            <HomeProgressCard title='Total Sales' icon={<MdAddChart />} value={allResult.periodSales} percent={allResult.percent} upTrend={!hasData && allResult.percent > 0} days={1} />
            <HomeProgressCard title='Total Settlements' icon={<GiPayMoney />} value={settlementResult.periodSales} percent={settlementResult.percent} upTrend={!hasSettle && settlementResult.percent > 0} days={1} />
            <HomeProgressCard title='Offline Sales' icon={<LuArchiveRestore />} value={offlineResult.periodSales} percent={offlineResult.percent} upTrend={!hasData && offlineResult.percent > 0} days={1} />
        </div>
    )
}

export default ProgressGrid






// CALCULATED TODAY TOTAL SALE AND YESTERDAY'S JUST TO COMPARE THE VALUE
// function compareSalesByPercentage(array, ) {
//     const todaySales = array?.filter((sale) => moment(sale.orderDate).isSameOrAfter(moment().startOf('day'))).reduce((acc, sale) => acc + sale?.profit, 0);

//     const yesterdaySales = array?.filter((sale) => moment(sale.orderDate).isBetween(moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day'))).reduce((acc, sale) => acc + sale?.profit, 0);
    
//     const salesPercent = yesterdaySales !== 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;
//     return salesPercent;
// }