const express = require('express');
const {faker} = require("@faker-js/faker");
const router = express.Router();

//TOOD: Remove these once real data is available
function getMockSalesData() {
    const {faker} = require('@faker-js/faker');

    const data = [];

    const devices = [
        'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
        'Samsung Galaxy S21', 'Samsung Galaxy S21+', 'Samsung Galaxy S21 Ultra', 'Samsung Galaxy Note20', 'Samsung Galaxy Note20 Ultra',
        'Google Pixel 5', 'Google Pixel 4a', 'Google Pixel 4a 5G',
        'Dell XPS 13', 'MacBook Pro', 'Lenovo ThinkPad X1', 'HP Spectre x360',
        'OnePlus 9', 'OnePlus 9 Pro', 'OnePlus 8T', 'OnePlus Nord',
        'Huawei P40', 'Huawei P40 Pro', 'Huawei Mate 40 Pro'
    ];

    for (let i = 0; i < 7; i++) {
        data.push(
            {
                date: faker.date.past().toLocaleDateString(),
                device: {
                    name: faker.helpers.arrayElement(devices),
                    id: faker.string.uuid()
                },
                user: {
                    name: faker.internet.userName(),
                    id: faker.string.uuid()
                },
                price: faker.commerce.price({min: 0, max: 350, symbol: "£"}),
                referral: faker.commerce.price({min: 0, max: 35, symbol: "£"})
            });
    }

    return data;
}

function getMockGraphData() {
    const {faker} = require('@faker-js/faker');

    //Months Jan-Jul
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

    //Sales and Value
    const sales = [];
    const value = [];
    for (var i = 0; i < 7; i++) {
        sales.push(faker.number.int({min: 0, max: 50}));
        value.push(faker.finance.amount({min: 0, max: 1000}));
    }

    return {
        labels: labels,
        datasets: [{
            label: 'Sales',
            data: sales,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y'
        }, {
            label: 'Value (£)',
            data: value,
            backgroundColor: 'rgba(0,192,0,0.2)',
            borderColor: 'rgb(0,192,0)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y1'
        }]
    };

}

/* GET users listing. */
router.get('/reports', function (req, res, next) {
    res.render('reports/reports', {title: 'Reports'});
});

router.get('/reports/:reportType', function (req, res, next) {
    const type = req.params.reportType;
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    const data = getMockGraphData();
    res.render('reports/report', {
        title: title,
        report: type,
        data: {labels: data.labels, datasets: data.datasets, table: getMockSalesData()}
    });
});

module.exports = router;