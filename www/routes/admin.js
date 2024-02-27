const express = require('express');
const router = express.Router();


router.get('/:contentType?', (req, res, next) => {
    const contentRoute = req.params.contentType
    const admin = {
        name: "Chuck",
        lastName: "Norris"
    }
    // TODO: Remove dummy data
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
    }
    if (!contentRoute) {
        res.render('admin/admin_layout', {admin,numOfUsers: 11, savedCo2:124.3, numOfFinishedTransactions: 1121,currentRoute:'dashboard'})
    } else {
        res.render('admin/admin_layout', {user, currentRoute: contentRoute})
    }
})




module.exports = router;