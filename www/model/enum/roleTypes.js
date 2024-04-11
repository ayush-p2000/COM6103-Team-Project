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
    },

    roleTypeToRGB: function (status, border = false) {
        switch (status) {
            case USER:
                return border ? 'rgb(0, 128, 0)' : 'rgba(0, 128, 0, 0.2)';
            case ADMIN:
                return border ? 'rgb(0,0,255)' : 'rgba(0,0,255, 0.2)';
            case STAFF:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
            default:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
        }
    },

    getList: () => Object.values(roleTypes).filter(value => typeof value === 'number')
};

module.exports = roleTypes;