(function ($) {
    $(function () {

        $(".video-item .btn").on("click", function (e) {

            e.preventDefault();
            $("#expanded").toggle();
            $("#trimmed").toggle();
        });
    });
}(jQuery));
