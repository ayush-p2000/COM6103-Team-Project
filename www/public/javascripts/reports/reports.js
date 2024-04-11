/* globals Chart:false */

document.addEventListener('DOMContentLoaded', function () {
    'use strict'

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

    // Call to each chart function
    createChart('#referrals_chart', ['January', 'February', 'March', 'April', 'May', 'June', 'July'], mock_referrals_dataset, 'line');
});