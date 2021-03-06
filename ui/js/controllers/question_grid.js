import map from 'lodash/collection/map';
import remove from 'lodash/array/remove';
import without from 'lodash/array/without';
import reject from 'lodash/collection/reject';
import contains from 'lodash/collection/contains';
import qnaDialogTemplate from '../../templates/qna_dialog';

export default class {
    constructor($scope, $http, $window, $mdDialog, randomImage, prefetchImage, toast) {
        'ngInject';

        let $content = angular.element(document.querySelector('.questionGrid')),
            addImage = function(url) {
                this.image = url;
                $scope.gettingImages = false;
                $scope.questions.push(this);
                getImagesWhileGridHasVisibleEmptySpace();
            },
            handlePlaceholderImgErr = function() {
                $scope.gettingImages = false;
                $scope.placeholderFail = true;
            },
            gridHasVisibleEmptySpace = function() {
                let noVisibleEmptySpace = [],
                    scrollOffset = $content[0].offsetHeight + $content[0].scrollTop;

                angular.forEach(document.querySelectorAll('.column'), function(col) {
                    let lastTile = col.children[col.children.length - 1],
                        tileOffset = lastTile.offsetTop + lastTile.offsetHeight;

                    noVisibleEmptySpace.push(tileOffset > scrollOffset);
                });

                return !(contains(noVisibleEmptySpace, true) &&
                without(noVisibleEmptySpace, false).length === noVisibleEmptySpace.length);
            },
            getImagesWhileGridHasVisibleEmptySpace = function() {
                let {view, gettingImages, imageFail, placeholderFail, corsPort, questions} = $scope;

                if (view.current === 'qna' && !gettingImages && !imageFail && !placeholderFail && gridHasVisibleEmptySpace()) {
                    $scope.gettingImages = true;
                    $scope.noQuestions = false;

                    $http.get('question/grid/tile', {params: {'exclude[]': map(questions, 'id')}})
                        .then(function({data}) {
                            if (data) {
                                return prefetchImage(data.image || randomImage(), corsPort)
                                    .then(addImage.bind(data))
                                    .catch(function() {
                                        if (data.image) {
                                            return prefetchImage(randomImage(), corsPort)
                                                .then(addImage.bind(data))
                                                .catch(handlePlaceholderImgErr);
                                        }

                                        handlePlaceholderImgErr();
                                    });
                            }

                            if (!questions.length) {
                                $scope.noQuestions = true;
                            }

                            $scope.gettingImages = false;

                        }).catch(function() {
                            $scope.imageFail = true;
                            $scope.gettingImages = false;
                        });
                }
            },
            removeDeleted = function() {
                if ($scope.questions.length) {
                    $http.get('question/grid/invalid', {
                        params: {'ids[]': map($scope.questions, 'id')}
                    }).then(function({data}) {
                        data.forEach(function(deletedQuestionId) {
                            remove($scope.questions, function(question) {
                                return deletedQuestionId === question.id;
                            });
                        });
                    }).catch(function() {
                        toast.show('Unable to identify deleted questions');
                    });
                }
            };

        Object.assign($scope, {
            questions: [],
            imageClicked(e, id) {
                $http.get('qna', {params: {id, enabled: true}}).then(function({data}) {
                    if (data) {
                        $mdDialog.show({
                            clickOutsideToClose: true,
                            controller: 'qnaDialogController',
                            template: qnaDialogTemplate(),
                            parent: angular.element(document.body),
                            targetEvent: e,
                            locals: {qna: data}
                        }).then(function() {
                            $scope.questions = reject($scope.questions, 'id', id);
                            getImagesWhileGridHasVisibleEmptySpace();
                        }).finally(function() {
                            toast.hide();
                        });
                    }
                    else {
                        toast.show('The selected question is no longer available');
                        $scope.questions = reject($scope.questions, 'id', id);
                        removeDeleted();
                    }
                }).catch(function() {
                    toast.show('Unable to get question data');
                });
            }
        });

        $content.bind('scroll', getImagesWhileGridHasVisibleEmptySpace);
        angular.element($window).bind('resize', getImagesWhileGridHasVisibleEmptySpace);

        $scope.$watch('view.current', function(view) {
            if (view === 'qna') {
                removeDeleted();
                getImagesWhileGridHasVisibleEmptySpace();
            }
        });
    }
}