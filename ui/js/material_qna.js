import angular from 'angular';
import angularHighlight from 'angular-highlightjs';
import angularMaterialDataTable from 'angular-material-data-table';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';
import angularDeckgrid from 'angular-deckgrid';
import ngFileUpload from 'ng-file-upload';
import theme from './theme';
import AuthFactory from './factories/auth';
import PrefetchImageFactory from './factories/prefetch_image';
import SearchFactory from './factories/search';
import RandomImageFactory from './factories/random_image';
import ToastFactory from './factories/toast';
import MainController from './controllers/main';
import ToolbarController from './controllers/toolbar';
import AuthController from './controllers/auth';
import QuestionGridController from './controllers/question_grid';
import QnADialogController from './controllers/qna_dialog';
import DashboardController from './controllers/dashboard'
import DashboardSidenavController from './controllers/dashboard_sidenav'
import DashboardAccountController from './controllers/dashboard_account';
import DashboardUsersController from './controllers/dashboard_users';
import DashboardUsersSearchController from './controllers/dashboard_users_search';
import DashboardUsersEditController from './controllers/dashboard_users_edit';
import DashboardQnAController from './controllers/dashboard_qna';
import DashboardQnAAddEditController from './controllers/dashboard_qna_add_edit';
import DashboardQnASearchController from './controllers/dashboard_qna_search';
import DashboardQnAUploadController from './controllers/dashboard_qna_upload';
import DashboardQnAImageController from './controllers/dashboard_qna_image';
import DashboardHistoryController from './controllers/dashboard_history';
import '../../node_modules/highlight.js/styles/rainbow';
import '../../node_modules/angular-material/angular-material.css';
import '../../node_modules/angular-material-data-table/dist/md-data-table.css';
import '../css/material_qna';
import '../images/favicon';

angular
    .module('material-qna', [
        angularMaterial,
        angularMaterialDataTable,
        angularMessages,
        angularDeckgrid,
        ngFileUpload,
        angularHighlight
    ])
    .config(theme)
    .factory('auth', AuthFactory)
    .factory('prefetchImage', PrefetchImageFactory)
    .factory('search', SearchFactory)
    .factory('randomImage', RandomImageFactory)
    .factory('toast', ToastFactory)
    .controller('mainController', MainController)
    .controller('toolbarController', ToolbarController)
    .controller('authController', AuthController)
    .controller('questionGridController', QuestionGridController)
    .controller('qnaDialogController', QnADialogController)
    .controller('dashboardController', DashboardController)
    .controller('dashboardSidenavController', DashboardSidenavController)
    .controller('dashboardAccountController', DashboardAccountController)
    .controller('dashboardUsersController', DashboardUsersController)
    .controller('dashboardUsersEditController', DashboardUsersEditController)
    .controller('dashboardUsersSearchController', DashboardUsersSearchController)
    .controller('dashboardQnAController', DashboardQnAController)
    .controller('dashboardQnAAddEditController', DashboardQnAAddEditController)
    .controller('dashboardQnAUploadController', DashboardQnAUploadController)
    .controller('dashboardQnASearchController', DashboardQnASearchController)
    .controller('dashboardQnAImageController', DashboardQnAImageController)
    .controller('dashboardHistoryController', DashboardHistoryController);