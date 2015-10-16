export default class {
    constructor($scope, search) {
        'ngInject';

        search($scope, {model: 'answeredQuestion', orderBy: 'questionId'});
    }
}