class AdminHistoryController {
    constructor($scope, search) {
        search($scope, {model: 'answeredQuestion', orderBy: 'questionId'});
    }
}

AdminHistoryController.$inject = ['$scope', 'searchFactory'];

export default AdminHistoryController;