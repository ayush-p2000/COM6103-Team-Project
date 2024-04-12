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

    //const deviceState = document.getElementById('deviceState')
    //const deviceVisible = document.getElementById('visibleYes')

    const displayYes = document.getElementById('displayYes')
    const touchscreenYes = document.getElementById('touchscreenYes')
    const bodyYes = document.getElementById('bodyYes')
    const batteryYes = document.getElementById('batteryYes')
    const cameraYes = document.getElementById('cameraYes')
    const btnYes = document.getElementById('btnYes')
    const functionalityYes = document.getElementById('functionalityYes')


    conditionYes.addEventListener('change', () => {
        // Show further condition term if yes
        if (conditionYes.checked) {
            displayYes.checked = true;
            touchscreenYes.checked = true;
            bodyYes.checked = true;
            batteryYes.checked = true;
            displayYes.checked = true;
            cameraYes.checked = true;
            btnYes.checked = true;
            conditionList.classList.remove("d-block");
            conditionList.classList.add("d-none")
        }
    });
    conditionNo.addEventListener('change', () => {
        // hide further condition term if no
        if (conditionNo.checked) {
            conditionList.classList.remove("d-none");
            conditionList.classList.add("d-block");
        }
    });


    saveBtn.addEventListener('click', () => {
        postUpdatedDataToServer()
    })

    /**
     * Function to post the updated data to the mongodb database when the save button in triggered.
     * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
     */

    function postUpdatedDataToServer() {

        const details = [
            {name: "functionality", value: functionalityYes.checked ? "Good" : "Bad"},
            {name: "button", value: btnYes.checked ? "Good" : "Bad"},
            {name: "camera", value: cameraYes.checked ? "Good" : "Bad"},
            {name: "battery", value: batteryYes.checked ? "Good" : "Bad"},
            {name: "body", value: bodyYes.checked ? "Good" : "Bad"},
            {name: "touchscreen", value: touchscreenYes.checked ? "Good" : "Bad"},
            {name: "display", value: displayYes.checked ? "Good" : "Bad"}
        ];

        var formData = new FormData();
        formData.append('model', deviceModel.value);
        formData.append('details', JSON.stringify(details));
        formData.append('category', deviceCategory.value);
        formData.append('good_condition', conditionYes.checked);
        //formData.append('state', deviceState.value); // default to review when posted
        formData.append('additional_details', additionalInfo.value !== "" ? additionalInfo.value : "Not Provided");
        //formData.append('visible', deviceVisible.checked);


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

