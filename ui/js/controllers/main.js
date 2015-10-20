export default class {
    constructor($scope, toast) {
        'ngInject';

        Object.assign($scope, {
            toast,
            view: {current: $scope.user.data ? 'qna' : 'auth'},
            table: {rowsPerPage: 5}
        });

        $scope.$watch('view.current', function(newView, oldView) {
            if (newView !== oldView) {
                toast.hide();
            }
        });
    }
}