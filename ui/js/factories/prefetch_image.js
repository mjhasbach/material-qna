import contains from 'lodash/collection/contains';

export default function($http, $q) {
    'ngInject';

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