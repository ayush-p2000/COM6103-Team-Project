
/**
 * Handling the filter for My-item
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */


// Get all the checkboxes
const checkboxes = document.querySelectorAll('.btn-check');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

// Add event listener to the clear filters button
clearFiltersBtn.addEventListener('click', clearFilters);
// Add event listener to each checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterItems);
});

function filterItems() {

    // Get the checked checkboxes
    const checkedClassification = document.querySelectorAll('.category-filter:checked');
    const checkedDeviceType = document.querySelectorAll('.deviceType-filter:checked');

    // Get all items
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemDeviceType = item.querySelector('.deviceType').textContent.replace('Device Type: ', '').trim()
        const itemCategory = item.querySelector('.category').textContent.replace('Classification: ', '').trim()


        var matchClassification = checkedClassification.length === 0 || Array.from(checkedClassification).some(checkbox => itemCategory === checkbox.id)
        var matchDeviceType = checkedDeviceType.length === 0 || Array.from(checkedDeviceType).some(checkbox => itemDeviceType === checkbox.id)

        if (matchClassification){
            if (matchDeviceType){
                item.style.display = 'block';
            }else{
                item.style.display = 'none';
            }
        }else{
            item.style.display = 'none';
        }
    });

}

function clearFilters() {
    // Uncheck all category checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Show all items
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.style.display = 'block';
    });
}