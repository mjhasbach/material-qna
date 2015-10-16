import pluck from 'lodash/collection/pluck';

export default class {
    constructor($scope, search) {
        'ngInject';

        search($scope, {model: 'question', orderBy: 'id'});

        $scope.edit = function() {
            $scope.editQueue.ids = pluck($scope.selected, 'id');
            $scope.tabs.i = 0;
        };
    }
}