document.addEventListener('DOMContentLoaded', function () {

    const deviceType = document.getElementById('deviceType')
    const deviceBrand = document.getElementById('deviceBrand')
    const deviceModel = document.getElementById('deviceModel')
    const deviceCategory = document.getElementById('deviceCategory');
    const conditionYes = document.getElementById('conditionYes');
    const conditionNo = document.getElementById('conditionNo');
    const conditionList = document.getElementById('detail-condition');
    const saveBtn = document.getElementById('saveBtn')
    const additionalInfo = document.getElementById('additionalInfo')

    const deviceColor = document.getElementById('deviceColor')
    const deviceCapacity = document.getElementById('deviceCapacity')
    const deviceYear = document.getElementById('deviceYear')


    const displayRadios = document.getElementsByName('displayRadio')
    const touchscreenRadios = document.getElementsByName('touchscreenRadio')
    const bodyRadios = document.getElementsByName('bodyRadio')
    const batteryRadios = document.getElementsByName('batteryRadio')
    const cameraRadios = document.getElementsByName('cameraRadio')
    const btnRadios = document.getElementsByName('btnRadio')
    const functionalityRadios = document.getElementsByName('functionalityRadio')

    saveBtn.addEventListener('click', () => {
        postUpdatedDataToServer()
    })

    conditionYes.addEventListener('change', () => {
        // Show further condition term if yes
        if (conditionYes.checked) {
            setConditionValues("5");
        }
    });

    conditionNo.addEventListener('change', () => {
        // Show further condition term if no
        if (conditionNo.checked) {
            setConditionValues("1");
        }
    });

    /**
     * Function to set All the Radio to a Value
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function setConditionValues(value) {
        setSelectedRadioValue("functionalityRadio", value);
        setSelectedRadioValue("btnRadio", value);
        setSelectedRadioValue("cameraRadio", value);
        setSelectedRadioValue("batteryRadio", value);
        setSelectedRadioValue("bodyRadio", value);
        setSelectedRadioValue("touchscreenRadio", value);
        setSelectedRadioValue("displayRadio", value);
    }

    /**
     * Function to set the value of a Radio Element
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function setSelectedRadioValue(radio,value) {
        var radios = document.getElementsByName(radio);

        for (var i = 0; i < radios.length; i++) {
            if (radios[i].value === value) {
                radios[i].checked = true;
                break;
            }
        }
    }

    /**
     * Function to get the value of a Radio Element
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function getSelectedRadioValue(radios) {
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return null;
    }

    /**
     * Function to post the updated data to the mongodb database when the save button in triggered.
     * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function postUpdatedDataToServer() {

        const details = [
            { name: "functionality",value: getSelectedRadioValue(functionalityRadios)},
            { name: "button", value: getSelectedRadioValue(btnRadios)},
            { name: "camera", value: getSelectedRadioValue(cameraRadios)},
            { name: "battery", value: getSelectedRadioValue(batteryRadios)},
            { name: "body", value: getSelectedRadioValue(bodyRadios)},
            { name: "touchscreen", value: getSelectedRadioValue(touchscreenRadios) },
            { name: "display", value: getSelectedRadioValue(displayRadios)},
        ];

        var formData = new FormData();
        formData.append('color', deviceColor.value);
        formData.append('capacity', deviceCapacity.value);
        formData.append('years_used', deviceYear.value);
        formData.append('model', deviceModel.value);
        formData.append('details', JSON.stringify(details));
        formData.append('category', deviceCategory.value);
        formData.append('good_condition', conditionYes.checked);
        formData.append('additional_details', additionalInfo.value !== "" ? additionalInfo.value : "Not Provided");


        var url = window.location.href
        var parts = url.split('/')
        var id = parts[parts.length - 1]

        console.log(id)

        fetch(`/admin/devices/${id}`, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.location.href = '/admin/devices';
                return response.text();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


})

async function onVisibilityChange(itemID, visible) {
    const spinner = $('#visibilitySpinner');

    const visibleYesCheckbox = $('#visibleYes');
    const visibleNoCheckbox = $('#visibleNo');
    const visibleYesLabel = $('label[for="visibleYes"]');
    const visibleNoLabel = $('label[for="visibleNo"]');

    //Disable the checkboxes and labels to prevent multiple requests
    visibleYesCheckbox.addClass('disabled');
    visibleNoCheckbox.addClass('disabled');
    visibleYesLabel.addClass('disabled');
    visibleNoLabel.addClass('disabled');

    spinner.removeClass('d-none');
    try {
        const response = await axios.post(`/admin/devices/${itemID}/visibility`, {
            visible: visible
        });

        window.location.reload();
    } catch (error) {
        console.error(error);
        spinner.addClass('d-none');

        //Re-enable the checkboxes and labels
        visibleYesCheckbox.removeClass('disabled');
        visibleNoCheckbox.removeClass('disabled');
        visibleYesLabel.removeClass('disabled');
        visibleNoLabel.removeClass('disabled');
    }
}

/**
 * Handles the promotion of a device when the promote button is pressed
 * @param {String} itemID The ID of the item to promote
 * @author Benjamin Lister
 */
async function onPromotePressed(itemID) {
    const spinner = $('#promotionSpinner');
    spinner.removeClass('d-none');
    try {
        const response = await axios.post(`/admin/devices/${itemID}/promote`);

        window.location.reload();
    } catch (error) {
        console.error(error);
        spinner.addClass('d-none');
    }
}

/**
 * Handles the demotion of a device when the demote button is pressed
 * @param {String} itemID The ID of the device to demote
 * @author Benjamin Lister
 */
async function onDemotePressed(itemID) {
    const spinner = $('#promotionSpinner');
    spinner.removeClass('d-none');
    try {

        const response = await axios.post(`/admin/devices/${itemID}/demote`);

        window.location.reload();
    } catch (error) {
        console.error(error);
        spinner.addClass('d-none');
    }
}

/**
 * Displays the error state confirmation modal when an override state button is pressed
 * @param itemID The ID of the device to change the state of
 * @param state The state to change the device to
 * @author Benjamin Lister
 */
async function onOverrideStatePressed(itemID, state) {

    const overrideStateItemID = $('#overrideStateItemID');
    const overrideState = $('#overrideStateType');

    overrideStateItemID.val(itemID);
    overrideState.val(state);

    const errorModal = $('#overrideStateModal');
    errorModal.modal('show');
}

/**
 * Handles sending the override state to the server when the confirm button is pressed
 * @author Benjamin Lister
 */
async function onOverrideStateConfirm() {
    const errorModal = $('#overrideStateModal');
    errorModal.modal('hide');

    const promotionSpinner = $('#promotionSpinner');
    promotionSpinner.removeClass('d-none');

    const overrideStateItemID = $('#overrideStateItemID');
    const overrideState = $('#overrideStateType');

    const itemID = overrideStateItemID.val();
    const state = overrideState.val();

    let stateInt = parseInt(state, 10);

    try {
        const response = await axios.post(`/admin/devices/${itemID}/state`,
            {
                state: stateInt
            });

        window.location.reload();
    } catch (error) {
        console.error(error);
        promotionSpinner.addClass('d-none');
    }

}

const onRequestChangesPressed = async (itemID) => {
    const reasonModal = $('#requestChangesModal');
    reasonModal.modal('show');

    const requestChangesItemID = $('#requestChangesItemID');
    requestChangesItemID.val(itemID);

}

const onRequestChangesConfirm = async () => {
    const requestChangesItemID = $('#requestChangesItemID');
    const requestChangesReason = $('#requestChangesReason');

    const itemID = requestChangesItemID.val();
    const reason = requestChangesReason.val();

    const spinner = $('#requestChangesSpinner');
    spinner.removeClass('d-none');

    try {
        const response = await axios.post(`/admin/devices/${itemID}/changes`,
            {
                reason: reason
            });

        window.location.reload();
    } catch (error) {
        console.error(error);
        spinner.addClass('d-none');
    }
}

