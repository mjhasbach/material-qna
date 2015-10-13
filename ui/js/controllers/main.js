class MainController {
    constructor($scope, toast) {
        Object.assign($scope, {
            toast,
            view: {current: $scope.user.data ? 'qna' : 'auth'}
        });

        $scope.$watch('view.current', function(newView, oldView) {
            if (newView !== oldView) {
                toast.hide();
            }
        });
    }
}

MainController.$inject = ['$scope', 'toastFactory'];

export default MainController;