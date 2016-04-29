


function loadjscssfile(filename, filetype) {
 
    if (filetype == "js") {
        var fileref = document.createElement('script');
        fileref.setAttribute("src", filename);
    } else if (filetype == "css") {
 
        var fileref = document.createElement('link');
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
 
}

loadjscssfile('../css/public.css','css');
loadjscssfile('../js/lib/sea.js','js');
