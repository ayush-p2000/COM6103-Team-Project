/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

function getUserDashboard(req, res, next) {
    //TODO: Add functionality for the user dashboard
    res.render("user/dashboard", {user: getMockUserData(), auth: true, role: "user"})
}

function getUserProfile(req, res, next) {
    const user = getMockUserData()
    res.render("user/user_profile", {user, auth: true, role: "user"})
}

function getMockUserData() {
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
        savedCo2: 1232.1
    };
}

module.exports = {
    getUserProfile,
    getUserDashboard
}