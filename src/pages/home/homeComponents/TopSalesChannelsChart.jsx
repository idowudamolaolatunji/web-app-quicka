import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useWindowSize } from 'react-use';
import { useDataContext } from '../../../context/DataContext';
import { useFetchedContext } from '../../../context/FetchedContext';

function TopSalesChannelsChart() {
    const { width } = useWindowSize();
    const { orders } = useFetchedContext();
    const { isMenuCollapsed } = useDataContext()

    const isCollapsedBtw1000and1100 = !isMenuCollapsed && (width >= 1000 && width < 1100);


    // YOU NEED TO FUTHER UNDERSTAND WHAT'S GOING ON HERE!!
    const processChannels = function () {
        const channelCounts = orders?.reduce((acc, curr) => {
            acc[curr.channel] = (acc[curr.channel] || 0) + 1;
            return acc;
        }, {});

        const sortedChannels = Object.entries(channelCounts).sort((a, b) => b[1] - a[1]);

        const totalCount = sortedChannels.slice(0, 5).reduce((acc, [_, count]) => acc + count, 0);

        return [
            sortedChannels.slice(0, 5).map(([_, count]) => count),
            sortedChannels.slice(0, 5).map(([channel]) => channel),
            sortedChannels.slice(0, 5).map(([channel, count]) => ({
                label: channel,
                value: Math.floor((count / totalCount) * 100)
            })),
        ];
    };

    const [ApexSeriesData, ApexLebelData, MUIChartData] = processChannels();


    // FOR THE MOBIE DOUNOT PIE CHART IN APEXCHART
    // const [series] = useState([44, 55, 41, 17, 15]);
    const [series] = useState(ApexSeriesData);

    const [options] = useState({
        chart: {
            type: 'donut',
            toolbar: {
                show: false,
            },
            font: {
                family: 'Raleway, sans-serif',
                size: '14px',
                color: '#333',
            },
        },
        colors: ['#ff7a49', '#A7B4F5', '#F8CBA6', '#EB4747', '#444444'],
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 200
                    },
                    legend: {
                        position: 'right',
                    },
                },
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 220
                    },
                },
            },
            {
                breakpoint: 400,
                options: {
                    chart: {
                        height: 240
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },

        ],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontFamily: 'Raleway, sans-serif',
            },
        },
        tooltip: {
            enabled: true,
            shared: true,
            followCursor: true,
            style: {
                fontSize: '13px',
                fontFamily: 'Raleway, sans-serif',
                color: '#333',
            },
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            offsetX: 0,
            offsetY: 10,

        },
        // labels: ['Jiji', 'Online store', 'WhatsApp', 'Physical store', 'Others'],
        labels: ApexLebelData,
    });


    // FOR THE DESTOP DOUNOT PIE CHART WITH MUI
    // const data = [
    //     {
    //         label: 'Jiji',
    //         value: 44,
    //     },
    //     {
    //         label: 'Online store',
    //         value: 55,
    //     },
    //     {
    //         label: 'WhatsApp',
    //         value: 41,
    //     },
    //     {
    //         label: 'Physical store',
    //         value: 17,
    //     },
    //     {
    //         label: 'Others',
    //         value: 15,
    //     },
    // ];

    return (
        <>
            {width > 850 ? (
                <div id="chart">
                    <PieChart
                        colors={['#ff7a49', '#A7B4F5', '#F8CBA6', '#EB4747', '#444444']}
                        slotProps={{
                            legend: {
                                hidden: isCollapsedBtw1000and1100,
                            },
                        }}
                        series={[
                            {
                                data: MUIChartData,
                                // arcLabel: (item) => `${item.value}%`,
                                valueFormatter: (item) => (
                                    <p style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                                        <span className='value'>{item.value}%</span>{" "}of your sales
                                    </p>
                                ),
                                highlightScope: { fade: 'global', highlight: 'item' },
                                donut: { innerRadius: 30 },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                ...(width > 1200 && { cx: 80, cy: 80 }),
                                ...(isCollapsedBtw1000and1100 && { cx: 100, cy: 80 }),
                                ...(width <= 380 && { cx: 70, cy: 80 }),
                                innerRadius: 40,
                                paddingAngle: 2.5,
                            },
                        ]}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontWeight: 'bold',
                                fontSize: '10px',
                                color: '#fff'
                            },
                        }}
                        height={160}
                    />
                </div>
            ) : (
                <React.Fragment>
                    <div id="chart" className='dougnot-chart'>
                        <ReactApexChart options={options} series={series} type="donut" height={250} />
                    </div>
                    <div id="html-dist"></div>
                </React.Fragment>
            )}
        </>
    )

}

export default TopSalesChannelsChart