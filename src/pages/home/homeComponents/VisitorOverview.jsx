import React from 'react';
import ReactApexChart from 'react-apexcharts';

const series = [
    {
        name: 'Website Visitors',
        data: [ null, 0, 5, 4, null ],
        color: '#FF6B35'
    },
];


const options = {
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
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
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
    xaxis: {
        categories: [ 'Aug', 'Sep', 'Oct', 'Nov', "Dec" ],
        labels: {
            style: {
                fontSize: '11px',
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
        },
        min: 0,
    }
};

function VisitorOverview() {
    return (
        <div className='card visitor-section' style={{ paddingBottom: 0 }}>
            <div className="section--heading">
                <h2>Website Visitors</h2>
                <p>See how many person visit your wesite.</p>
            </div>


            <>
                <div id="chart" className='line-chart'>
                    <ReactApexChart options={options} series={series} type='line' height={180} />
                </div>
                <div id="html-dist"></div>
            </>
        </div>
    )
}

export default VisitorOverview