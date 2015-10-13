class AdminUsersController {
    constructor($scope) {
        Object.assign($scope, {
            tabs: {i: 0},
            editQueue: {ids: []}
        });
    }
}

AdminUsersController.$inject = ['$scope'];

export default AdminUsersController;