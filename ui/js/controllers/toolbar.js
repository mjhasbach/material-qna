class ToolbarController {
    constructor($scope, auth, toast) {
        $scope.buttons = [
            {
                name: 'QnA',
                icon: 'question_answer',
                get show() {
                    return $scope.user.data && $scope.view.current !== 'qna';
                },
                onClick: function() {
                    $scope.view.current = 'qna';
                }
            },
            {
                name: 'Settings',
                icon: 'settings',
                get show() {
                    return $scope.user.data && $scope.user.data.isAdmin && $scope.view.current !== 'admin';
                },
                onClick: function() {
                    $scope.view.current = 'admin';
                }
            },
            {
                name: 'Logout',
                icon: 'exit_to_app',
                get show() {
                    return $scope.user.data;
                },
                onClick: function() {
                    auth.logout().then(function() {
                        $scope.user.data = null;
                        $scope.view.current = 'auth';
                    }).catch(function() {
                        toast.show('Unable to log out');
                    });
                }
            }
        ];
    }
}

ToolbarController.$inject = ['$scope', 'authFactory', 'toastFactory'];

export default ToolbarController;