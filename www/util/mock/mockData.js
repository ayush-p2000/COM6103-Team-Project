const getMockUser = () => {
    return {
        firstName: "Elon",
        lastName: "Musk",
        id: 4643123,
        avatar: "https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1708387200&semt=ais",
        addressSecond: "31 Tesla Road",
        addressFirst: "Moon Campus",
        city: "Interstellar",
        country: "Mars",
        postCode: "SPACE-X",
        email: "elon@musk.com",
        phone: "+44 111 222 333",
        dateOfBirth: "28.06.1971",
        items: [
            {
                id: 321,
                name: "Intel Xeon E5",
                details: "https://www.etb-tech.com/intel-xeon-e5-2650-v4-2-20ghz-12-core-cpu-sr2n3.html?currency=GBP&gad_source=1&gclid=CjwKCAiA_tuuBhAUEiwAvxkgTo9_Kq6ILUWOwvAuIErKt9HN8bRVO8hS4eNyqKKMYWaGYN-ckYyg0xoCwKAQAvD_BwE",
                status: "Approved",
            },
            {
                id: 231,
                name: "Philips Kettle",
                details: "https://www.philips.co.uk/c-m-ho/kettles/kettle/latest#availability=instock&filters=KETTLES_SU",
                status: "In process",
            }
        ]
    };
}

const getMockAccountsList = () => {
    return [
        {id: '123', user: 'John', device: 'Phone', level: 'user'},
        {id: '456', user: 'Alice', device: 'Laptop', level: 'staff'},
        {id: '789', user: 'Bob', device: 'Tablet', level: 'user'},
    ];
}

const getMockItems = () => {
    return [
        {
            id: 1,
            name: "Iphone15 pro",
            picUrl: "https://m.media-amazon.com/images/I/81Wwngkh2OL.__AC_SY445_SX342_QL70_ML2_.jpg",
            classification: "Current",
            deviceType: "Phone",
            price: 599,
            owner: "Terenz"
        },
        {
            id: 2,
            name: "iPad 10.9-2022",
            picUrl: "https://majormobiles.com/cdn/shop/products/blue_20fc3cd7-c225-45e1-bdad-7e1537f8fa00_295x.jpg?v=1667829428",
            classification: "Recycle",
            deviceType: "Tablet",
            price: 399,
            owner: "Terenz"
        },
        {
            id: 3,
            name: "13-inch MacBook Air",
            picUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-space-gray-config-" +
                "201810?wid=1078&hei=624&fmt=jpeg&qlt=90&.v=1664499515473",
            classification: "Current",
            deviceType: "Laptop",
            price: 899,
            owner: "Terenz"
        },
        {
            id: 4,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://www.backmarket.co.uk/cdn-cgi/image/format%3Dauto%2Cquality%3D75%2Cwidth%3D828/https://d2e6ccu" +
                "jb3mkqf.cloudfront.net/ea9b978e-789e-4882-a7f7-f6325c2574ca-1_09f5ca86-d5bf-4db4-bdc8-43eafdd98b5d.jpg",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
    ];
}

//TODO: Remove these once real retrieval is available
function getMockPurchaseData() {
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

    const choices = [ "CEX", "GAME", "eBay", "Recycling"]

    const paymentMethod = ["PayPal", "Stripe"]

    const order = {
        id: faker.string.alpha(10),
        amount: faker.finance.amount(),
        referral_amount: faker.finance.amount({min: 1, max: 35}),
        currency: "£",
        date: faker.date.recent(),
        endpoint: faker.helpers.arrayElement(choices),
        paymentMethod: faker.helpers.arrayElement(paymentMethod),
        products: [
            {
                id: faker.string.uuid(),
                name: faker.helpers.arrayElement(devices),
                price: faker.finance.amount(),
                data_retrieval: faker.datatype.boolean(),
            },
        ],
    };

    return order;
}

//TODO: Remove these once real retrieval is available
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

function getMockItem() {
    return {
        name: 'Iphone 12',
        classification: 'Current',
        purchaseYear: 2022,
        capacity: 128,
        colour: 'Red',
        os: 'IOS',
        deviceType: 'Mobile',
        condition: 'Good'
    };
}


function getMockUserId() {
    return '65eac7a0f2954ef5775b1837'
}

module.exports = {
    getMockAccountsList,
    getMockItems,
    getMockUser,
    getMockPurchaseData,
    getMockGraphData,
    getMockSalesData,
    getMockItem,
    getMockUserId
}