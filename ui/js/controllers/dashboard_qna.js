export default class {
    constructor($scope, toast) {
        'ngInject';

        Object.assign($scope, {
            tabs: {i: 0},
            image: {},
            editQueue: {ids: []}
        });

        $scope.$on('$destroy', toast.hide);
    }
}