/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

var {getAllDeviceType, getAllBrand, getModels, listDevice, getDevice} = require('../../model/mongodb');
const {getMockItem} = require("../../util/mock/mockData");

/**
 * Handling Request to post item base on the info in request body
 * @author Zhicong Jiang
 */
const postListItem = async (req, res) => {
    try {
        const files = req.files;
        const filePaths = [];
        for (let i = 0; i < files.length; i++) {
            const filePath = files[i].path;
            filePaths.push(filePath);
        }
        const deviceId = await listDevice(req.body,filePaths,req.user);
        res.status(200).send(deviceId);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

/**
 * Respond form view for user to post item
 * @author Zhicong Jiang
 */
async function getListItem(req, res) {
    var id = req.params.id;
    if (typeof id === 'undefined') {
        try {
            let deviceTypes = await getAllDeviceType();
            let brands = await getAllBrand();
            res.render('marketplace/list_item', {
                auth: req.isLoggedIn,user:req.user, role: 'user',
                deviceTypes: deviceTypes, brands: brands
            });
        } catch (err) {
            console.log(err)
        }
    }else{
        let fakeId = "65f22cad3182eff411981168"
        try{
            let device = await getDevice(fakeId);
            res.render('marketplace/edit_item', {
                auth: req.isLoggedIn,user:req.user, role: 'user', device: device[0]
            });
            // res.send(device)
        }catch (err){
            console.log(err)
        }
    }
}

/**
 * get specific Model By querying Brand And DeviceType
 * @author Zhicong Jiang
 */
async function getModelByBrandAndType(req, res) {
    try {
        let models = await getModels(req.query.brand,req.query.deviceType);
        res.send(models);
    } catch (err) {
        res.send(err)
    }
}


function getItemDetails(req, res, next) {
    const item = getMockItem()
    res.render('marketplace/item_details', {item, auth: req.isLoggedIn, user:req.user})
}

function getItemQrCode(req, res, next) {
    //TODO: Add functionality for generating QR code for item
    res.send('[Item QR Code Here]')
}

module.exports = {
    postListItem,
    getListItem,
    getModelByBrandAndType,
    getItemDetails,
    getItemQrCode
}