export default class {
    constructor($scope, search, toast) {
        'ngInject';

        search($scope, {model: 'answeredQuestion', orderBy: 'questionId'});

        $scope.$on('$destroy', toast.hide);
    }
}