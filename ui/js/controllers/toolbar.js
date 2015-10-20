import property from 'lodash/utility/property';

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
                    return property('data.isAdmin')($scope.user) && $scope.view.current !== 'admin';
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