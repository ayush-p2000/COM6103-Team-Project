/**
 * Javascript to Handle action in Unknown_device page
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */

document.addEventListener('DOMContentLoaded', function () {

    const deviceTypeSubmit = document.getElementById('deviceType-submit');
    const brandSubmit = document.getElementById('brand-submit');
    const modelSubmit = document.getElementById('model-submit');

    const deviceTypeName = document.getElementById('device-type-name');
    const deviceTypeDescription = document.getElementById('device-type-description');

    const brandName = document.getElementById('brand-name');

    const DeviceTypeForModel = document.getElementById('device-type-for-model');
    const BrandForModel = document.getElementById('device-brand-for-model');
    const modelName = document.getElementById('model-name');


    /**
     * Post Request To Request Update DeviceType When Summit the Form
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    deviceTypeSubmit.addEventListener("click", () =>{

        if (deviceTypeName.value === ""|| deviceTypeDescription.value===""){
            alert("Please Fill in All Fields!")
        }else{
            var formData = new FormData();
            formData.append('name', deviceTypeName.value);
            formData.append('description', deviceTypeDescription.value);

            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            fetch('/admin/devices/postNewDeviceType', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.reload()
                    return response.text();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    })

    /**
     * Post Request To Request Update Brand When Summit the Form
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    brandSubmit.addEventListener("click", () =>{
        if (brandName.value === ""){
            alert("Please Fill in All Fields!")
        }else{
            var formData = new FormData();
            formData.append('name', brandName.value);

            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            fetch('/admin/devices/postNewBrand', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.reload()

                    return response.text();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    })

    /**
     * Post Request To Request Model Data from GSMARENA and Update Model When Summit the Form
     * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
     */
    modelSubmit.addEventListener("click", () =>{
        if (modelName.value === ""){
            alert("Please Fill in All Fields!")
        }else{
            var formData = new FormData();
            formData.append('name', modelName.value);
            formData.append('brand', BrandForModel.value);
            formData.append('device_type', DeviceTypeForModel.value);

            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            fetch('/admin/devices/postNewModel', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.reload()

                    return response.text();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    })

    var checkbox = document.getElementById("needUpdate");
    var rows = document.querySelectorAll("tbody tr");
    document.getElementById('needUpdate').addEventListener('change', function() {
        if (checkbox.checked) {
            rows.forEach(function(row) {
                var statusCell = row.querySelector("td:first-child");
                if (statusCell.textContent.trim() === "Updated") {
                    row.style.display = "none";
                } else {
                    row.style.display = "";
                }
            });
        } else {
            rows.forEach(function(row) {
                row.style.display = "";
            });
        }
    });
})
