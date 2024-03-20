/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const { getPaginatedResults } = require("../../model/utils/utils")
const { Device} = require("../../model/schema/device")
const {getUserItems, getHistoryByDevice,getAllDevices} = require('../../model/mongodb')

const {join} = require("path");
const deviceState =require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")

/**
 * Get All Users Devices
 * @author Zhicong Jiang
 */
const getMarketplace = async (req, res, next) => {
    const {items, pagination} = await getPaginatedResults(Device, req.params.page, {},{}, 3);
    try {
        var devices = await getAllDevices()
        for (const item of devices) {
            if (item.model == null) {
                var deviceType = ""
                var brand = ""
                var model = ""
                const customModel = await getHistoryByDevice(item._id)
                customModel[0].data.forEach(data => {
                    if (data.name === "device_type") {
                        deviceType = data.value
                    } else if (data.name === "brand") {
                        brand = data.value
                    } else if (data.name === "model") {
                        model = data.value
                    }
                });
                item.device_type = {name: deviceType}
                item.brand = {name: brand}
                item.model = {name: model}
            }
        }
    }catch (e){
        console.log(e)
    }
    res.render('marketplace/marketplace', {devices, items,deviceCategory, auth: req.isLoggedIn, user:req.user, pagination})
}

/**
 * Get User's items to display it in the my-items page, so that the user can see what items they have listed in the application
 * @author Vinroy Miltan Dsouza & Zhicong Jiang
 */
async function getMyItems(req, res, next) {
    try{
        const items = await getUserItems(req.user.id)
        for (const item of items) {
            if (item.model == null) {
                var deviceType = ""
                var brand = ""
                var model = ""
                const customModel = await getHistoryByDevice(item._id)
                customModel[0].data.forEach(data => {
                    if (data.name === "device_type"){
                        deviceType = data.value
                    }else if(data.name === "brand"){
                        brand = data.value
                    }else if(data.name === "model"){
                        model = data.value
                    }
                });
                item.device_type = {name:deviceType}
                item.brand = {name:brand}
                item.model = {name:model}
            }
        }
        res.render('marketplace/my_items', {items, deviceState, deviceCategory, auth: req.isLoggedIn, user:req.user, role:'user'})
    }catch (e) {
        console.log(e)
    }
}

module.exports = {
    getMarketplace,
    getMyItems
}