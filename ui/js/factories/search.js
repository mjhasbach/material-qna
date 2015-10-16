import debounce from 'lodash/function/debounce';
import pluck from 'lodash/collection/pluck';

export default function($http, $mdDialog, toast) {
    'ngInject';

    return function($scope, settings) {
        Object.assign($scope, {
            selected: [],
            query: {
                order: settings.orderBy,
                page: 1,
                limit: 5
            },
            data: {
                count: 0,
                rows: []
            },
            search: debounce(function() {
                let promise = $http.get(`${settings.model}/search`, {
                    params: $scope.query
                }).then(function({data}) {
                    $scope.data = data;
                }).catch(function() {
                    toast.show('Unable to search');
                });

                $scope.$apply(function() {
                    $scope.deferred = promise;
                });

                return promise;
            }, 500),
            remove(e) {
                let title = 'Confirm Deletion',
                    noun = `item${$scope.selected.length > 1 ? 's' : ''}`,
                    confirm = $mdDialog.confirm()
                        .title(title)
                        .ariaLabel(title)
                        .content(`Are you sure you want to delete the selected ${noun}?`)
                        .targetEvent(e)
                        .ok('Yes')
                        .cancel('No');

                $mdDialog.show(confirm).then(function() {
                    $scope.deferred = $http.delete(settings.model, {
                        params: {'ids[]': pluck($scope.selected, settings.orderBy)}
                    }).then(function() {
                        $scope.search();
                    }).catch(function() {
                        toast.show(`Unable to delete the selected ${noun}`);
                    });
                });
            }
        });

        $scope.search();
    }
}