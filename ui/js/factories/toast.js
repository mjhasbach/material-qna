export default function($mdToast) {
    'ngInject';

    return {
        hide() {
            $mdToast.hide();
        },
        show(message, delay) {
            let toast = $mdToast.simple()
                .content(message)
                .action('OK')
                .position('bottom right')
                .hideDelay(angular.isNumber(delay) ? delay : Math.pow(2, 31) - 1);

            $mdToast.show(toast);
        }
    };
}