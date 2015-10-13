import debounce from 'lodash/function/debounce';
import pluck from 'lodash/collection/pluck';

class AdminUsersSearchController {
    constructor($scope, $http, toast) {
        Object.assign($scope, {
            selected: [],
            query: {
                order: 'id',
                page: 1,
                limit: 5
            },
            users: {
                count: 0,
                rows: []
            },
            search: debounce(function() {
                let promise = $http.get('user/search', {params: $scope.query}).then(function({data}) {
                    $scope.users = data;
                }).catch(function() {
                    toast.show('Unable to search');
                });

                $scope.$apply(function() {
                    $scope.deferred = promise;
                });

                return promise;
            }, 500),
            edit() {
                $scope.editQueue.ids = pluck($scope.selected, 'id');
                $scope.tabs.i = 1;
            },
            remove() {
                $scope.deferred = $http.delete('users', {params: {ids: pluck($scope.selected, 'id')}})
                    .then(function() {
                        $scope.search();
                    }).catch(function() {
                        toast.show(`Issue deleting user${$scope.selected.length > 1 ? 's' : ''}`);
                    });
            }
        });

        $scope.search();
    }
}

AdminUsersSearchController.$inject = ['$scope', '$http', 'toastFactory'];

export default AdminUsersSearchController;