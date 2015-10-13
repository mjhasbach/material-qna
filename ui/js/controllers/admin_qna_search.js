import debounce from 'lodash/function/debounce';
import pluck from 'lodash/collection/pluck';

class AdminQnASearchController {
    constructor($scope, $http, toast) {
        Object.assign($scope, {
            selected: [],
            query: {
                order: 'id',
                page: 1,
                limit: 5
            },
            questions: {
                count: 0,
                rows: []
            },
            search: debounce(function() {
                let promise = $http.get('question/search', {params: $scope.query}).then(function({data}) {
                    $scope.questions = data;
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
                $scope.tabs.i = 0;
            },
            remove() {
                $scope.deferred = $http.delete('qna', {params: {ids: pluck($scope.selected, 'id')}})
                    .then(function() {
                        $scope.search();
                    }).catch(function() {
                        toast.show('Unable to delete QnA');
                    });
            }
        });

        $scope.search();
    }
}

AdminQnASearchController.$inject = ['$scope', '$http', 'toastFactory'];

export default AdminQnASearchController;