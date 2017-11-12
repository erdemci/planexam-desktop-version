var showAnimation = function (willBeAnimationId, willBeHideId, animation) {
    if ($) {
        willBeAnimationId = willBeAnimationId.toString();
        willBeHideId = willBeHideId.toString();
        if (willBeAnimationId != willBeHideId) {
            $("#" + willBeHideId).addClass("display-hide");
            $("#" + willBeAnimationId).removeClass("display-hide");
            $("#" + willBeAnimationId).addClass(animation);
        }
    }
}
const dialog = require('electron').remote.dialog
const fs = require('fs');
const path = require('path');

function readFile(filepath, model) {
    var iy = new imtihanyeri();
    var dir = iy.createDirectory(model.ExamId);

    var fileName = model.ExamId + model.GroupName + ".pdf";
    var target = dir + "/files/" + fileName;
    fs.createReadStream(filepath).pipe(fs.createWriteStream(target));
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        // Change how to handle the file content
        console.log("The file added is : ", filepath);
    });

    return fileName;
}

function getFileInfoFromFolder() {
    fs.readdir(__dirname + "/pdfs/exams1", function (err, files) {
        if (err) return;
        files.forEach(function (f) {
            console.log('Files: ' + f);
        });
    });
}
window.getFileInfoFromFolder = getFileInfoFromFolder;
angApp.controller("homeCtrl", function ($scope, $location, $http) {


    var prepareModel = function (data) {
        var model = {
            GroupList: [],
            ExamId: data.ExamId
        };
        var isError = false;
        if (angular.isArray(data.GroupList)) {
            for (var i = 0; i < data.GroupList.length; i++) {
                if (data.GroupList[i].FileName === undefined)
                    isError = true;
                else {
                    model.GroupList.push({
                        FileName: data.GroupList[i].FileName,
                        Count: data.GroupList[i].Count
                    })
                }
            }
        } else {
            toastr.error("Hata Oluştu");
        }
        if (isError)
            toastr.error("Sınav Kağıdı Seçilmeyen Grup Mevcut");
        else {
            return model;
        }
        return null;
    };

    $scope.test = function (exam) {
        var model = prepareModel(exam);
        if (model != null) {
            if (!!window.imtihanyeri) {
                var iy = new imtihanyeri();
                console.log("iy!!!", iy);
                iy.init(model);
            }
        }
    }

    $scope.readDir = function () {
        var content = fs.readFileSync(__dirname + "/pdfs/exams1/merged.pdf", 'utf8');
        var opt = {
            filters: [{
                name: 'Pdf',
                extensions: ['pdf']
            }]
        }
        dialog.showSaveDialog(opt, function (fileName) {
            if (fileName === undefined) {
                console.log("You didn't save the file");
                return;
            }
            fs.createReadStream(__dirname + "/pdfs/exams2/merged.pdf").pipe(fs.createWriteStream(fileName));
        });

    }
    $scope.selectedSession = {};
    $scope.sessionModelList = [{
        Id: 1,
        SessionDate: new Date(),
        LessonPeriodName: "1.Ders",
        CollectiveBaseClassroomPdfLink: "test",
        SessionExamList: [{
                ExamId: 1,
                ExamName: "Sınav 1",
                SessionBasePdfLink: "sessionBasePdfLink",
                ClassroomId: 2,
                ClassroomName: "9A Sınıfı",
                SupervisorName: "TEST",
                GroupList: [{
                        ExamId: 1,
                        GroupName: "1 - 9coğ",
                        Count: 8,
                    },
                    {
                        ExamId: 1,
                        GroupName: "2 - 12coğ",
                        Count: 7,
                    }
                ]
            },
            {
                ExamId: 2,
                ExamName: "Sınav 2",
                SessionBasePdfLink: "sessionBasePdfLink2",
                ClassroomId: 2,
                ClassroomName: "9B Sınıfı",
                SupervisorName: "TEST2",
                GroupList: [{
                        ExamId: 2,
                        GroupName: "A1 Grubu",
                        Count: 8,
                    },
                    {
                        ExamId: 2,
                        GroupName: "B1 Grubu",
                        Count: 7,
                    }
                ]
            }
        ]
    }];


    $scope.selectSessionExam = function (item) {
        $scope.selectedSession = item;
        showAnimation("selectedClassroomList", "examList", "bounceInLeft");
    }

    $scope.selectGroup = function (group) {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) {
                toastr.error("Dosya Seçilmedi");
            } else {
                group.FileName = readFile(fileNames[0], group);
            }
        });
    }
});