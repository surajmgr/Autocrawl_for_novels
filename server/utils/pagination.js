const pagination = (page, limit, responseData) => {
    const startIndex = (page - 1) * limit
    const lastIndex = (page) * limit

    const results = {}
    results.total = responseData.length;
    results.pageCount = Math.ceil(responseData.length / limit);

    if (lastIndex < responseData.length) {
        results.next = {
            page: page + 1,
        }
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        }
    }
    results.result = responseData.slice(startIndex, lastIndex);
    console.log(results);
    return results;
}

module.exports = pagination;