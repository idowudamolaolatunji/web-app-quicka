import React from 'react'
import moment from 'moment';
import { useWindowSize } from 'react-use';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from '../../../utils/helper';
import { useAuthContext } from '../../../context/AuthContext';
import { useFetchedContext } from '../../../context/FetchedContext';


export default function OverviewChart({ period }) {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { orders } = useFetchedContext();
    
    const isData = orders?.length > 0 ? true : false;
    // const completedOrders = orders?.filter(order => order.orderStatus == "completed");
    const completedOrders = orders?.filter(order => order.paymentStatus == "paid" && order.orderStatus != "canceled");
    const currency = store?.currency?.symbol;

    const handleGetYearlyData = function() {
        const now = moment();
        let startDate, endDate;

        if (period === 'this-year') {
            startDate = moment('01-01-' + now.year(), 'DD-MM-YYYY');
            endDate = moment('31-12-' + now.year(), 'DD-MM-YYYY').endOf('day');
        } else if (period === 'last-year') {
            startDate = now.clone().subtract(1, 'year').startOf('year');
            endDate = now.clone().subtract(1, 'year').endOf('year');
        }

        return completedOrders?.filter((order) => {
            const orderDate = moment(order.orderDate, 'YYYY-MM-DD');
            return orderDate.isValid() && orderDate.isBetween(startDate, endDate, null, '[)');
        });
    }

    const orderChartData = handleGetYearlyData();

    const handleProcessChart = function() {
        const series = [
            { name: 'Total Sales', data: new Array(12).fill(null), color: '#ff7a49' },
            { name: 'Website Sales', data: new Array(12).fill(null), color: '#ffb59a' },
            { name: 'Offline Sales', data: new Array(12).fill(null), color: '#994020' },
        ];

        orderChartData?.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const month = orderDate.getMonth(); // 0-11
            const sales = order.profit; // Access profit directly

            series[0].data[month] = (series[0].data[month] || 0) + sales; // Total Sales
            if (order.channel === 'online store') {
                series[1].data[month] = (series[1].data[month] || 0) + sales; // Website Sales
            } else {
                series[2].data[month] = (series[2].data[month] || 0) + sales; // Offline Sales
            }
        });

        return series;
    };

    const series = handleProcessChart();

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
                formatter: val => currency + formatNumber(val),
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
                        return currency + (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1) + 'M';
                    } else if (val >= 1000) {
                        return currency + (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k';
                    } else {
                        return currency + val.toFixed(0);
                    }
                },
            },
        }
    };

    return (
        <div className='sales-overview'>
            <div id="chart" className='bar-chart'>
                <ReactApexChart options={options} series={series} type='bar' height={isData ? (width < 850 ? 300 : 320) : (width < 850 ? 250 : 270)} />
            </div>
            <div id="html-dist"></div>
        </div>
    );

}




// orderChartData?.forEach(order => {
//     const orderDate = new Date(order.orderDate);
//     const month = orderDate.getMonth(); // 0-11
//     if (month >= 5 && month < 7) { // June (5) to July (6)
//       const sales = order.profit; // Access profit directly
//       series[0].data[month - 5] = (series[0].data[month - 5] || 0) + sales; // Total Sales
//       if (order.channel === 'online store') {
//         series[1].data[month - 5] = (series[1].data[month - 5] || 0) + sales; // Website Sales
//       } else {
//         series[2].data[month - 5] = (series[2].data[month - 5] || 0) + sales; // Offline Sales
//       }
//     }
//   });
  