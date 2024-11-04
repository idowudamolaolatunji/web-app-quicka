import React from 'react'
import SalesOverview from './SalesOverview'
import RecentOrders from './RecentOrders'
import QuickActions from './QuickActions';
import HomeInsightContainer from './HomeInsightContainer';
import TopSalesChannels from './TopSalesChannels'
import VisitorOverview from './VisitorOverview'
import TopProducts from './TopProducts'
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../../context/DataContext';
import NewsBox from './NewsBox';

function HomeLayoutGrid() {
    const { width } = useWindowSize();
    const { isMenuCollapsed } = useDataContext();

    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1000 );

    return (
        <div className={`home--grid ${isCollapsedBtw900and1000 ? 'column-1fr' : ''}`}>
            <div className="grid--left">
                <HomeInsightContainer />
                <SalesOverview />
                <RecentOrders />
                {/* <NewsBox /> */}
            </div>

            <div className="grid--right">
                <VisitorOverview />
                <TopProducts />
                <TopSalesChannels />
                {/* <QuickActions /> */}
            </div>
        </div>
    )
}

export default HomeLayoutGrid