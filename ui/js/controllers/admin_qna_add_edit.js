import any from 'lodash/collection/any';
import uuid from 'node-uuid';

class AdminQnAAddEditController {
    constructor($scope, $timeout, $http, toast) {
        let init = function(addForm) {
            if (addForm) {
                //todo: causes TypeError: Cannot read property 'insertBefore' of null after removing jQuery, but appears harmless
                addForm.$setUntouched();
            }

            $timeout(function() {
                if ($scope.editQueue.ids.length) {
                    $http.get('qna', {params: {id: $scope.editQueue.ids[0]}}).then(function({data}) {
                        Object.assign(data, {correctAnswer: data.correctAnswer || {}});
                        Object.assign($scope, {
                            data,
                            saving: false,
                            hasCorrectAnswer: !!data.correctAnswer.id
                        });
                    }).catch(function() {
                        toast.show('Unable to get QnA data');
                    });
                }
                else {
                    Object.assign($scope, {
                        hasCorrectAnswer: false,
                        saving: false,
                        data: {
                            disabled: false,
                            image: null,
                            question: '',
                            correctAnswer: {},
                            answers: []
                        }
                    });

                    $scope.addAnswer();
                }

                $scope.image.url = null;
            }, 0);
        };

        Object.assign($scope, {
            addEditImage() {
                Object.assign($scope.image, {
                    question: $scope.data.question,
                    answers: $scope.data.answers,
                    url: $scope.image.url || $scope.data.image
                });

                $scope.tabs.i = 3;
            },
            addAnswer() {
                $scope.data.answers.push({
                    id: uuid.v1(),
                    answer: ''
                });
            },
            deleteAnswer(i) {
                if ($scope.data.answers[i].id === $scope.data.correctAnswer.answerId) {
                    $scope.data.correctAnswer.answerId = null;
                }

                $scope.data.answers.splice(i, 1);
            },
            selectAnswer(id) {
                //todo temporary workaround, see https://github.com/angular/material/issues/2561
                if (!$scope.saving) {
                    $scope.data.correctAnswer.answerId = id;
                }
            },
            isSubmitDisabled() {
                return $scope.saving
                    || !$scope.data
                    || !$scope.data.question
                    || any($scope.data.answers, {answer: ''})
                    || ($scope.hasCorrectAnswer && !$scope.data.correctAnswer.answerId);
            },
            cancel(addForm) {
                $scope.editQueue.ids.length = 0;
                toast.show('You are no longer editing QnA');
                init(addForm);
            },
            save(addForm) {
                $scope.saving = true;
                $http.put('qna', Object.assign($scope.data, {
                    image: $scope.image.url || $scope.data.image,
                    correctAnswer: $scope.hasCorrectAnswer ? $scope.data.correctAnswer : null
                })).then(function() {
                    $scope.editQueue.ids.shift();
                    toast.show('QnA saved successfully');
                    init(addForm);
                }).catch(function() {
                    toast.show('Unable to add QnA');
                }).finally(function() {
                    $scope.saving = false;
                });
            }
        });

        init();
    }
}

AdminQnAAddEditController.$inject = ['$scope', '$timeout', '$http', 'toastFactory'];

export default AdminQnAAddEditController;