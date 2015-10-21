export default class {
    constructor($scope) {
        'ngInject';

        Object.assign($scope, {
            settings: [
                {
                    name: 'Account',
                    icon: 'account_box',
                    show: true
                },
                {
                    name: 'Users',
                    icon: 'people',
                    get show() {
                        return $scope.user.data.isAdmin;
                    }
                },
                {
                    name: 'QnA',
                    icon: 'question_answer',
                    get show() {
                        return $scope.user.data.isAdmin;
                    }
                },
                {
                    name: 'History',
                    icon: 'history',
                    show: true
                }
            ],
            itemClicked(setting) {
                $scope.setting.selected = setting;
            }
        });
    }
}