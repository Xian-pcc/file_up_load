FileUploadHandler.Status = {
    PENDING: 0,
    CANCELLED: 1,
    UPLOADING: 2,
    SUCCEEDED: 3,
    FAILED: 4
};

if(Object.freeze !== undefined) {
    Object.freeze(FileUploadHandler.Status);
}

function FileUploadHandler(file, ui) {
    var uploadStatus = FileUploadHandler.Status.PENDING;
    
    this.cancel = function() {
        uploadStatus = FileUploadHandler.Status.CANCELLED;
        ui.setProgressLabel("Cancelled!");
        ui.statusChange();
        ui.cancel();
    }
    
    function successCallback(data, status, xhr) {
        if(data.error !== undefined) {
            uploadStatus = FileUploadHandler.Status.FAILED;
            ui.setProgressLabel("ERROR!");
            ui.setProgressTip(data.error);
            ui.statusChange();
        } else {
            uploadStatus = FileUploadHandler.Status.SUCCEEDED;
            ui.setProgressLabel("Completed!");
            ui.statusChange();
        }
        
    }
    
    function errorCallback(data, status, xhr) {
        uploadStatus = FileUploadHandler.Status.FAILED;
        ui.setProgressLabel("ERROR!");
        ui.setProgressTip(status);
        ui.statusChange();
    }
    
    function xhrCallback() {
        var xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = function(event) {
            if(event.lengthComputable) {
                var progress = 100 * event.loaded / event.total;
                ui.setProgress(progress);
            }
        };
        return xhr;
    }
    
    this.upload = function() {
        var fd = new FormData();
        
        fd.append("file", file);
        uploadStatus = FileUploadHandler.Status.UPLOADING;
        ui.setProgressLabel("Uploading...");
        ui.statusChange();
        ui.upload();
        
        $.ajax({
            type: "POST",
            url: "uploader.php",
            data: fd,
            processData: false,
            contentType: false,
            success: successCallback,
            error: errorCallback,
            xhr: xhrCallback
        });
    }
    
    this.getName = function() {
        return file.name;
    }
    
    this.getStatus = function() {
        return uploadStatus;
    }
    
    function init() {
        var reader = new FileReader();
        
        ui.setHandler(this);
        
        ui.setTitle(file.name + "<br>" + file.size + "<br>" + file.type);
        ui.setProgressLabel("Waiting for confirmation...");
        ui.statusChange();
        
        if(file.type.indexOf("image") > -1) {
            reader.onloadend = function() {
                ui.setImage(reader.result);
    };
            reader.readAsDataURL(file);
        } else {
            errorCallback("", "<p><b>Not a image!</b></p><p>This application only handles image files.</p>", null);
        }
        
        
    }
    
    
    
    init.call(this);
}