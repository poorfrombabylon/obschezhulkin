let id1 = 0

$('.country').click( function () {
    if (id1 != 0) {
        document.getElementById(id1).setAttribute('style', "stroke:#000000;fill:white");
    }
    
    var id = $(this).attr("id");
    var temp = document.getElementById(id);
    temp.setAttribute('style', "fill:green;");
    id1 = id;
});
