const USER = 0;
const STAFF = 1;
const ADMIN = 2;

const roleTypes = {
    USER,
    STAFF,
    ADMIN,

    roleTypeToString: function (rank) {
        switch (rank) {
            case USER:
                return "User"
            case STAFF:
                return "Staff"
            case ADMIN:
                return "Admin"
            default:
                return "Not Specified"
        }
    }
};

module.exports = roleTypes;