import pluck from 'lodash/collection/pluck';

class AdminUsersSearchController {
    constructor($scope, search) {
        search($scope, {model: 'user', orderBy: 'id'});

        $scope.edit = function() {
            $scope.editQueue.ids = pluck($scope.selected, 'id');
            $scope.tabs.i = 1;
        };
    }
}

AdminUsersSearchController.$inject = ['$scope', 'searchFactory'];

export default AdminUsersSearchController;