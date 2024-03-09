/*
    *** This is an example of how pagination should be used ***

    const { getPaginatedResults } = require("../../model/utils/utils")
    const { Device } = require("../../model/schema/device")

    async function getMarketplace(req, res, next) {
        const {items, pagination} = await getPaginatedResults(Device, req.params.page, {},{}, 3);

        res.render('marketplace/marketplace', {items, auth: true, role: "user", pagination})
    }

   * Then in the view file pagination.ejs component should be included *
 */
exports.getPaginatedResults = async (model, page, filters={}, sorting={},pageLimit = 10) => {
    // Checks if the page param is a number and is greater than 0.
    const re = new RegExp("^[1-9]\\d*$");
    let current = 1;
    let lastPage = false;

    // Check if page param exists and fits into regex.
    if (page && re.test(page)) {
        current = parseInt(page)
    }

    // Start and end variable determine what buttons will be displayed in the pagination bar
    // i.e 1 2 3 or 7 8 9
    let start = current > 1 ? current - 1 : current;
    let end = current > 1 ? current + 1 : current + 2;

    const data = await model.find(filters).sort(sorting).skip(pageLimit * (current - 1)).limit(pageLimit + 1);

    // If data is empty set the flag
    const emptyPage = !data.length;

    // If page is empty set the pagination bar to have 1 - 3 buttons
    if(emptyPage){
        start = 1
        end = 3
    } else if (data.length < pageLimit + 1) {
        // If this is the last page, end is equals to current so the button to the next page is not displayed.
        lastPage = true
        end = current
    }

    return {
        items: data.splice(0, pageLimit),
        pagination: {
            currentPage: current,
            start,
            end,
            lastPage,
            emptyPage
        }
    }
}