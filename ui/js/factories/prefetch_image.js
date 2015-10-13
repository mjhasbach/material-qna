import contains from 'lodash/collection/contains';

function prefetchImageFactory($http, $q) {
    return function(url, corsPort) {
        let src = corsPort ? `http://${window.location.hostname}:${corsPort}/${url}` : url;

        return $q(function(resolve, reject) {
            $http.get(src).then(function(res) {
                contains(res.headers()['content-type'], 'image') ?
                    resolve(src) :
                    reject(new Error('Non-image response'));
            }).catch(reject);
        });
    }
}

prefetchImageFactory.$inject = ['$http', '$q'];

export default prefetchImageFactory;