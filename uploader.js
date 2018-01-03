$(function() {
    var imageUI = new ImageUI();
    var progressDialog = new ProgressDialog(imageUI);
    var dropHandler = new DropHandler($(document), progressDialog);

    
    imageUI.fetchImages();
    $(document).tooltip({
        item: ".upload_progress_lable",
        content: function() {
            return $(this).attr("title");
        }
    });
    
    //window.progressDialog = progressDialog;
});