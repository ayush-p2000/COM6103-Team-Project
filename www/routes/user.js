const express = require('express');
const {faker} = require("@faker-js/faker");
const router = express.Router();

//TODO: Remove these once real data is available
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


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/my-profile', (req,res,next) => {
    const user = {
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
        savedCo2: 1232.1
    }
    res.render("user_profile", {user, auth:true, role:'user' })
})

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
  ]
  res.render('marketplace', {items, auth:true, role:'user'})
})


router.get('/list_item', function (req, res, next) {
    res.render('list_item', {auth:true, role:'user'})
});

router.get("/dashboard", (req,res,next) => {
    const items = [
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
    ]
    res.render('dashboard', {items, auth:true, role:'user'})
})

router.get("/my_items", (req,res,next) => {
    const items = [
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
    ]
    res.render('my_items', {items,auth:true, role:'user'})
})


router.get('/item-detail', (req, res, next) => {
    const item = {
        name : 'Iphone 12',
        classification: 'Current',
        purchaseYear: 2022,
        capacity: 128,
        colour: 'Red',
        os: 'IOS',
        deviceType: 'Mobile',
        condition: 'Good'
    }

    res.render('itemDetails', {item})
})



module.exports = router;
