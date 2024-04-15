const {CURRENT} = require("../../model/enum/deviceCategory");
const {HAS_QUOTE} = require("../../model/enum/deviceState");
const {DATA_WIPING} = require("../../model/enum/dataService");
const {ACCEPTED} = require("../../model/enum/quoteState");

/*
 * This file is used to provide mock data for the application.
 * This is used to provide data for testing purposes when real data is not available yet.
 */

const getMockUser = () => {
    return {
        firstName: "Elon",
        lastName: "Musk",
        id: 4643123,
        avatar: `https://ui-avatars.com/api/?name=Elon+Musk`,
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
        ],
        savedCo2: 11245
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
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 2,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 3,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 4,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 5,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 6,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 7,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 8,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 9,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
        {
            id: 10,
            name: "Apple Watch(SE)-2022",
            picUrl: "https://source.unsplash.com/random/200x200",
            classification: "Recycle",
            deviceType: "Watch",
            price: 169,
            owner: "Terenz"
        },
    ];
}

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

    const choices = ["CEX", "GAME", "eBay", "Recycling"]

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

const getMockQuote = () => {
    return {
        _id: "123",
        device: {
            device_type: {
                _id: "123",
                name: "Phone",
                description: "A mobile phone"
            },
            brand: {
                _id: "123",
                name: "Apple",
                models: []
            },
            model: {
                _id: "123",
                name: "iPhone 12",
                category: CURRENT,
                properties: [
                    {
                        name: "Colour",
                        value: "Red"
                    },
                    {
                        name: "OS",
                        value: "IOS"
                    },
                    {
                        name: "Capacity",
                        value: "128GB"
                    }
                ],
                device_type: {
                    _id: "123",
                    name: "Phone",
                    description: "A mobile phone"
                },
                brand: {
                    _id: "123",
                    name: "Apple",
                    models: []
                }
            },
            details: [
                {
                    name: "Colour",
                    value: "Red"
                },
                {
                    name: "OS",
                    value: "IOS"
                },
                {
                    name: "Capacity",
                    value: "128GB"
                }
            ],
            category: CURRENT,
            good_condition: true,
            state: HAS_QUOTE,
            data_service: DATA_WIPING,
            additionalDetails: "This is a test quote, but pretend there is information about the specific device here.",
            listing_user: {
                _id: "123",
                first_name: "John",
                last_name: "Doe",
                email: "JDoe@email.com",
                phone: "1234567890",
                address: {
                    address_1: "1 Main St.",
                    address_2: "Apt. 123",
                    city: "Anytown",
                    country: "United Kingdom",
                    post_code: "AB1 2CD"
                }
            },
            photos: [],
            visible: true,
        },
        provider: {
            name: "CEX",
            logo: "https://uk.webuy.com/img/logos/CeX_Logo_Rich_black_CMYK-01.png",
            does_wiping: true,
        },
        value: 39934,
        state: ACCEPTED,
        //Today + 2 days
        expiry: (new Date()).setTime((new Date()).getTime() + (2 * 24 * 60 * 60 * 1000)),
        //Today - 2 days
        createdAt: (new Date()).setTime((new Date()).getTime() - (2 * 24 * 60 * 60 * 1000)),
        //Today - 2h
        updatedAt: (new Date()).setTime((new Date()).getTime() - (2 * 60 * 60 * 1000)),
    }
}

const getMockLandingCarousel = () => {
    return [
        {
            _id: 1,
            model: {
                name: "iPhone 12 Pro"
            },
            quote: {
                value: 7
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 2,
            model: {
                name: "Samsung Galaxy S21 Ultra"
            },
            quote: {
                value: 3
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 3,
            model: {
                name: "Google Pixel 6"
            },
            quote: {
                value: 5
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 4,
            model: {
                name: "iPad Air (2020)"
            },
            quote: {
                value: 9
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 5,
            model: {
                name: "MacBook Pro (M1)"
            },
            quote: {
                value: 2
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 6,
            model: {
                name: "Dell XPS 13"
            },
            quote: {
                value: 8
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 7,
            model: {
                name: "Apple Watch Series 7"
            },
            quote: {
                value: 4
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 8,
            model: {
                name: "Fitbit Charge 5"
            },
            quote: {
                value: 6
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 9,
            model: {
                name: "Surface Laptop 4"
            },
            quote: {
                value: 10
            },
            img: "https://source.unsplash.com/random/200x200"
        },
        {
            _id: 10,
            model: {
                name: "OnePlus 9 Pro"
            },
            quote: {
                value: 1
            },
            img: "https://source.unsplash.com/random/200x200"
        }]

}

module.exports = {
    getMockAccountsList,
    getMockItems,
    getMockUser,
    getMockPurchaseData,
    getMockGraphData,
    getMockSalesData,
    getMockUserId,
    getMockItem,
    getMockQuote,
    getMockLandingCarousel
}