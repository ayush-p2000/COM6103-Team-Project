/* globals Chart:false */

document.addEventListener('DOMContentLoaded', function () {
    var mock_sales_dataset = [
        {
            label: 'Sales',
            data: [0, 10, 5, 2, 20, 30, 45],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y',
        },
        {
            label: 'Value (£)',
            data: [0, 45.28, 27.88, 67.55, 547.55, 687.44, 472.55],
            backgroundColor: 'rgba(0,192,0,0.2)',
            borderColor: 'rgb(0,192,0)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y1',
        }
    ];

    var mock_sales_options = {
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        }
    };

    createChart('#r', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], mock_sales_dataset, 'line', mock_sales_options);

    $('#referrals_table').DataTable({

    });
});