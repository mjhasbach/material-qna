export default class {
    constructor($scope, $http, toast) {
        'ngInject';

        Object.assign($scope, {
            data: {
                username: $scope.user.data.username
            },
            init() {
                delete $scope.saving;
                $scope.data.password = '';
                $scope.originalData = angular.copy($scope.data);
            },
            isSaveDisabled() {
                return angular.equals($scope.data, $scope.originalData);
            },
            save() {
                $scope.saving = true;
                $http.put('user', $scope.data).then(function() {
                    $scope.user.data.username = $scope.data.username;
                    toast.show('Account updated successfully');
                }).catch(function() {
                    $scope.data.username = $scope.originalData.username;
                    toast.show('Unable to update account');
                }).finally($scope.init);
            }
        });

        $scope.init();
    }
}