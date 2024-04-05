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

    deviceCategoryToRGB: function (deviceCategory, border = false) {
        switch (deviceCategory) {
            case CURRENT:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
            case RARE:
                return border ? 'rgb(13,202,240)' : 'rgba(13,202,240, 0.2)';
            case RECYCLE:
                return border ? 'rgb(0, 128, 0)' : 'rgba(0, 128, 0, 0.2)';
            case UNKNOWN:
            default:
                return border ? 'rgb(255, 99, 132)' : 'rgba(255, 99, 132, 0.2)';
        }
    },

    getList: () => Object.values(deviceCategory).filter(value => typeof value === 'number')
};

module.exports = deviceCategory;