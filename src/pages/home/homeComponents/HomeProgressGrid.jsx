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
    const { orders, settlements, expenses } = useFetchedContext();
    const { isMenuCollapsed, homeInsightPeriod } = useDataContext();

    // const hasData = orders && orders?.length > 1;
    const hasSale = orders && orders?.length >= 1;
    const hasExpense = expenses && expenses?.length >= 1;
    const hasSettlement = settlements && settlements?.length >= 1;
    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1050);
    const period = homeInsightPeriod == "today" ? "day" : homeInsightPeriod?.replace("this-", "");
    
   

    // FILTERED HERE TO GET ALL COMPLETED SALES AND ALL COMPLETED OFFLINE SALES OR PAID SALES (COME BACK)
    // const salesReport = orders?.filter(order => order.orderStatus == 'completed');
    // const offlineSales = orders?.filter(order => order.orderStatus == 'completed' && order.channel != "online store");
    // const settlementsReport = orders?.filter(order => order.orderStatus == 'completed' && order.channel == "online store");

    const salesReport = orders?.filter(order => order.paymentStatus == 'paid' && order.orderStatus != "canceled");
    const settlementsReport = orders?.filter(order => order.paymentStatus == 'paid' && order.orderStatus != "canceled" && order.channel == "online store"); // come back to settlement
    const expensesReport = expenses;
    // const offlineSales = orders?.filter(order => order.paymentStatus == 'paid' && order.channel != "online store");


    // COMPARE SALES VS LAST PREIOD DURATION IN %
    function compareResultsByPercentage(array, hasItsData) {
        const allTimeSales = array?.reduce((acc, sale) => acc + sale?.profit, 0);
        const periodSales = array?.filter((sale) => moment(sale.orderDate).isSameOrAfter(moment().startOf(period))).reduce((acc, sale) => acc + sale?.profit, 0) || 0;

        const vsPeriodDurationSales = array?.filter((sale) => moment(sale.orderDate).isBetween(moment().subtract(1, period).startOf(period), moment().subtract(1, period).endOf(period))).reduce((acc, sale) => acc + sale?.profit, 0) || 0;
        
        const periodSalesPercent = vsPeriodDurationSales !== 0 ? ((periodSales - vsPeriodDurationSales) / vsPeriodDurationSales) * 100 : 0;
        const allTimeSalesPercent = hasItsData ? 100 : 0;

        return {
            percent: period == "all-time" ? allTimeSalesPercent : (periodSalesPercent || 0),
            periodSales: period == "all-time" ? allTimeSales : periodSales,
        };
    }

    // COME BACK HERE
    function compareExpensesByPercentage(array, hasItsData) {
        const allTimeExpense = array?.reduce((acc, expense) => acc + expense?.amount, 0);
        const periodExpense = array?.filter((expense) => moment(expense.date).isSameOrAfter(moment().startOf(period))).reduce((acc, expense) => acc + expense?.amount, 0) || 0;

        const vsPeriodDurationExpenses = array?.filter((expense) => moment(expense.date).isBetween(moment().subtract(1, period).startOf(period), moment().subtract(1, period).endOf(period))).reduce((acc, expense) => acc + expense?.amount, 0) || 0;
        
        const periodExpensesPercent = vsPeriodDurationExpenses !== 0 ? ((periodExpense - vsPeriodDurationExpenses) / vsPeriodDurationExpenses) * 100 : 0;
        const allTimeSalesPercent = hasItsData ? 0 : 100;

        return {
            percent: period == "all-time" ? allTimeSalesPercent : (periodExpensesPercent || 0),
            periodSales: period == "all-time" ? allTimeExpense : periodExpense,
        };
    }

    const allResult = compareResultsByPercentage(salesReport, hasSale);
    const settlementResult = compareResultsByPercentage(settlementsReport, hasSettlement);
    const expensesResult = compareExpensesByPercentage(expensesReport, hasExpense)
    // const offlineResult = compareResultsByPercentage(offlineSales, hasData);


    return (
        <div className='prog--grid' style={isCollapsedBtw900and1000 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}}>
            <HomeProgressCard title={`Total Sales (${width <= 450 ? "Inflow" : "In"})`} icon={<MdAddChart />} value={allResult.periodSales} percent={allResult.percent} upTrend={!hasSale && allResult.percent > 0} days={1} />
            <HomeProgressCard title='Total Settlements' icon={<GiPayMoney />} value={settlementResult.periodSales} percent={settlementResult.percent} upTrend={!hasSettlement && settlementResult.percent > 0} days={1} />
            <HomeProgressCard title={`Total Expenses (${width <= 450 ? "Outflow" : "Out"})`} icon={<LuArchiveRestore />} value={expensesResult.periodSales} percent={expensesResult.percent} upTrend={!hasExpense && expensesResult.percent > 0} days={1} />
            {/* <HomeProgressCard title='Offline Sales' icon={<LuArchiveRestore />} value={offlineResult.periodSales} percent={offlineResult.percent} upTrend={!hasData && offlineResult.percent > 0} days={1} /> */}
        </div>
    )
}

export default ProgressGrid;