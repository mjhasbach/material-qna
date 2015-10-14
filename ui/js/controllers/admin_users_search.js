class AdminUsersSearchController {
    constructor($scope, search) {
        search($scope, {model: 'user', orderBy: 'id'});
    }
}

AdminUsersSearchController.$inject = ['$scope', 'searchFactory'];

export default AdminUsersSearchController;