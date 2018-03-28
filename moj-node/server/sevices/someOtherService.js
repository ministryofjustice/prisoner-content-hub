module.exports = function createSomeOtherService() {

    function getSomeData() {
        return {
            other: 'All the things'
        }
    }

    return {
        getSomeData
    }
};
