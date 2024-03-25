
/**
 * Handling the searching device in marcketplace
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */

document.addEventListener("DOMContentLoaded", function() {
    const items = document.querySelectorAll('.item');

    const searchInput = document.querySelector('#search-input')

    searchInput.addEventListener("input", () => {
        const searchString = searchInput.value;
        search(searchString)
    });

    function search(input) {
        const searchString = input.trim().toLowerCase(); 

        items.forEach(item => {
            const itemName = item.querySelector('.modelName').textContent.trim().toLowerCase()
            if (itemName.includes(searchString)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
})