class AdminUsersEditController {
    constructor($scope, $http, toast) {
        let init = function() {
            $http.get('user', {params: {id: $scope.editQueue.ids[0]}}).then(function({data}) {
                Object.assign($scope, {
                    data,
                    saving: false
                });
            }).catch(function() {
                toast.show('Unable to get user data');
            });
        };

        Object.assign($scope, {
            cancel() {
                $scope.editQueue.ids.length = 0;
                $scope.tabs.i = 0;
            },
            save() {
                $scope.saving = true;
                $http.put('user', $scope.data).then(function() {
                    toast.show('User saved successfully');
                    $scope.editQueue.ids.shift();
                    $scope.editQueue.ids.length ? $scope.init() : $scope.cancel();
                }).catch(function() {
                    toast.show('Unable to save user');
                    $scope.saving = false;
                });
            }
        });

        init();
    }
}

AdminUsersEditController.$inject = ['$scope', '$http', 'toastFactory'];

export default AdminUsersEditController;