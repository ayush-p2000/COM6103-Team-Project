/*
 * This controller should handle any operations related to device management or device type management
 */

const gsmarena = require('gsmarena-api');
const {get} = require("axios");
const {renderAdminLayout, renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");
const {
    getItemDetail,
    getAllDeviceType,
    getAllBrand,
    updateDeviceDetails,
    getModels,
    getAllUnknownDevices,
    addDeviceType,
    addBrand,
    addModel,
    getUnknownDeviceHistoryByDevice,
    getAllDevices, addHistory, getReviewHistory,
    getAllModels,
    getBrandById,
    getDeviceTypeById,
    getModelById,
    updateDeviceTypeDetails,
    updateBrandDetails,
    updateModelDetails,
    getAllModelsOfType,
    deleteType,
    deleteModel,
    deleteBrand,
    getAllRetrievalDevices,
    getAllModelsTableData,
    updateUnknownDevices
} = require("../../model/mongodb")

const dataService = require("../../model/enum/dataService")
const deviceCategory = require("../../model/enum/deviceCategory")
const deviceState = require("../../model/enum/deviceState")
const deviceColor = require("../../model/enum/deviceColors")
const deviceCapacity = require("../../model/enum/deviceCapacity")

const historyType = require("../../model/enum/historyType");
const {email} = require("../../public/javascripts/Emailing/emailing");
const roleTypes = require("../../model/enum/roleTypes");
const {handleMissingModel,handleMissingModels} = require("../../util/Devices/devices");

/**
 * Get All Device with Specific Field Showing and Support Unknown Devices
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function getDevicesPage(req, res, next) {
    const devices = await getAllDevices();
    await handleMissingModels(devices);
    renderAdminLayout(req, res, "devices", { devices: devices, deviceState, deviceCategory });
}

/**
 * Get Flagged Devices and Display for the Staff
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function getFlaggedDevicesPage(req, res, next) {
    try {
        const devices = await getAllUnknownDevices()
        const deviceTypes = await getAllDeviceType()
        const brands = await getAllBrand()

        renderAdminLayout(req, res, "unknown_devices", {devices, deviceTypes, brands});
    } catch (e) {
        console.log(e)
        res.status(500);
        next(e);
    }
}

async function getRetrievalDevicesPage(req, res, next) {
    try {
        const devices = await getAllRetrievalDevices()
        const deviceTypes = await getAllDeviceType()
        const brands = await getAllBrand()

        renderAdminLayout(req, res, "retrieval_devices", {devices,deviceTypes,brands, deviceCategory, deviceState});
    } catch (e) {
        console.log(e)
        res.status(500);
        next(e);
    }
}

/**
 * Get Data From Request and Pass it To Add DeviceType to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function postNewDeviceType(req, res, next) {
    try {
        const deviceType = await addDeviceType(req.body.name, req.body.description)
        res.status(200).send("Device Type Added Successfully")
    } catch (e) {
        console.log(e)
    }
}

/**
 * Get Data From Request and Pass it To Add Brand to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function postNewBrand(req, res, next) {
    try {
        const brand = await addBrand(req.body.name)
        res.status(200).send("Brand Added Successfully")
    } catch (e) {
        console.log(e)
    }
}

/**
 * Get Data From Request and Pass it To Add Model to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function postNewModel(req, res, next) {
    try {

        var properties = []
        var category = 3

        const devices = await gsmarena.search.search(req.body.name);
        if (devices[0]) {
            let slug = devices[0].id
            const devicesDetail = await get(`https://phone-specs-clzpu7gyh-azharimm.vercel.app/${slug}`)
            if (devicesDetail.data) {
                var released = parseInt(devicesDetail.data.data.release_date.match(/\b\d+\b/)[0])
                properties.push({name: 'picture', value: devicesDetail.data.data.thumbnail})
                properties.push({name: "specifications", value: JSON.stringify(devicesDetail.data.data.specifications)})
                properties.push({name: "released", value: released})
                //Greater than 10 is 2，5-10 is 1, 0-5 is 0
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear()
                if ((currentYear - released) <= 5) {
                    category = 0
                } else if ((currentYear - released) > 5 && (currentYear - released) <= 10) {
                    category = 1
                } else {
                    category = 2
                }
            }
        }

        const model = await addModel(req.body, properties, category)

        const updatedUnknownDevices = await updateUnknownDevices(model.deviceType, model.brand, model._id)

        res.status(200).send("successfully")
    } catch (e) {
        console.log(e)
    }
}

async function getDeviceTypePage(req, res, next) {
    const subpage = req.params.subpage ? req.params.subpage : "brands";
    const deviceTypes = await getAllDeviceType()
    const brands = await getAllBrand()
    const models = subpage === "models" ? await getAllModelsTableData() : [];
    renderAdminLayoutPlaceholder(req, res, "device_types", {brands,deviceTypes,subpage,models}, null)
}

/**
 * Device Type Details View Controller
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
async function getDeviceTypeDetailsPage(req, res, next) {
    const subpage = req.params.subpage
    const id = req.params.id

    let item = {}
    let brands = [];
    let deviceTypes = []
    let typeModels = []
    try {
        switch (subpage){
            case "brands":
                item = await getBrandById(id);
                break;
            case "models":
                item = await getModelById(id)
                deviceTypes = await getAllDeviceType()
                brands = await getAllBrand()
                break;
            case "device-types":
                item = await getDeviceTypeById(id)
                typeModels = await getAllModelsOfType(item.id)
                break;
            default:
                res.redirect("/admin/types")
        }
    }catch (err){
        res.status(500)
        console.log(err)
        next(err)
    }

// Make subpage singular form
    const itemType = subpage.slice(0,-1)

    renderAdminLayoutPlaceholder(req,res, "device_type_details", {item, itemType, brands, deviceTypes, typeModels}, null)
}
/**
 * Update Device Type
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const updateDeviceType = async (req,res,next) => {
    const id = req.params.id
    const subpage = req.params.subpage
    if (req.session.messages.length > 0) {
        return res.redirect(`/admin/types/${subpage}/${id}`)
    }

    try {
        switch (subpage){
            case "brands":
                await updateBrandDetails(id, req.body.name)
                break;
            case "models":
                await updateModelDetails(id, req.body.name, req.body.modelBrand, req.body.modelType)
                break;
            case "device-types":
                await updateDeviceTypeDetails(id, req.body.name, req.body.description)
                break;
            default:
                res.redirect("/admin/types")
        }
    }catch(err){
        console.log("here")

        res.status(500)
        console.log(err)
        return next(err)
    }

    res.redirect(`/admin/types/${subpage}/${id}`)
}
/**
 * Delete Device Type
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const deleteDeviceType = async (req,res,next) => {
    const id = req.params.id
    const subpage = req.params.subpage
    try {
        switch (subpage){
            case "brands":
                await deleteBrand(id)
                break;
            case "models":
                await deleteModel(id)
                break;
            case "device-types":
                await deleteType(id)
                break;
            default:
                res.redirect("/admin/types")
        }
    }catch (err){
        res.status(500)
        console.log(err)
        next(err)
    }

    res.redirect(`/admin/types/${subpage}`)

}
/**
 * Get method to retrieve the details of the device from the staff side, which is then used to update the details of the device
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function getUserDeviceDetailsPage(req, res, next) {
    try {
        const item = await getItemDetail(req.params.id)
        const deviceTypes = await getAllDeviceType()
        const brands = await getAllBrand()
        var models = []
        var specs = []

        if (item.model != null) {
            models = await getModels(item.brand._id, item.device_type._id)
            const specProp = item.model.properties.find(property => property.name === 'specifications')?.value;
            if (specProp != null) {
                specs = JSON.parse(specProp)
            } else {
                specs = []
            }
        }

        await handleMissingModel(item);

        //Get the review history of the device
        const reviewHistory = await getReviewHistory(item._id);

        renderAdminLayout(req, res, "edit_details", {
            item,
            deviceTypes,
            brands,
            models,
            specs,
            reviewHistory,
            roleTypes,
            historyType,
            dataService,
            deviceCategory,
            deviceState,
            colors: deviceColor,
            capacities: deviceCapacity
        }, "User Device Details page")

    } catch (err) {
        console.log(err)
        res.status(500)
        next(err)
    }

}

/**
 * Get method to retrieve the details of the device from the staff side, which is then used to update the details of the device
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getModelsFromTypeAndBrand(req, res) {
    const {deviceType, deviceBrand} = req.body
    try {
        const models = await getModels(deviceType, deviceBrand)
        res.json({models})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "internal server error"})
    }
}

/**
 * Update method to update the details of the device from the staff side, which is used when staff wants to change the device visibility, state etc.
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const updateUserDeviceDetailsPage = async (req, res) => {
    try {
        const item_id = req.params.id;
        const updatedItem = await updateDeviceDetails(item_id, req.body)
        res.status(200).send(updatedItem._id)
    } catch (err) {
        console.log(err)
    }
}

const postDevicePromotion = async (req, res) => {
    try {
        //Get the device object from the request
        const item = req.device;

        //Promote the device
        const newValue = deviceState.getNextTypicalState(item.state)
        if (deviceState.isValidStateValue(newValue)) {
            item.state = newValue;

            if (newValue === deviceState.REJECTED) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.REVIEW_REJECTED,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);
            } else if (newValue === deviceState.LISTED) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.ITEM_APPROVED,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);

                const reviewHistory = await getReviewHistory(item._id);
                if (reviewHistory?.length > 0 && reviewHistory[0]?.history_type === historyType.REVIEW_REQUESTED || reviewHistory[0]?.history_type === historyType.REVIEW_REJECTED) {
                    //Add another history item approving the review
                    const newHistoryObject = {
                        device: item._id,
                        history_type: historyType.REVIEW_ACCEPTED,
                        data: [],
                        actioned_by: req.user.id
                    };
                    await addHistory(newHistoryObject.device, newHistoryObject.history_type, newHistoryObject.data, newHistoryObject.actioned_by);
                }
            } else if (newValue === deviceState.HIDDEN) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.ITEM_HIDDEN,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);
            }
        }

        await item.save();

        res.status(200).send('Device promoted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

const postDeviceDemotion = async (req, res) => {
    try {
        //Get the device object from the request
        const item = req.device;

        //Demote the device
        const newValue = deviceState.getPreviousTypicalState(item.state)
        if (deviceState.isValidStateValue(newValue)) {
            item.state = newValue;

            if (newValue === deviceState.REJECTED) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.REVIEW_REJECTED,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);
            } else if (newValue === deviceState.LISTED ) {
                    item.visible = true;
                    const historyObject = {
                        device: item._id,
                        history_type: historyType.ITEM_APPROVED,
                        data: [],
                        actioned_by: req.user.id
                    };
                    await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);

                    const reviewHistory = await getReviewHistory(item._id);
                    if (reviewHistory.length > 0 && reviewHistory[0].history_type === historyType.REVIEW_REQUESTED || reviewHistory[0].history_type === historyType.REVIEW_REJECTED) {
                        //Add another history item approving the review
                        const newHistoryObject = {
                            device: item._id,
                            history_type: historyType.REVIEW_ACCEPTED,
                            data: [],
                            actioned_by: req.user.id
                        };
                        await addHistory(newHistoryObject.device, newHistoryObject.history_type, newHistoryObject.data, newHistoryObject.actioned_by);
                    }
            } else if (newValue === deviceState.HIDDEN) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.ITEM_HIDDEN,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);
            }
        }

        await item.save();

        res.status(200).send('Device demoted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

const postDeviceStateOverride = async (req, res) => {
    try {
        //Get the new state from the request
        const newState = parseInt(req.body.state);

        //Get the device object from the request
        const item = req.device;

        if (!newState || isNaN(newState)) {
            res.status(400).send('Invalid state value');
            return;
        }

        //Override the device state
        if (deviceState.isValidStateValue(newState)) {
            item.state = newState;

            if (newState === deviceState.REJECTED) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.REVIEW_REJECTED,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);
            } else if (newState === deviceState.LISTED) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.ITEM_APPROVED,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);

                const reviewHistory = await getReviewHistory(item._id);
                if (reviewHistory.length > 0 && reviewHistory[0].history_type === historyType.REVIEW_REQUESTED || reviewHistory[0].history_type === historyType.REVIEW_REJECTED) {
                    //Add another history item approving the review
                    const newHistoryObject = {
                        device: item._id,
                        history_type: historyType.REVIEW_ACCEPTED,
                        data: [],
                        actioned_by: req.user.id
                    };
                    await addHistory(newHistoryObject.device, newHistoryObject.history_type, newHistoryObject.data, newHistoryObject.actioned_by);
                }
            } else if (newState === deviceState.HIDDEN) {
                const historyObject = {
                    device: item._id,
                    history_type: historyType.ITEM_HIDDEN,
                    data: [],
                    actioned_by: req.user.id
                };
                await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);
            }
        }

        await item.save();

        res.status(200).send('Device state overridden successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

const postDeviceChangeRequest = async (req, res) => {
    try {
        //Get the changes requested from the request
        const reason = req.body.reason;

        //Get the device object from the request
        const item = req.device;

        if (!reason || reason === "") {
            res.status(400).send('Invalid reason');
            return;
        }

        const historyObject = {
            device: item._id,
            history_type: historyType.REVIEW_REQUESTED,
            data: [
                {
                    name: 'reason',
                    value: reason,
                    data_type: 0
                }
            ],
            actioned_by: req.user.id
        };

        const history = await addHistory(historyObject.device, historyObject.history_type, historyObject.data, historyObject.actioned_by);

        //Send an email to the user informing them of the change request
        const email_address = item.listing_user?.email;
        const full_name = `${item.listing_user?.first_name} ${item.listing_user?.last_name}`;
        const subject = 'ePanda - Device Change Request';
        const message = `Hi ${full_name},<br><br>
        We are writing to you to inform you that a change request has been made for your device listing on ePanda. The reason for this change request is as follows:<br><br>
        "${reason}"<br><br>
        Please review the reason provided and make the necessary changes to your listing, otherwise your listing may be removed from the platform.<br><br>
        Best regards, <p style="color: #2E8B57">Team Panda</p>`

        //Send the email
        email(email_address, subject, message);

        res.status(200).send('Device change request submitted successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

const postDeviceVisibility = async (req, res) => {
    try {
        //Get  the visibility value from the request
        let visible = req.body.visible;

        //Get the device object from the request
        const item = req.device;

        if (!visible) {
            res.status(400).send('Invalid visibility value');
            return;
        }

        //Parse the visibility value to a boolean
        visible = visible === 'true';

        //Update the visibility of the device
        item.visible = visible;

        let history = null;
        if (visible) {
            history = {
                device: item._id,
                history_type: historyType.ITEM_UNHIDDEN,
                data: [],
                actioned_by: req.user.id
            };
        } else {
            history = {
                device: item._id,
                history_type: historyType.ITEM_HIDDEN,
                data: [],
                actioned_by: req.user.id
            };
        }
        await addHistory(history.device, history.history_type, history.data, history.actioned_by);

        await item.save();

        res.status(200).send('Device visibility updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getDevicesPage,
    getFlaggedDevicesPage,
    getRetrievalDevicesPage,
    getDeviceTypePage,
    getDeviceTypeDetailsPage,
    postNewDeviceType,
    postNewBrand,
    postNewModel,
    getUserDeviceDetailsPage,
    updateUserDeviceDetailsPage,
    getModelsFromTypeAndBrand,
    postDevicePromotion,
    postDeviceDemotion,
    postDeviceStateOverride,
    postDeviceChangeRequest,
    postDeviceVisibility,
    updateDeviceType,
    deleteDeviceType,

}