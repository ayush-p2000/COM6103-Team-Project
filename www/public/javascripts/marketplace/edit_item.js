/**
 * JavaScript file to handling edit item
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */


document.addEventListener("DOMContentLoaded", function() {

    // Get dom
    const conditionYes = document.getElementById('conditionYes');
    const conditionNo = document.getElementById('conditionNo');
    const conditionList = document.getElementById('detail-condition');
    const itemImage = document.getElementById('itemImage')
    const imagePreview = document.getElementById('imagePreview')
    const submitBtn = document.getElementById('submitBtn')
    const additionalInfo = document.getElementById('additionalInfo')
    const dataRadios = document.querySelectorAll('input[name="dataRadio"]');


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



    /**
     * Handling Preview images for user input
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    itemImage.addEventListener('change', ()=> {
        updateImageReview()
    });


    /**
     * Handling show/hide further condition
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    conditionYes.addEventListener('change', ()=> {
        // Show further condition term if yes
        if (conditionYes.checked) {
            setSelectedRadioValue("functionalityRadio","5")
            setSelectedRadioValue("btnRadio","5")
            setSelectedRadioValue("cameraRadio","5")
            setSelectedRadioValue("batteryRadio","5")
            setSelectedRadioValue("bodyRadio","5")
            setSelectedRadioValue("touchscreenRadio","5")
            setSelectedRadioValue("displayRadio","5")

            conditionList.classList.remove("d-block");
            conditionList.classList.add("d-none")
        }
    });
    conditionNo.addEventListener('change', ()=> {
        // hide further condition term if no
        if (conditionNo.checked) {
            conditionList.classList.remove("d-none");
            conditionList.classList.add("d-block");
        }
    });

    function setSelectedRadioValue(radio,value) {
        var radios = document.getElementsByName(radio);

        for (var i = 0; i < radios.length; i++) {
            if (radios[i].value === value) {
                radios[i].checked = true;
                break;
            }
        }
    }

    function getSelectedRadioValue(radios) {
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return null;
    }

    /**
     * Handling submit action
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    submitBtn.addEventListener('click', ()=> {postUpdateDataToServer()})


    /**
     * Update Image Preview when User Upload files
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function updateImageReview(event){
        const files = itemImage.files; // get selected files

        // clear review
        imagePreview.innerHTML = '';

        // append image file to review container
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            // call back to append img
            reader.onload = function () {
                var templateString = `<img src="${reader.result}" class="img-thumbnail col-2">`
                imagePreview.innerHTML += templateString;
            }
            reader.readAsDataURL(file); // read file as url
        }
    }



    /**
     * Post Request to Update device Data
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function postUpdateDataToServer() {
        var details = [
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
        formData.append('details', JSON.stringify(details));
        formData.append('good_condition', conditionYes.checked);
        formData.append('data_service', 0);
        formData.append('additional_details', additionalInfo.value !== "" ? additionalInfo.value : "Not Provided");


        for (var i = 0; i < itemImage.files.length; i++) {
            formData.append('photos', itemImage.files[i]);
        }

        var url = window.location.href;
        var parts = url.split("/");
        var id = parts[parts.length - 1];

        fetch(`/list-item/${id}`, {
            method: 'POST',
            body: formData,

        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.location.href = `/item/${id}`;
                return response.text();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});