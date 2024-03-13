document.addEventListener("DOMContentLoaded", function() {
    var models = [] // current models collection

    // Get dom
    const deviceTypeElement = document.getElementById('deviceType');
    const deviceBrandElement = document.getElementById('deviceBrand');
    const deviceModelElement = document.getElementById('deviceModel');
    const conditionYes = document.getElementById('conditionYes');
    const conditionNo = document.getElementById('conditionNo');
    const conditionList = document.getElementById('detail-condition');
    const itemImage = document.getElementById('itemImage')
    const imagePreview = document.getElementById('imagePreview')
    const submitBtn = document.getElementById('submitBtn')
    const additionalInfo = document.getElementById('additionalInfo')
    const dataRadios = document.querySelectorAll('input[name="dataRadio"]');



    const displayYes = document.getElementById('displayYes')
    const touchscreenYes = document.getElementById('touchscreenYes')
    const bodyYes = document.getElementById('bodyYes')
    const batteryYes = document.getElementById('batteryYes')
    const cameraYes = document.getElementById('cameraYes')
    const btnYes = document.getElementById('btnYes')
    const functionalityYes = document.getElementById('functionalityYes')



    /* Handling Preview images for user input */
    itemImage.addEventListener('change', ()=> {
        updateImageReview()
    });



    /* Handling show/hide further condition */
    conditionYes.addEventListener('change', ()=> {
        // Show further condition term if yes
        if (conditionYes.checked) {
            functionalityYes.checked = true;
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
    conditionNo.addEventListener('change', ()=> {
        // hide further condition term if no
        if (conditionNo.checked) {
            conditionList.classList.remove("d-none");
            conditionList.classList.add("d-block");
        }
    });

    /* Handling submit action */
    submitBtn.addEventListener('click', ()=> {postUpdateDataToServer()})


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
     * Handling Post device to Server
     */
    function postUpdateDataToServer() {

        var dataService = 0;
        dataRadios.forEach(function(radio, index) {
            if (radio.checked) {
                dataService = index;
                return;
            }
        });

        var details = [
            { name: "functionality", value: functionalityYes.checked? "Good" : "Bad" },
            { name: "button", value: btnYes.checked? "Good" : "Bad" },
            { name: "camera", value: cameraYes.checked? "Good" : "Bad" },
            { name: "battery", value: batteryYes.checked? "Good" : "Bad" },
            { name: "body", value: bodyYes.checked? "Good" : "Bad" },
            { name: "touchscreen", value: touchscreenYes.checked? "Good" : "Bad" },
            { name: "display", value: displayYes.checked? "Good" : "Bad" }
        ];

        var formData = new FormData();
        formData.append('details', JSON.stringify(details));
        formData.append('good_condition', conditionYes.checked);
        formData.append('data_service', dataService);
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
                window.location.href = '/dashboard';
                return response.text();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});