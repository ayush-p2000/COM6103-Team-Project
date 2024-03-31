const CURRENT = 0;
const RARE = 1;
const RECYCLE = 2;
const UNKNOWN = 3;

const deviceCategory = {
    CURRENT,
    RARE,
    RECYCLE,
    UNKNOWN,

    deviceCategoryToString: function (deviceCategory) {
        switch (deviceCategory) {
            case CURRENT:
                return "Current";
            case RARE:
                return "Rare";
            case RECYCLE:
                return "Recycle";
            case UNKNOWN:
            default:
                return "Unknown";
        }
    },

    deviceCategoryToColour: function (deviceCategory, prefix = "") {
        switch (deviceCategory) {
            case CURRENT:
                return prefix + "warning";
            case RARE:
                return prefix + "info";
            case RECYCLE:
                return prefix + "success";
            case UNKNOWN:
            default:
                return prefix + "secondary";
        }
    },

    getList: () => Object.values(deviceCategory).filter(value => typeof value === 'number')
};

module.exports = deviceCategory;