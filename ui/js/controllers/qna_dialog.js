export default class {
    constructor($scope, $mdDialog, $http, toast, qna) {
        'ngInject';

        Object.assign($scope, {
            qna,
            close() {
                $mdDialog[$scope.answered ? 'hide' : 'cancel']();
            },
            submit() {
                $scope.submitting = true;

                $http.put('answeredQuestion', {answerId: $scope.selection, questionId: qna.id}).then(function() {
                    if (qna.correctAnswer) {
                        let adverb = `${qna.correctAnswer.answerId === parseInt($scope.selection) ? '' : 'in'}correctly`;

                        toast.show(`Question answered ${adverb}`);
                    }
                    else {
                        toast.show('Your response has been recorded');
                    }

                    $scope.answered = true;
                }).catch(function() {
                    toast.show('Unable to answer question');
                }).finally(function() {
                    $scope.submitting = false;
                });
            }
        });
    }
}