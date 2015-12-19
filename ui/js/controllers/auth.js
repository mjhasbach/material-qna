export default class {
    constructor($scope, auth, toast) {
        'ngInject';

        Object.assign($scope, {
            areButtonsDisabled() {
                return $scope.authenticating || !$scope.username || !$scope.password;
            },
            authenticate(isRegistering) {
                auth.authenticate(isRegistering, $scope.username, $scope.password).then(function(response) {
                    $scope.user.data = response.data;
                    $scope.view.current = 'qna';
                }).catch(function() {
                    toast.show(`Unable to ${isRegistering ? 'register' : 'log in'}`);
                }).finally(function() {
                    $scope.authForm.$setUntouched();
                    $scope.authForm.$setPristine();
                    $scope.authenticating = $scope.registering = $scope.loggingIn = false;
                    $scope.password = null;
                });

                Object.assign($scope, {
                    authenticating: true,
                    registering: isRegistering,
                    loggingIn: !isRegistering
                });
            }
        });
    }
}