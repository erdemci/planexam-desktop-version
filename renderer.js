// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var imtihanyeri = function () {
    var fs = require('fs');
    var path = require('path');
    var self = this;

    var mergePdf = function (pathPdf) {
        var exec = require('child_process').execFile;
        console.log("merged start");
        exec(path.join(__dirname, "pdfMergeApp/pdfMergeConsoleApplication.exe"), [pathPdf + '/merged.pdf', pathPdf + "/tmp"], function (err, data) {
            console.log(err)
            console.log(data.toString());
        });
    }

    var saveFile = function (filePath, data) {
        var http = require('http');
        var fileName = data.ExamId + 'SalonBazliListe.pdf';
        var fileDir = filePath + "/files/" + fileName;
        var file = fs.createWriteStream(fileDir);
        var request = http.get("http://imtihanyeri.com/Pdfs/Sinav_af59d197-ad55-4ced-839c-57ddb9b31b14.pdf", function (response) {
            response.pipe(file);
            for (var i = 0; i < data.GroupList.length; i++) {
                createExamFiles(filePath, data.GroupList[i].FileName, parseInt(data.GroupList[i].Count))
            }
            createExamFiles(filePath, fileName, 1);
            mergePdf(filePath);
        });

    }

    var createDirectory = function (examId) {
        var dir = path.join(__dirname, "pdfs/exams" + examId)
        var filesDir = dir + "/files"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            if (!fs.existsSync(filesDir)) {
                fs.mkdirSync(filesDir)
            }
        }
        return dir;
    }

    var copyFile = function (source, target) {
        fs.createReadStream(source).pipe(fs.createWriteStream(target));
    }

    var createExamFiles = function (examPath, fileName, count) {
        var tempPath = examPath + "/tmp";
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath)
        }
        for (var i = 0; i < count; i++) {
            copyFile(examPath + "/files/" + fileName, tempPath + "/" + i + fileName);
        }
    }

    var init = function (data) {
        var dir = createDirectory(data.ExamId);
        try {
            saveFile(dir, data);
        } catch (error) {
            console.log(error);
        }
    }
    return {
        init: init,
        createDirectory: createDirectory
    }
}
window.imtihanyeri = imtihanyeri;