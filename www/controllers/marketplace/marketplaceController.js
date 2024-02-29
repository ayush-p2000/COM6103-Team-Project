/*
 * This controller should handle any operations related to the marketplace itself
 */

function getMockItems() {
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

function getMarketplace(req, res, next) {
    // Dummy Data
    const items = getMockItems()
    res.render('marketplace/marketplace', {items, auth: true, role: "user"})
}

function getMyItems(req, res, next) {
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
    res.render('marketplace/my_items', {items, auth: true, role: "user"})
}

module.exports = {
    getMarketplace,
    getMyItems
}