import debounce from 'lodash/function/debounce';
import pluck from 'lodash/collection/pluck';

class AdminHistoryController {
    constructor($scope, $http, toast) {
        Object.assign($scope, {
            selected: [],
            query: {
                order: 'questionId',
                page: 1,
                limit: 5
            },
            history: {
                count: 0,
                rows: []
            },
            search: debounce(function() {
                let promise = $http.get('answeredQuestion/search', {params: $scope.query}).then(function({data}) {
                    $scope.history = data;
                }).catch(function() {
                    toast.show('Unable to search');
                });

                $scope.$apply(function() {
                    $scope.deferred = promise;
                });

                return promise;
            }, 500),
            remove() {
                $scope.deferred = $http.delete('answeredQuestion', {
                    params: {ids: pluck($scope.selected, 'questionId')}
                }).then(function() {
                    $scope.search();
                }).catch(function() {
                    toast.show('Unable to delete history');
                });
            }
        });

        $scope.search();
    }
}

AdminHistoryController.$inject = ['$scope', '$http', 'toastFactory'];

export default AdminHistoryController;