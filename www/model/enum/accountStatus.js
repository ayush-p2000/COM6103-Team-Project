const INACTIVE = 0
const ACTIVE = 1


const accountStatus = {
    ACTIVE,
    INACTIVE,

    accountStatusToRGB: function (status, border = false) {
        switch (status) {
            case ACTIVE:
                return border ? 'rgb(0, 128, 0)' : 'rgba(0, 128, 0, 0.2)';
            case INACTIVE:
                return border ? 'rgb(255, 99, 132)' : 'rgba(255, 99, 132, 0.2)';
            default:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
        }
    },

    getList: () => Object.values(accountStatus).filter(value => typeof value === 'number')
};

module.exports = accountStatus;
