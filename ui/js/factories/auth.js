function AuthFactory($http) {
    return {
        authenticate(isRegistering, username, password) {
            return $http.post(isRegistering ? 'register' : 'login', {username, password});
        },
        logout() {
            return $http.get('logout');
        }
    }
}

AuthFactory.$inject = ['$http'];

export default AuthFactory;