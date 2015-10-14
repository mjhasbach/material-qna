import pluck from 'lodash/collection/pluck';

class AdminQnASearchController {
    constructor($scope, search) {
        search($scope, {model: 'question', orderBy: 'id'});

        $scope.edit = function() {
            $scope.editQueue.ids = pluck($scope.selected, 'id');
            $scope.tabs.i = 0;
        };
    }
}

AdminQnASearchController.$inject = ['$scope', 'searchFactory'];

export default AdminQnASearchController;