/**
 * JavaScript file to handling post item
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */

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


    const model = document.getElementById('model')
    const customModel = document.getElementById('custom-model')
    const customBrand = document.getElementById('custom-brand')
    const customDeviceType = document.getElementById('custom-device-type')
    const customSubmit = document.getElementById('custom-submit')


    const saveBtn = document.getElementById('saveBtn')
    const deviceCategory = document.getElementById('deviceCategory')
    const deviceState = document.getElementById('deviceState')
    const deviceVisibleYes = document.getElementById('visibleYes')

    const displayYes = document.getElementById('displayYes')
    const touchscreenYes = document.getElementById('touchscreenYes')
    const bodyYes = document.getElementById('bodyYes')
    const batteryYes = document.getElementById('batteryYes')
    const cameraYes = document.getElementById('cameraYes')
    const btnYes = document.getElementById('btnYes')
    const functionalityYes = document.getElementById('functionalityYes')

    requestModels()

    /**
     * Handling Preview images for user input
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    itemImage.addEventListener('change', ()=> {
        updateImageReview()
    });

    /**
     * Handling Device type Brand and Model update when changed
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    deviceTypeElement.addEventListener("change", ()=> {requestModels()});
    deviceBrandElement.addEventListener("change", ()=> {requestModels()});
    deviceModelElement.addEventListener("change", ()=> {updateModelPreview()});


    customSubmit.addEventListener('click',()=>{
        if (customDeviceType.value === "" || customBrand.value === "" || customModel.value === ""){
            alert("Please Fill in All Fields Before Submitting")
        }else{
            deviceTypeElement.innerHTML = `<option value="-1">${customDeviceType.value}</option>`
            deviceBrandElement.innerHTML = `<option value="-1">${customBrand.value}</option>`
            deviceModelElement.innerHTML = `<option value="-1">${customModel.value}</option>`
        }
        hideModelPreview()
    })


    /**
     * Handling show/hide further condition
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
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

    /**
     * Handling submit action
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    submitBtn.addEventListener('click', ()=> {postDataToServer()})

    function hideModelPreview(){
        document.getElementById('selected-model-content').style.display = "none"
    }

    function showModelPreview(){
        document.getElementById('selected-model-content').style.display = "block"
    }

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
     *  Update Model Preview when change selected model
     *  @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function updateModelPreview(){
        showModelPreview()
        var selectedIndex = deviceModelElement.selectedIndex;
        var template = `
            <div class="card p-3 ">
                <div class="row" id="selected-model-content">
                    <div class="col-3">
                        <img src="${models[selectedIndex].properties[0].value}" class="img-fluid rounded-start" >
                    </div>
                    <div class="col-9">
                        <div class="card-body p-0">
                            <h5 class="card-title">${models[selectedIndex].name}</h5>
                            <p class="card-text m-0"><small>Device Type:</small> ${deviceTypeElement.options[deviceTypeElement.selectedIndex].innerText}</p>
                            <p class="card-text m-0"><small>Brand:</small> ${deviceBrandElement.options[deviceBrandElement.selectedIndex].innerText}</p>
                            <p class="card-text"><small class="text-muted">Release at ${models[selectedIndex].properties[2].value}</small></p>
                        </div>
                    </div>
                </div>
            </div>`
        document.getElementById('selected-model-content').innerHTML = template;
    }

    /**
     * get Models from server when Type or Brand change
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function requestModels() {
        var selectedDeviceType = deviceTypeElement.value
        var selectedDeviceBrand = deviceBrandElement.value;

        const params = new URLSearchParams();
        params.append('brand', selectedDeviceBrand);
        params.append('deviceType', selectedDeviceType);
        const url = '/getModelByBrandAndType?' + params.toString();

        // Axios to get model base on selected properties
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                models = data
                const deviceModelElement = document.getElementById('deviceModel'); // 获取用于预览的容器元素
                // clear model data
                deviceModelElement.innerHTML = '';

                data.forEach(model => {
                    var templateString = `<option value="${model._id}">${model.name}</option>`;
                    deviceModelElement.innerHTML += templateString;
                });
                updateModelPreview()
            })
            .catch(error => {
                hideModelPreview()
                console.error(error);
            });
    }

    /**
     * Post Request to Add Device Item to Server
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    function postDataToServer() {
        var selectedModelId = deviceModelElement.value
        var selectedModel = ""
        var selectedBrand = ""
        var selectedType = ""
        var category= ""


        if (selectedModelId === "-1"){
            selectedModel = customModel.value
            selectedBrand = customBrand.value
            selectedType = customDeviceType.value
            category = 3  //Unknown
        }else{
            const selectedModelObj = models.find(model => model._id === selectedModelId);
            selectedModel = selectedModelObj._id
            selectedBrand = selectedModelObj.brand
            selectedType = selectedModelObj.deviceType
            category = selectedModelObj.category
        }

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
        formData.append('device_type', selectedType);
        formData.append('brand', selectedBrand);
        formData.append('model', selectedModel);
        formData.append('details', JSON.stringify(details));
        formData.append('category', category);
        formData.append('good_condition', conditionYes.checked);
        formData.append('state', 1); // default to review when posted
        formData.append('data_service', 0);
        formData.append('additional_details', additionalInfo.value !== "" ? additionalInfo.value : "Not Provided");
        formData.append('visible', false); // default to false when posted

        if (itemImage.files.length === 0) {
            return alert('Please Upload At Least One Photos Of Your Device!');
        }else{
            for (var i = 0; i < itemImage.files.length; i++) {
                formData.append('photos', itemImage.files[i]);
            }
        }


        for (const [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }

        fetch('/list-item', {
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