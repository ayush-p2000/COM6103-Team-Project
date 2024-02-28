/*
 * This controller should handle any operations related to account management
 */

function getAccountsPage(req, res, next) {
    const users = [
        {user: 'John', device: 'Phone', level: 'user'},
        {user: 'Alice', device: 'Laptop', level: 'staff'},
        {user: 'Bob', device: 'Tablet', level: 'user'},
    ];
    res.render('admin/user_management', {users});
}

function getAccountDetailsPage(req, res, next) {
    // TODO Remove dummy retrieval
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
    res.render('admin/user_details', {user});
}

function getEditAccountPage(req, res, next) {
    //TODO: Add functionality for editing account details
    res.send('[Edit Account Page Here]')
}

module.exports = {
    getAccountsPage,
    getAccountDetailsPage,
    getEditAccountPage
}