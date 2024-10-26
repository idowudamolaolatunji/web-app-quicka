import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from '../../../utils/helper';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../../context/FetchedContext';

function OverviewChart() {
    const { width } = useWindowSize();
    const { orders } = useFetchedContext();
    const isData = orders?.length > 0 ? true : false;

    const processChart = function() {
        const series = [
            { name: 'Total Sales', data: new Array(12).fill(null), color: '#ff7a49' },
            { name: 'Online Sales', data: new Array(12).fill(null), color: '#ffb59a' },
            { name: 'Offline Sales', data: new Array(12).fill(null), color: '#994020' },
        ];

        // WE ONLY TRACK SALES FOR COMPLETED ORDERS ALONE
        orders?.filter(order => order.orderStatus == "completed").forEach(order => {
            const orderDate = new Date(order.orderDate);
            const month = orderDate.getMonth(); // 0-11
            const sales = order.orderPrice; // Access orderPrice directly

            series[0].data[month] = (series[0].data[month] || 0) + sales; // Total Sales
            if (order.channel === 'online store') {
                series[1].data[month] = (series[1].data[month] || 0) + sales; // Online Sales
            } else {
                series[2].data[month] = (series[2].data[month] || 0) + sales; // Offline Sales
            }
        });

        return series;
    };

    const series = processChart();

    const options = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
            font: {
                family: 'Raleway, sans-serif',
                size: '20px',
                color: '#333',
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: false,
            width: 1,
            colors: ['#fff'],
        },
        tooltip: {
            enabled: true,
            shared: true,
            followCursor: true,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Raleway, sans-serif',
                color: '#333',
            },
            onDatasetHover: {
                highlightDataSeries: false,
            },
            y: {
                formatter: val => '₦' + formatNumber(val),
            },
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'left',
            offsetX: 0,
            offsetY: 12,
        },
        grid: {
            borderColor: '#f1f1f1',
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', "Apr", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    colors: '#444',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    colors: '#444',
                },
                formatter: (val) => {
                    if (val >= 1000000) {
                        return '₦' + (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1) + 'M';
                    } else if (val >= 1000) {
                        return '₦' + (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k';
                    } else {
                        return '₦' + val.toFixed(0);
                    }
                },
            },
        }
    };

    return (
        <div className='sales-overview'>
            <div id="chart" className='bar-chart'>
                <ReactApexChart options={options} series={series} type='bar' height={isData ? (width < 850 ? 300 : 330) : (width < 850 ? 250 : 280)} />
            </div>
            <div id="html-dist"></div>
        </div>
    );

}

export default OverviewChart