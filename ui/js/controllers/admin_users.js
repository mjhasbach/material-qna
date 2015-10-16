export default class {
    constructor($scope) {
        'ngInject';

        Object.assign($scope, {
            tabs: {i: 0},
            editQueue: {ids: []}
        });
    }
}