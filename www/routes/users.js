var express = require('express');
const {faker} = require("@faker-js/faker");
var router = express.Router();

//TODO: Remove these once real data is available
function getMockPurchaseData() {
    const {faker} = require('@faker-js/faker');

    var data = [];

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


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/payment/completed', function (req, res, next) {
    res.render('payment_completed', {title: 'Payment Completed', order: getMockPurchaseData()});
});

router.get("/payment", (req,res,next) => {
  res.render('payment', {})
})

router.get("/marketplace", (req,res,next) => {
  // Dummy Data
  const items = [
      {
        id: 1,
        name: "Iphone15 pro",
        picUrl: "https://ee.co.uk/medias/iphone-15-pro-natural-titanium-desktop-detail-1-WebP-Format-488?context=bWFzdGVyfHJvb3R8MjQ1MTh8aW1hZ2Uvd2VicHxzeXMtbWFzdGVyL3Jvb3QvaGExL2hhMC8xMDA3MzUxMjM0NTYzMC9pcGhvbmUtMTUtcHJvLW5hdHVyYWwtdGl0YW5pdW0tZGVza3RvcC1kZXRhaWwtMV9XZWJQLUZvcm1hdC00ODh8YzIxNTNmMjQ2NWVkNTAzMDA4NjgxOWEzMThmMjJhNTY4MTgwYjAzN2NkOWVkZDBjZWM0YmNkNWIyNjAwNmM1NQ",
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
  ]
  res.render('marketplace', {items})
})

router.get("/user_dashboard", (req,res,next) => {
    const items = [
        {
            id: 1,
            name: "Iphone15 pro",
            picUrl: "https://ee.co.uk/medias/iphone-15-pro-natural-titanium-desktop-detail-1-WebP-Format-488?context=bWFzdGVyfHJvb3R8MjQ1MTh8aW1hZ2Uvd2VicHxzeXMtbWFzdGVyL3Jvb3QvaGExL2hhMC8xMDA3MzUxMjM0NTYzMC9pcGhvbmUtMTUtcHJvLW5hdHVyYWwtdGl0YW5pdW0tZGVza3RvcC1kZXRhaWwtMV9XZWJQLUZvcm1hdC00ODh8YzIxNTNmMjQ2NWVkNTAzMDA4NjgxOWEzMThmMjJhNTY4MTgwYjAzN2NkOWVkZDBjZWM0YmNkNWIyNjAwNmM1NQ",
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
    ]
    res.render('user_dashboard', {items})
})


module.exports = router;
