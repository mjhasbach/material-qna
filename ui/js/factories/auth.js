export default function($http) {
    'ngInject';

    return {
        authenticate(isRegistering, username, password) {
            return $http.post(isRegistering ? 'register' : 'login', {username, password});
        },
        logout() {
            return $http.get('logout');
        }
    }
}