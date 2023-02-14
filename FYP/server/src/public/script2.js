window.onload = function () {
    setup();
}

function setup(){
    alert("loaded body")
    var jmolAppletX;

    var Info = {
        width : 500,
        height : 500,
        use : "HTML5", 
        script: "load =1crn",
        readyFunction: jmol_isReady,
        allowJavaScript : true
    }

    Jmol.getApplet("jmolAppletX", Info);
    Jmol.jmolButton("jmolAppletX", "wireframe;");


}

function jmol_isReady(){
    document.getElementById("appdiv").innerHTML =     Jmol.getAppletHtml("jmolAppletX", Info);


    console.log(jmolAppletX)
}