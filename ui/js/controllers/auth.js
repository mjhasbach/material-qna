export default class {
    constructor($scope, $timeout, auth, toast) {
        'ngInject';

        Object.assign($scope, {
            areButtonsDisabled() {
                return $scope.authenticating || !$scope.username || !$scope.password;
            },
            authenticate(authForm, isRegistering) {
                auth.authenticate(isRegistering, $scope.username, $scope.password).then(function(response) {
                    $scope.user.data = response.data;
                    $scope.view.current = 'qna';
                }).catch(function() {
                    toast.show(`Unable to ${isRegistering ? 'register' : 'log in'}`);
                }).finally(function() {
                    authForm.$setUntouched();
                    $scope.authenticating = $scope.registering = $scope.loggingIn = false;
                    $timeout(function() {
                        $scope.password = null;
                    }, 0);
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