import find from 'lodash/collection/find';
import uniq from 'lodash/array/uniq';
import reduce from 'lodash/collection/reduce';
import map from 'lodash/collection/map';
import nlp from 'nlp_compromise';
import poweredByBingImg from '../../images/powered_by_bing';

export default class {
    constructor($scope, $http, prefetchImage, toast) {
        'ngInject';

        let $searchInput = angular.element(document.querySelector('.search > input')),
            tokenizeQuestion = function() {
                let {question, answers} = $scope.image;

                $scope.tokens = uniq(reduce(
                    nlp.pos(`${question} ${map(answers, 'answer').join(' ')}`, {dont_combine: true}).sentences,
                    function(result, sentence) {
                        sentence.tokens.forEach(function(token) {
                            result.push(token.normalised);
                        });

                        return result;
                    },
                    []
                ));
            },
            init = function() {
                tokenizeQuestion();

                if ($scope.image.url) {
                    prefetchImage($scope.image.url, $scope.corsPort).then(function(url) {
                        $scope.images.push(url);
                    }).catch(function() {
                        return toast.show('Unable to get image');
                    });
                }
            };

        Object.assign($scope, {
            poweredByBingImg,
            query: '',
            images: [],
            previous() {
                $scope.i--;
                $scope.search(true);
            },
            next() {
                $scope.i++;
                $scope.search();
            },
            search(previous) {
                Object.assign($scope, {
                    loading: true,
                    lastQuery: $scope.query,
                    i: $scope.query === $scope.lastQuery ? $scope.i : 0
                });

                $http.get('image', {params: {index: $scope.i, query: $scope.query}}).then(function({data}) {
                    prefetchImage(data, $scope.corsPort).then(function(url) {
                        $scope.images[0] = url;
                        Object.assign($scope, {
                            currentImage: url,
                            loading: false
                        });
                    }).catch(function() {
                        previous ? $scope.previous() : $scope.next();
                    });
                }).catch(function() {
                    $scope.loading = false;
                    toast.show('Unable to get image');
                });
            },
            tokenClicked(e) {
                let text = angular.element(e.target).text().trim(),
                    searchContainsToken = find(
                        nlp.pos($scope.query, {dont_combine: true}).sentences,
                        function({tokens}) {
                            return find(tokens, 'normalised', text);
                        }
                    );

                if (!searchContainsToken) {
                    $scope.query += ($scope.query.length < 1 ? '' : ' ') + text;
                }

                $searchInput.focus();
            },
            leave() {
                $scope.tabs.i = 0;
                $scope.image.question = null;
            },
            save() {
                $scope.image.url = $scope.currentImage;
                $scope.leave();
            }
        });

        init();
    }
}