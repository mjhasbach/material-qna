export default class {
    constructor($scope) {
        'ngInject';

        Object.assign($scope, {
            settings: [
                {
                    name: 'Users',
                    icon: 'people'
                },
                {
                    name: 'QnA',
                    icon: 'question_answer'
                },
                {
                    name: 'History',
                    icon: 'history'
                }
            ],
            itemClicked(setting) {
                $scope.setting.selected = setting;
            }
        });
    }
}