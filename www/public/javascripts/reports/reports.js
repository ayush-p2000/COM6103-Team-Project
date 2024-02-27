/* globals Chart:false */

document.addEventListener('DOMContentLoaded', function () {
    'use strict'

    //The first dataset is quantity of sales, the second is value of sales
    //Sales should be a red line, value should be a lime green line
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
    ]
    var mock_sales_config_options = {
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

                // grid line settings
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
        }
    }

    //The first dataset is quantative referrals, the second is referral fee value
    //Referrals should be a red line, value should be a green line
    var mock_referrals_dataset = [
        {
            label: 'Referrals',
            data: [5, 8, 12, 55, 22, 4, 7],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0,
        },
        {
            label: 'Value (£)',
            data: [20.52, 40.46, 69.20, 280.24, 123.62, 14.39, 22.80],
            backgroundColor: 'rgba(0,192,0,0.2)',
            borderColor: 'rgb(0,192,0)',
            borderWidth: 1,
            lineTension: 0,
        }
    ]

    //States may be 'in_review', 'listed', 'hidden', 'has_quote', 'sold', 'recycled', 'auction', 'data_retrieval', 'closed (recently)'
    //Bar colors should be 'red', 'yellow', 'gray', 'blue', 'purple', 'green', 'orange', 'lightblue', 'black'
    var mock_device_states_dataset = {
        label: 'Device States',
        data: [16, 75, 4, 45, 107, 55, 10, 32, 42],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(128, 128, 128, 0.2)',
            'rgba(0, 0, 255, 0.2)',
            'rgba(128, 0, 128, 0.2)',
            'rgba(0, 128, 0, 0.2)',
            'rgba(255, 165, 0, 0.2)',
            'rgba(173, 216, 230, 0.2)',
            'rgba(0, 0, 0, 0.2)',
        ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 206, 86)',
            'rgb(128, 128, 128)',
            'rgb(0, 0, 255)',
            'rgb(128, 0, 128)',
            'rgb(0, 128, 0)',
            'rgb(255, 165, 0)',
            'rgb(173, 216, 230)',
            'rgb(0, 0, 0)',
        ],
        borderWidth: 1
    }

    //Device classes may be 'current', 'rare', 'recycle', 'unknown'
    //Bar colors should be 'yellow', 'purple', 'green', 'gray'
    var mock_device_classes_dataset = {
        label: 'Device Classes',
        data: [16, 75, 4, 45],
        backgroundColor: [
            'rgba(255, 206, 86, 0.2)',
            'rgba(128, 0, 128, 0.2)',
            'rgba(0, 128, 0, 0.2)',
            'rgba(128, 128, 128, 0.2)',
        ],
        borderColor: [
            'rgb(255, 206, 86)',
            'rgb(128, 0, 128)',
            'rgb(0, 128, 0)',
            'rgb(128, 128, 128)',
        ],
        borderWidth: 1
    }

    //Device types may be 'phone', 'tablet', 'laptop', 'desktop', 'console', 'other'
    //Bar colors should be 'blue', 'green', 'yellow', 'red', 'orange', 'gray'
    var mock_device_types_dataset = {
        label: 'Device Types',
        data: [16, 75, 4, 45, 107, 55],
        backgroundColor: [
            'rgba(0, 0, 255, 0.2)',
            'rgba(0, 128, 0, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 165, 0, 0.2)',
            'rgba(128, 128, 128, 0.2)',
        ],
        borderColor: [
            'rgb(0, 0, 255)',
            'rgb(0, 128, 0)',
            'rgb(255, 206, 86)',
            'rgb(255, 99, 132)',
            'rgb(255, 165, 0)',
            'rgb(128, 128, 128)',
        ],
        borderWidth: 1
    }

    //Accounts are either 'active' or 'inactive'
    //Bar colors should be 'green', 'red'
    var mock_accounts_dataset = {
        label: 'Accounts',
        data: [75, 16],
        backgroundColor: [
            'rgba(0, 128, 0, 0.2)',
            'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
            'rgb(0, 128, 0)',
            'rgb(255, 99, 132)',
        ],
        borderWidth: 1
    }

    //Account types may be 'User', 'Staff', 'Admin'
    //Bar colors should be 'green', 'blue', 'red'
    var mock_account_types_dataset = {
        label: 'Account Types',
        data: [47, 12, 4],
        backgroundColor: [
            'rgba(0, 128, 0, 0.2)',
            'rgba(0, 0, 255, 0.2)',
            'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
            'rgb(0, 128, 0)',
            'rgb(0, 0, 255)',
            'rgb(255, 99, 132)',
        ],
        borderWidth: 1
    }

    // Call to each chart function
    createChart('#sales_chart', ['January', 'February', 'March', 'April', 'May', 'June', 'July'], mock_sales_dataset, 'line', mock_sales_config_options);
    createChart('#referrals_chart', ['January', 'February', 'March', 'April', 'May', 'June', 'July'], mock_referrals_dataset, 'line');
    createChart('#case_state_chart', ['In Review', 'Listed', 'Hidden', 'Has Quote', 'Sold', 'Recycled', 'Auction', 'Data Retrieval', 'Closed (Recently)'], [mock_device_states_dataset], 'bar');
    createChart('#device_class_chart', ['Current', 'Rare', 'Recycle', 'Unknown'], [mock_device_classes_dataset], 'bar');
    createChart('#device_type_chart', ['Phone', 'Tablet', 'Laptop', 'Desktop', 'Console', 'Other'], [mock_device_types_dataset], 'bar');
    createChart('#accounts_chart', ['Active', 'Inactive'], [mock_accounts_dataset], 'bar');
    createChart('#account_type_chart', ['User', 'Staff', 'Admin'], [mock_account_types_dataset], 'bar');
});