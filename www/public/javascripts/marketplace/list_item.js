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
        if (this.checked) {
            conditionList.classList.remove("d-block");
            conditionList.classList.add("d-none");
        }
    });
    conditionNo.addEventListener('change', ()=> {
        // hide further condition term if no
        if (this.checked) {
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
                <div class="row g-0" id="selected-model-content">
                    <div class="col-md-3">
                        <img src="${models[0].properties[0].value}" class="img-fluid rounded-start" >
                    </div>
                    <div class="col-md-9">
                        <div class="card-body p-0">
                            <h5 class="card-title">${models[selectedIndex].name}</h5>
                            <p class="card-text m-0"><small>Device Type:</small> ${deviceTypeElement.options[deviceTypeElement.selectedIndex].innerText}</p>
                            <p class="card-text m-0"><small>Brand:</small> ${deviceBrandElement.options[deviceTypeElement.selectedIndex].innerText}</p>
<!--                            <p class="card-text text-truncate m-0"> <small>Specification:</small></p>-->
<!--                            <p class="card-text text-truncate m-0"> ${models[selectedIndex].properties[1].value}</p>-->
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
        // const files = itemImage.files;


        const requestData = {
            device_type: selectedModel.deviceType,
            brand: selectedModel.brand,
            model: selectedModel._id,
            details: [], //TODO: get details
            category: selectedModel.category,
            good_condition: true, //TODO: get condition
            state: 1, // default to review when posted
            data_service: 1, //TODO: get data service
            additional_details: 'Some additional details', //TODO: get Addition Detail
            listing_user: '65eac7a0f2954ef5775b1837', //TODO: get Current User
            photos: [], //TODO: get photos
            visible: false // default to false when posted
        };

        fetch('/list-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
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