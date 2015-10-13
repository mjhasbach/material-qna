class QnAController {
    constructor($scope, $mdDialog, $http, toast, qna) {
        Object.assign($scope, {
            qna,
            close() {
                $mdDialog[$scope.answered ? 'hide' : 'cancel']();
            },
            submit() {
                $scope.submitting = true;

                $http.put('answeredQuestion', {answerId: $scope.selection, questionId: qna.id}).then(function() {
                    let adverb = `${qna.correctAnswer.answerId === parseInt($scope.selection) ? '' : 'in'}correctly`;

                    toast.show(`Question answered ${adverb}`);
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

QnAController.$inject = ['$scope', '$mdDialog', '$http', 'toastFactory', 'qna'];

export default QnAController;