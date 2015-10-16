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
import AdminController from './controllers/admin'
import AdminSidenavController from './controllers/admin_sidenav'
import AdminUsersController from './controllers/admin_users';
import AdminUsersSearchController from './controllers/admin_users_search';
import AdminUsersEditController from './controllers/admin_users_edit';
import AdminQnAController from './controllers/admin_qna';
import AdminQnAAddEditController from './controllers/admin_qna_add_edit';
import AdminQnASearchController from './controllers/admin_qna_search';
import AdminQnAUploadController from './controllers/admin_qna_upload';
import AdminQnAImageController from './controllers/admin_qna_image';
import AdminHistoryController from './controllers/admin_history';
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
    .controller('adminController', AdminController)
    .controller('adminSidenavController', AdminSidenavController)
    .controller('adminUsersController', AdminUsersController)
    .controller('adminUsersEditController', AdminUsersEditController)
    .controller('adminUsersSearchController', AdminUsersSearchController)
    .controller('adminQnAController', AdminQnAController)
    .controller('adminQnAAddEditController', AdminQnAAddEditController)
    .controller('adminQnAUploadController', AdminQnAUploadController)
    .controller('adminQnASearchController', AdminQnASearchController)
    .controller('adminQnAImageController', AdminQnAImageController)
    .controller('adminHistoryController', AdminHistoryController);