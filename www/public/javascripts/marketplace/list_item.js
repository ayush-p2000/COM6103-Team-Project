// 获取radio按钮元素
const conditionYes = document.getElementById('conditionYes');
const conditionNo = document.getElementById('conditionNo');
// 获取ul元素
const conditionList = document.getElementById('detail-condition');

// 给radio按钮添加事件监听器
conditionYes.addEventListener('change', function() {
    // 如果选择了Yes，则显示ul元素
    if (this.checked) {
        conditionList.classList.remove("d-block");
        conditionList.classList.add("d-none");
    }
});

conditionNo.addEventListener('change', function() {
    // 如果选择了No，则隐藏ul元素
    if (this.checked) {
        conditionList.classList.remove("d-none");
        conditionList.classList.add("d-block");
    }
});

document.getElementById("deviceType").addEventListener("change", function() {
    // 获取选中的设备类型
    var selectedDeviceType = this.value;
    console.log(selectedDeviceType)

    // // 发送 AJAX 请求到后台，传递选中的设备类型
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", "/getBrandAndModel?deviceType=" + selectedDeviceType);
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    //         // 如果请求成功，更新品牌和型号选择框的内容
    //         var responseData = JSON.parse(xhr.responseText);
    //         updateBrandSelect(responseData.brand);
    //         updateModelSelect(responseData.model);
    //     }
    // };
    // xhr.send();
});