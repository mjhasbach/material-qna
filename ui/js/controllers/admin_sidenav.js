class AdminSidenavController {
    constructor($scope) {
        Object.assign($scope, {
            settings: [
                {
                    name: 'Users',
                    icon: 'people'
                },
                {
                    name: 'QnA',
                    icon: 'question_answer'
                }
            ],
            itemClicked(setting) {
                $scope.setting.selected = setting;
            }
        });
    }
}

AdminSidenavController.$inject = ['$scope'];

export default AdminSidenavController;