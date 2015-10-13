class AdminQnAController {
    constructor($scope) {
        Object.assign($scope, {
            tabs: {i: 0},
            image: {},
            editQueue: {ids: []}
        });
    }
}

AdminQnAController.$inject = ['$scope'];

export default AdminQnAController;