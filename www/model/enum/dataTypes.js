const STRING = 0;
const NUMBER = 1;
const BOOLEAN = 2;
const RANGE = 3;
const ENUM = 4;
const OBJECT = 5;
const ARRAY = 6;
const DATE = 7;
const IMAGE = 8;
const FILE = 9;
const URL = 10;

const dataTypes = {
    STRING,
    NUMBER,
    BOOLEAN,
    RANGE,
    ENUM,
    OBJECT,
    ARRAY,
    DATE,
    IMAGE,
    FILE,
    URL,

    dataTypeToString: function (dataType) {
        switch (dataType) {
            case STRING:
                return "String";
            case NUMBER:
                return "Number";
            case BOOLEAN:
                return "Boolean";
            case RANGE:
                return "Range";
            case ENUM:
                return "Enum";
            case OBJECT:
                return "Object";
            case ARRAY:
                return "Array";
            case DATE:
                return "Date";
            case IMAGE:
                return "Image";
            case FILE:
                return "File";
            case URL:
                return "URL";
            default:
                return "Unknown";
        }
    },

    dataTypeToColour: function (dataType, prefix = "") {
        switch (dataType) {
            case STRING:
                return prefix + "secondary";
            case NUMBER:
                return prefix + "info";
            case BOOLEAN:
                return prefix + "success";
            case RANGE:
                return prefix + "warning";
            case ENUM:
                return prefix + "danger";
            case OBJECT:
                return prefix + "primary";
            case ARRAY:
                return prefix + "dark";
            case DATE:
                return prefix + "light";
            case IMAGE:
                return prefix + "dark";
            case FILE:
                return prefix + "dark";
            case URL:
                return prefix + "dark";
            default:
                return prefix + "secondary";
        }
    },

    getList: () => Object.values(dataTypes).filter(value => typeof value === 'number')
};

module.exports = dataTypes;
