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

    requestModels()

    /* Handling Preview images for user input */
    itemImage.addEventListener('change', ()=> {
        updateImageReview()
    });

    /* Handling Device type Brand and Model update when changed */
    deviceTypeElement.addEventListener("change", ()=> {requestModels()});
    deviceBrandElement.addEventListener("change", ()=> {requestModels()});
    deviceModelElement.addEventListener("change", ()=> {updateModelPreview()});

    /* Handling show/hide further condition */
    conditionYes.addEventListener('change', ()=> {
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
    conditionNo.addEventListener('change', ()=> {
        // hide further condition term if no
        if (conditionNo.checked) {
            conditionList.classList.remove("d-none");
            conditionList.classList.add("d-block");
        }
    });

    /* Handling submit action */
    submitBtn.addEventListener('click', ()=> {postDataToServer()})


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
     */
    function updateModelPreview(){
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
                console.error(error);
            });
    }

    /**
     * Handling Post device to Server
     */
    function postDataToServer() {
        var selectedModelId = deviceModelElement.value
        var selectedModel = models.find(model => model._id === selectedModelId);

        var dataService = 0;
        dataRadios.forEach(function(radio, index) {
            if (radio.checked) {
                dataService = index;
                return;
            }
        });

        var details = [
            { name: "functionnality", value: functionalityYes.checked? "Good" : "Bad" },
            { name: "button", value: btnYes.checked? "Good" : "Bad" },
            { name: "camera", value: cameraYes.checked? "Good" : "Bad" },
            { name: "battery", value: batteryYes.checked? "Good" : "Bad" },
            { name: "body", value: bodyYes.checked? "Good" : "Bad" },
            { name: "touchscreen", value: touchscreenYes.checked? "Good" : "Bad" },
            { name: "display", value: displayYes.checked? "Good" : "Bad" }
        ];

        var formData = new FormData();
        formData.append('device_type', selectedModel.deviceType);
        formData.append('brand', selectedModel.brand);
        formData.append('model', selectedModel._id);
        formData.append('details', JSON.stringify(details));
        formData.append('category', selectedModel.category);
        formData.append('good_condition', conditionYes.checked);
        formData.append('state', 1); // default to review when posted
        formData.append('data_service', dataService);
        formData.append('additional_details', additionalInfo.value !== "" ? additionalInfo.value : "Not Provided");
        formData.append('visible', false); // default to false when posted

        if (itemImage.files.length === 0) {
            return alert('Please Upload At Least One Photos Of Your Device!');
        }else{
            for (var i = 0; i < itemImage.files.length; i++) {
                formData.append('photos', itemImage.files[i]);
            }
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