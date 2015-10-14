import debounce from 'lodash/function/debounce';
import pluck from 'lodash/collection/pluck';

function SearchFactory($http, toast) {
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
                let promise = $http.get(`${settings.model}/search`, {params: $scope.query}).then(function({data}) {
                    $scope.data = data;
                }).catch(function() {
                    toast.show('Unable to search');
                });

                $scope.$apply(function() {
                    $scope.deferred = promise;
                });

                return promise;
            }, 500),
            remove() {
                $scope.deferred = $http.delete(settings.model, {
                    params: {ids: pluck($scope.selected, settings.orderBy)}
                }).then(function() {
                    $scope.search();
                }).catch(function() {
                    toast.show(`Unable to delete ${settings.model}`);
                });
            }
        });

        $scope.search();
    }
}

SearchFactory.$inject = ['$http', 'toastFactory'];

export default SearchFactory;