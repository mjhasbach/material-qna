import map from 'lodash/collection/map';
import without from 'lodash/array/without';
import reject from 'lodash/collection/reject';
import contains from 'lodash/collection/contains';
import qnaDialogTemplate from '../../templates/qna_dialog';

class QuestionGridController {
    constructor($scope, $http, $window, $mdDialog, randomImage, prefetchImage, toast) {
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

                    $http.get('question/grid', {params: {exclude: map(questions, 'id')}})
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
            };

        Object.assign($scope, {
            questions: [],
            imageClicked(e, id) {
                $http.get('qna', {params: {id}}).then(function({data}) {
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
                }).catch(function() {
                    toast.show('Unable to get QnA');
                });
            }
        });

        $content.bind('scroll', getImagesWhileGridHasVisibleEmptySpace);
        angular.element($window).bind('resize', getImagesWhileGridHasVisibleEmptySpace);
        $scope.$watch('view.current', getImagesWhileGridHasVisibleEmptySpace);
    }
}

QuestionGridController.$inject = [
    '$scope',
    '$http',
    '$window',
    '$mdDialog',
    'randomImageFactory',
    'prefetchImageFactory',
    'toastFactory'
];

export default QuestionGridController;