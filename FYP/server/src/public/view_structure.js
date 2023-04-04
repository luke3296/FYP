window.onload = function() {


    
        var JmolInfo = {
            width: 300,
            height: 300,
            //serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
            use: "HTML5",
            script: "load=1adg"
        }
      
        document.getElementById("appdiv1").innerHTML = Jmol.getAppletHtml(
            "jmolApplet0",
            JmolInfo
        );

        var JmolInfo = {
          width: 300,
          height: 300,
          //serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
          use: "HTML5",
          script: "load http://localhost:5123/public/OutputPDBS/PDBID_1ADG_CHAIN_A_BEG_290_END_303_PHITARGS_291_-90_292_-110_293_-64_PSITARGS_291_122_292_-35_PHICONSTR_295_296_PSICONSTR_295_296_ITTR_10000.pdb"
      }
    
      document.getElementById("appdiv2").innerHTML = Jmol.getAppletHtml(
          "jmolApplet1",
          JmolInfo
      );

    };

//matlab -nodisplay -nojvm -r  "wrapper_loop_modeller2('1adg','LADH_loopmovement.pdb','A',290,301,[291 -90 ; 292 -110; 293 -64; 294 -90],[291 122; 292 -35; 293 147],[295 296],[294 295],10000);exit;"
    function setDefault(){
      pdbid='1adg'
      fname='LADH_loop_movement.pdb'
      chain='A'
      segb=290
      sege=301
      //291 -90 ; 292 -110; 293 -64; 294 -90]
      phitargs=[]
      phitargs.append([291,-90])
      phitargs.append([292, -110])
      phitargs.append([293, -64])
      phitargs.append([294, -90])
      //[291 122; 292 -35; 293 147]
      psitargs=[]
      psitargs.append([291, 122])
      psitargs.append([292, -35])
      psitargs.append([293 , 147])
      //[295 296]
      phiconstr=[295,  296]
      //[294 295]
      psiconstr=[294 , 295]

      itter=10000

      document.getElementById("pdbcode_input").value = pdbid


    }

    function load_pdb() {
        console.log("clicked" + jmolApplet0);
        var pdbCode = document.getElementById("pdbcode_input").value;
        Jmol.script(jmolApplet0, "load=" + pdbCode);
    }

    function rotate_model() {
        Jmol.script(jmolApplet0, "rotate y 30");
    }

    function reset_view() {
        Jmol.script(jmolApplet0, "reset");
    }

    function highlight() {
        var start = document.getElementById("start").value;
        var end = document.getElementById("end").value;
        Jmol.script(
            jmolApplet0,
            "select " + start + "-" + end + "; color orange"
        );
    }
//doesnt work
    function print_atoms() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    console.log(Jmol.getPropertyAsArray(jmolApplet0, "chainInfo").models[0].chains[0].residues)
    console.log(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0])
    console.log(start + " "+ end)
    for(i=start-1;i<end;i=i+1){
      console.log()
    }

    Jmol.script(jmolApplet0, "console.log(modelView('" + start + "-" + end + "', {atomsOnly: true}));");
  }
//doesnt work
  function calculate_torsion_angles() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var torsion_angles = Jmol.evaluate(jmolApplet0, "measure torsion " + start + "-" + end);
    console.log(torsion_angles);
}

function run_jmol_script() {
        var cmd = document.getElementById("cmd_str").value;
        Jmol.script(jmolApplet0, cmd);
    }

function getBackboneCoordinates(jmolApplet) {
  // Define the backbone atom names
    var backboneAtoms = ["N", "CA", "C", "O"];
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var atomInfo = Jmol.getPropertyAsArray(jmolApplet0, "atomInfo")
    console.log(atomInfo)
  // Initialize an empty array to store the backbone atom coordinates
  var backboneCoords = [];

  // Iterate over the backbone atoms
  for (var i = 0; i < backboneAtoms.length; i++) {
    // Get the coordinates for each backbone atom
    var atomCoords = Jmol.getAtomProperty(jmolApplet, backboneAtoms[i], "xyz");

    // Push the atom coordinates to the backboneCoords array
    backboneCoords.push(atomCoords);
  }

  // Return the backbone atom coordinates
  return backboneCoords;
}

function Sync(){
  if (document.getElementById("sync").checked == true){
    Jmol.script(jmolApplet0,'sync * on; sync * "set syncMouse true"')
  }else{
    Jmol.script(jmolApplet0,'sync * off')
  }
}

async function Load(){
  val = document.getElementById("load").value
  console.log(val)
  data = await getPdb(val)
  console.log(data)
  Jmol.script(jmolApplet0, "load "+data.redirectUrl)
}

  async function getPdb(fname) {
    const response = await fetch("http://localhost:5123/api/v1/pdbs/", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ fname : fname })
    });
    const data = await response.json();
    return data;
  }

  //  document.getElementById("run_cmd").addEventListener("click", run_jmol_script);


    //document.getElementById("load2model").addEventListener("click", load_pdb);

    document.getElementById("Rotate").addEventListener("click", rotate_model);

    document.getElementById("ResetView").addEventListener("click", reset_view)

    document.getElementById("Highlight segment").addEventListener("click", highlight)
