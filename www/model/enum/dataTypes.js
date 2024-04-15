const IMAGE = 8;
const FILE = 9;
const URL = 10;
const ARCHIVE = 11;

const dataTypes = {
    IMAGE,
    FILE,
    URL,
    ARCHIVE,

    dataTypeToString: function (dataType) {
        switch (dataType) {
            case IMAGE:
                return "Image";
            case FILE:
                return "File";
            case URL:
                return "URL";
            case ARCHIVE:
                return "Compressed File";
            default:
                return "Unknown";
        }
    },

    dataTypeToColour: function (dataType, prefix = "") {
        switch (dataType) {
            case IMAGE:
                return prefix + "dark";
            case FILE:
                return prefix + "secondary";
            case URL:
                return prefix + "info";
            case ARCHIVE:
                return prefix + "warning";
            default:
                return prefix + "secondary";
        }
    },

    getList: () => Object.values(dataTypes).filter(value => typeof value === 'number')
};

module.exports = dataTypes;
