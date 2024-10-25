import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from '../../../utils/helper';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../../context/FetchedContext';

function OverviewChart() {
    const { width } = useWindowSize();
    const { orders } = useFetchedContext();
    const isData = orders?.length > 0 ? true : false;

    const processChart = () => {
        const series = [
            { name: 'Total Sales', data: new Array(12).fill(null), color: '#ff7a49' },
            { name: 'Online Sales', data: new Array(12).fill(null), color: '#ffb59a' },
            { name: 'Offline Sales', data: new Array(12).fill(null), color: '#994020' },
        ];

        orders.forEach((data) => {
            const orderDate = new Date(data.orderDate);
            const month = orderDate.getMonth(); // 0-11
            const sales = data.products.reduce((sum, product) => sum + product.price, 0);

            series[0].data[month] += sales; // Total Sales
            if (data.channel === 'online store') {
                series[1].data[month] += sales; // Online Sales
            } else {
                series[2].data[month] += sales; // Offline Sales
            }
        });

        return series;
    };

    const series = processChart();
    console.log(series)

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
                <ReactApexChart options={options} series={series} type='bar' height={isData ? 320 : (width < 850) ? 270 : 290} />
            </div>
            <div id="html-dist"></div>
        </div>
    );

}

export default OverviewChart