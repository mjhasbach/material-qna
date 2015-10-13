class AdminController {
    constructor($scope) {
        $scope.setting = {selected: 'Users'};
    }
}

AdminController.$inject = ['$scope'];

export default AdminController;