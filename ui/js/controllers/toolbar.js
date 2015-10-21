export default class {
    constructor($scope, auth, toast) {
        'ngInject';

        $scope.buttons = [
            {
                name: 'View Code',
                icon: 'code',
                show: true,
                href: 'https://github.com/mjhasbach/material-qna'
            },
            {
                name: 'Question Grid',
                icon: 'grid_on',
                get show() {
                    return $scope.user.data && $scope.view.current !== 'qna';
                },
                onClick: function() {
                    $scope.view.current = 'qna';
                }
            },
            {
                name: 'Dashboard',
                icon: 'view_list',
                get show() {
                    return $scope.user.data && $scope.view.current !== 'dashboard';
                },
                onClick: function() {
                    $scope.view.current = 'dashboard';
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