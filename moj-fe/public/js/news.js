(function ($) {
    $(function () {

        $(".news-item .btn").on("click", function (e) {

            e.preventDefault();
            var targetShow = $(this).data("show");
            $(targetShow).show();
            
            var targetHide = $(this).data("hide");
            $(targetHide).hide();
        });
    });
}(jQuery));
