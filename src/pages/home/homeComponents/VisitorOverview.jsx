import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../../context/FetchedContext';
import { formatNumber } from '../../../utils/helper';
import moment from 'moment';


function VisitorOverview() {
    const { width } = useWindowSize();
    // const { websiteVisitors } = useFetchedContext();
    /////////////////////////////////////////////////
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    const websiteVisitors = [
        {
            createdAt: "2025-12-28T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-01-30T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-01-30T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-01-30T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-01-30T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-01-30T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-01-30T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-02-02T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-02-02T17:52:08.049+00:00"
        },
        {
            createdAt: "2025-02-02T17:52:08.049+00:00"
        },
    ];

  useEffect(function() {
    // HERE WE GOT THE CURRENT MONTH AND THE LAST 2 MONTH USING MOMENT AND META AI 😂
    const currentMonth = moment().format('MMM');
    const lastMonth = moment().subtract(1, 'months').format('MMM');
    const twoMonthsAgo = moment().subtract(2, 'months').format('MMM');

    // WE CREATED A DUMMY DATA ARRAY FOR THE DATA
    const visitorData = [0, 0, 0];

    // AFTER WHICH WE LOOPED OVER THE VISITOR'S ARRAY AND FOUND THE CREATED MONTH AND MATCH IT WITH THE CURRENT MONTH, AND THE LAST 2 MONTHS
    websiteVisitors?.forEach((visitor) => {
      const createdAtMonth = moment(visitor?.createdAt).format('MMM');
        if (createdAtMonth === currentMonth) {
            visitorData[0] += 1;
        } else if (createdAtMonth === lastMonth) {
            visitorData[1] += 1;
        } else if (createdAtMonth === twoMonthsAgo) {
            visitorData[2] += 1;
        }
    });

    // THEN WE SET THE SERIES IN A STATE AS WELL AS THE OPTION, WHICH WASN'T THE CASE BEFORE
    // I.E, THEY WERE JUST VARIABLES BEFORE
    setSeries([{
        data: visitorData,
        name: 'Website Visitors',
        color: '#FF6B30',
    }]);


    setOptions({
        chart: {
            toolbar: {
                show: false,
            },
            font: {
                family: 'Raleway, sans-serif',
                size: '20px',
                color: '#333',
            },
            zoom: {
                // type: 'x',
                enabled: true,
                // enabled: false,
                autoScaleYaxis: true,
            },
        },
        stroke: {
            width: 1.6,
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false,
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
        tooltip: {
            y: {
                formatter: val => formatNumber(val),
            },
        },
        xaxis: {
            // categories: ["Dec", "Jan", "Feb"],
            categories: [twoMonthsAgo, lastMonth, currentMonth],
            labels: {
                style: {
                    fontSize: "11px",
                    fontWeight: 500,
                    fontFamily: "inherit",
                    colors: "#444",
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
                formatter: (value) => {
                    if (value >= 1000) return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k';
                    else if (value % 1 === 0) return value;
                    else return '';
                },
            },
            min: 0,
        }
    })
  }, []);


    return (
        <div className='card visitor-section' style={{ paddingBottom: 0 }}>
            <div className="section--heading" style={width < 450 ? { textAlign: "center", width: "100%", justifyContent: "center" } : {}}>
                <h2>Website Visitors</h2>
                <p>See how much traffic visit your store website in the last 90 days.</p>
            </div>

            <React.Fragment>
                <div id="chart" className='line-chart'>
                    <ReactApexChart options={options} series={series} type='line' height={180} />
                </div>
                <div id="html-dist"></div>
            </React.Fragment>
        </div>
    )
}

export default VisitorOverview