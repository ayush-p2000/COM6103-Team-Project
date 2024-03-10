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

    requestModels()

    /**
     * Handling Preview images for user input
     */
    itemImage.addEventListener('change', function (event) {
        const files = event.target.files; // get selected files

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
    });

    /**
     * Handling Device type Brand and Model update when changed
     */
    deviceTypeElement.addEventListener("change", function () {requestModels()});
    deviceBrandElement.addEventListener("change", function () {requestModels()});
    deviceModelElement.addEventListener("change", function () {updateModelPreview()});

    /**
     * Handling show/hide further condition
     */
    conditionYes.addEventListener('change', function () {
        // Show further condition term if yes
        if (this.checked) {
            conditionList.classList.remove("d-block");
            conditionList.classList.add("d-none");
        }
    });
    conditionNo.addEventListener('change', function () {
        // hide further condition term if no
        if (this.checked) {
            conditionList.classList.remove("d-none");
            conditionList.classList.add("d-block");
        }
    });

    /**
     *  Update Model Preview when change selected model
     */
    function updateModelPreview(){
        var selectedIndex = deviceModelElement.selectedIndex;
        var template = `
            <div class="card">
                <div class="row g-0" id="selected-model-content">
                    <div class="col-md-4">
                        <img src="${models[0].properties[0].value}" class="img-fluid rounded-start" >
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${models[selectedIndex].name}</h5>
                            <p class="card-text text-truncate">${models[selectedIndex].properties[1].value}</p>
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

});