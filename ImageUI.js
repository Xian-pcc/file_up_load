function ImageUI() {
    var imageList = $("#image_list");
    
    function displayImages(data) {
        imageList.empty();
        data.forEach(function(image) {
            imageList.append($("<div>" + image.name + "</div>"));
            imageList.append($("<div><img class='scaled_img' data-id='" + image.imageid + "'></div>"));
        });
        imageList.accordion("refresh");
    }
    
    function init() {
        imageList.accordion({
            collapsible: true,
            active: false,
            heightStyle: "content",
            animate: 100,
            beforeActivate: function(event, ui) {
                var img = ui.newPanel.find("img");
                
                img.attr("src", "fetch_image.php?id=" + img.data("id"));
            },
            activate: function(event, ui) {
                var header = ui.newHeader || ui.oldHeader;
                
                if(header !== undefined && header.length > 0) {
                    $("html, body").animate({
                        scroollTop:header.offset().top
                    }, 200);
                }
            }
        });
    }
    
    this.fetchImages = function() {
        $.get("list_images.php", function(data) {
            displayImages(data);
        });
    }
    
    init();
}