class AdminQnAUploadController {
    constructor($scope, Upload, toast) {
        Object.assign($scope, {
            example: JSON.stringify([
                {
                    disabled: true,
                    question: 'A pita is a type of what?',
                    image: 'http://images.wisegeek.com/stack-of-fresh-pita-bread.jpg',
                    correctAnswer: 1,
                    answers: [
                        'fresh fruit',
                        'flat bread',
                        'French tart',
                        'friend bean dip'
                    ]
                },
                {
                    question: 'According to the USDA, which food group should you eat the most servings of per day?',
                    correctAnswer: 3,
                    answers: [
                        'vegetables',
                        'dairy',
                        'meats',
                        'breads'
                    ]
                }
            ], null, 2),
            upload: function(file) {
                if (file && !$scope.uploading) {
                    $scope.uploading = true;

                    Upload.upload({
                        url: 'qna',
                        data: {qna: file},
                        method: 'PUT'
                    }).success(function() {
                        toast.show('QnA uploaded successfully');
                    }).catch(function() {
                        toast.show('Unable to upload QnA');
                    }).finally(function() {
                        $scope.uploading = false;
                    });
                }
            }
        });
    }
}

AdminQnAUploadController.$inject = ['$scope', 'Upload', 'toastFactory'];

export default AdminQnAUploadController;