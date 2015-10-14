class AuthController {
    constructor($scope, $timeout, auth, toast) {
        Object.assign($scope, {
            keydown(e, authForm) {
                if (e.which === 13) {
                    $scope.authenticate(authForm);
                }
            },
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
                    $scope.authenticating = $scope.registering = $scope.loggingIn = false;
                });

                authForm.$setUntouched();

                $timeout(function() {
                    Object.assign($scope, {
                        authenticating: true,
                        password: null,
                        registering: isRegistering,
                        loggingIn: !isRegistering
                    });
                }, 0);
            }
        });
    }
}

AuthController.$inject = ['$scope', '$timeout', 'authFactory', 'toastFactory'];

export default AuthController;