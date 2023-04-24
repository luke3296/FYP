//server_name will be reassigned to the current host when the page loads
server_name = "http://localhost:5123/"
post_job_endpoint='/api/v1/pdbs/'

let target_residues_phi_stack = [];
let target_residues_psi_stack = [];
let constr_residues_phi_stack = [];
let constr_residues_psi_stack = [];

window.onload=function(){
	console.log(window.location.host)
	server_name=window.location.host
	document.getElementById("original").addEventListener("click", setTheme)
	document.getElementById("Solarised Dark").addEventListener("click", setTheme)
	document.getElementById("Pastel").addEventListener("click", setTheme)
	document.querySelector('.spinner-border').hidden=true
}

function add_target_phi() {
	console.log("call")
	let phi_idx = Number.parseInt(document.getElementById("target_residues_phi_idx").value);
	let phi_val = Number.parseFloat(document.getElementById("target_residues_phi_value").value);
	let p_tag_text = document.getElementById("target_phi_string").innerHTML;
	phi_idx_is_num = phi_idx.toString() != "NaN" //(typeof phi_idx === 'number' || phi_idx instanceof Number) && phi_idx != NaN
	phi_val_is_num = phi_val.toString() != "NaN" //(typeof phi_val === 'number' || phi_val instanceof Number) && phi_val != NaN

	if (!phi_idx_is_num) {
		showError("phi_idx not valid")
		if (!phi_val_is_num) {
			console.log(phi_idx_is_num + " " + phi_val_is_num)
			console.log(typeof(phi_val))
			showError("phi_val not valid")
		}
	}
	if (phi_idx_is_num && phi_val_is_num) {
		// p_tag_text = p_tag_text + " " + phi_idx + " " + phi_val + "\n"
		//document.getElementById("target_phi_string").innerHTML = p_tag_text;
		target_residues_phi_stack.push([phi_idx, phi_val]);
		printStacks();
	}
} 

function remove_target_phi() {
	target_residues_phi_stack.pop();
	printStacks();
}

function add_target_psi() {
	let psi_idx = Number.parseInt(document.getElementById("target_residues_psi_idx").value);
	let psi_val = Number.parseFloat(document.getElementById("target_residues_psi_value").value);
	let p_tag_text = document.getElementById("target_psi_string").innerHTML;
	psi_idx_is_num = psi_idx.toString() != "NaN" // (typeof psi_idx === 'number' || psi_idx instanceof Number) && psi_idx != NaN
	psi_val_is_num = psi_val.toString() != "NaN" // (typeof psi_val === 'number' || psi_val instanceof Number) && psi_val != NaN

	if (!psi_idx_is_num) {
		showError("psi_idx not valid")
		if (!psi_val_is_num) {
			showError("psi_val not valid")
		}
	}
	if (psi_idx_is_num && psi_val_is_num) {
		// p_tag_text = p_tag_text + " " + psi_idx + " " + psi_val + "\n"
		// document.getElementById("target_psi_string").innerHTML = p_tag_text;
		target_residues_psi_stack.push([psi_idx, psi_val]);
		printStacks();
	}
}

function remove_target_psi() {
	target_residues_psi_stack.pop();
	printStacks();
}

function add_constr_phi() {
	let phi_idx = Number.parseInt(document.getElementById("constr_residues_phi").value);
	let p_tag_text = document.getElementById("constr_residues_phi_string").innerHTML;
	phi_idx_is_num = phi_idx.toString() != "NaN" //(typeof phi_idx === 'int' || phi_idx instanceof Number) && phi_idx != NaN
	if (!phi_idx_is_num) {
		showError("phi_constr not valid")
	}
	if (phi_idx_is_num) {
		//  p_tag_text = p_tag_text + " " + phi_idx+ "\n"
		//  document.getElementById("constr_residues_phi_string").innerHTML = p_tag_text;
		constr_residues_phi_stack.push(phi_idx);
		printStacks();
	}
}

function remove_constr_phi() {
	constr_residues_phi_stack.pop();
	printStacks();
}

function add_constr_psi() {
	let psi_idx = Number.parseInt(document.getElementById("constr_residues_psi").value);
	let p_tag_text = document.getElementById("constr_residues_psi_string").innerHTML;
	psi_idx_is_num = psi_idx.toString() != "NaN" //(typeof psi_idx === 'int' || psi_idx instanceof Number) && psi_idx != NaN
	if (!psi_idx_is_num) {
		showError("psi_constr not valid")
	}
	if (psi_idx_is_num) {
		// p_tag_text = p_tag_text + " " + psi_idx+ "\n"
		// document.getElementById("constr_residues_psi_string").innerHTML = p_tag_text
		constr_residues_psi_stack.push(psi_idx);
		printStacks();
	}
}

function remove_constr_psi() {
	constr_residues_psi_stack.pop();
	printStacks();
}

async function submit_to_server() {
	let pdb_id = document.getElementById("pdb_txt_input").value;
	let chain = document.getElementById("chain").value;
	let segbeg = Number.parseInt(document.getElementById("segbeg").value);
	let segend = Number.parseInt(document.getElementById("segend").value);
	let itterations = Number.parseInt(document.getElementById("itterations").value);
	let isValid = validateInput(pdb_id, chain, segbeg, segend, itterations);

	if (isValid) {
		console.log("send json");
		obj = {
			"pdb_id": pdb_id.toUpperCase(),
			"chain": chain.toUpperCase(),
			"segbeg": segbeg,
			"segend": segend,
			"target_residues_phi": target_residues_phi_stack,
			"target_residues_psi": target_residues_psi_stack,
			"constr_residues_phi": constr_residues_phi_stack,
			"constr_residues_psi": constr_residues_psi_stack,
			"itterations": itterations
		}
		std_fname=genStandardFileName(obj)
		snd_obj = {
			"pdb_id": pdb_id.toUpperCase(),
			"fname" : std_fname.toUpperCase(),
			"chain": chain,
			"segbeg": segbeg,
			"segend": segend,
			"target_residues_phi": target_residues_phi_stack,
			"target_residues_psi": target_residues_psi_stack,
			"constr_residues_phi": constr_residues_phi_stack,
			"constr_residues_psi": constr_residues_psi_stack,
			"itterations": itterations
		}
        //console.log(obj)http://
		//await fetch('http://localhost:5123/api/v1/pdbs/', {
		document.querySelector('.spinner-border').hidden=false
		await fetch('http://'+server_name+post_job_endpoint, {
				method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(snd_obj)
			}).then(res => res.json())
			  .then(res => {
                if(res.redirectUrl == false){
                    console.log("no file found or error encountered")
					document.querySelector('.spinner-border').hidden=true
					document.getElementById("err_txt").innerText="The server encountered an error with these inputs"
                }else{
				    console.log(res.redirectUrl)
					document.getElementById("err_txt").innerHTML=`The file was created, try search for it on the view_structure page. Or 
					download here : <a href=${res.redirectUrl}>link</a>`
					document.querySelector('.spinner-border').hidden=true

                }

			});

	}

}

function showError(msg) {
	document.getElementById("err_txt").innerText = msg;
	document.getElementById("error_info").style.visibility = "visible"
}

function validateInput(pdb_id, chain, segbeg, segend, itterations) {
	// is pdb_id a 4 character string
	pdbid_is_4char = (typeof pdb_id === 'string' || pdb_id instanceof String) && pdb_id.length == 4
	if (!pdbid_is_4char) {
		showError("pdb_id is invalid")
	}
	//is chain a string / character (length = 1)
	chain_is_1char = (typeof chain === 'string' || chain instanceof String) && chain.length == 1
	if (!chain_is_1char) {
		showError("chain invalid")
	}
	//is segbeg a number
	segbeg_is_num = (typeof segbeg === 'number' || segbeg instanceof Number)
	if (!segbeg_is_num) {
		showError("segbeg invalid")
	}
	//is seg end a number
	segend_is_num = (typeof segend === 'number' || segend instanceof Number)
	if (!segbeg_is_num) {
		showError("segend invalid")
	}
	//is segend > segbeg
	if (segend < segbeg) {
		showError("segend is > than segbeg which is not allowd")
	}
	itterations_is_num = (typeof itterations === 'number' || itterations instanceof Number) && itterations < 100000
	if (!segbeg_is_num) {
		showError("segbeg invalid")
	}
	//is phi_targ_arr a list of number pairs 
	//is phi_targ_arr a list of number pairs 

	//is phi_targ_arr a list of numbers 
	//is phi_targ_arr a list of numbers

	//is number of pairs in phi tar and phi targ < segend - segbeg
	let lengths_fit = ((target_residues_phi_stack.length < (segend - segbeg)) ||
		(target_residues_psi_stack.length < (segend - segbeg)) ||
		(constr_residues_phi_stack.length < (segend - segbeg)) ||
		(constr_residues_psi_stack.length < (segend - segbeg)))

	if (!lengths_fit) {
		showError("length mismatch")
	}
	//is number of pairs in phi const and phi const < segend - segbeg

	//check no residues are being targeted and constrained 
	return pdbid_is_4char  & chain_is_1char & segbeg_is_num & segend_is_num & itterations_is_num & lengths_fit

}

function printStacks() {

	targ_phi_str = "";
	targ_psi_str = "";
	constr_phi_str = "";
	constr_psi_str = "";
	target_residues_phi_stack.forEach(element => {
		console.log(target_residues_phi_stack);
		console.log(element);
		targ_phi_str = targ_phi_str + " " + element[0] + " " + element[1] + ", "
	});
	target_residues_psi_stack.forEach(element => {
		targ_psi_str = targ_psi_str + " " + element[0] + " " + element[1] + ", "
	});
	constr_residues_phi_stack.forEach(element => {
		constr_phi_str = constr_phi_str + " " + element + ", "

	});
	constr_residues_psi_stack.forEach(element => {
		constr_psi_str = constr_psi_str + " " + element + ", "
	});
	document.getElementById("target_phi_string").innerHTML = targ_phi_str;
	document.getElementById("target_psi_string").innerHTML = targ_psi_str;
	document.getElementById("constr_residues_phi_string").innerHTML = constr_phi_str;
	document.getElementById("constr_residues_psi_string").innerHTML = constr_psi_str;
}

function setDefault() {
	document.getElementById("pdb_txt_input").value = "1ADG";
	document.getElementById("chain").value = "A";
	document.getElementById("segbeg").value = 290;
	document.getElementById("segend").value = 301;
	document.getElementById("itterations").value = 10000;

	target_residues_phi_stack = [];
	target_residues_psi_stack = [];
	constr_residues_phi_stack = [];
	constr_residues_psi_stack = [];

	target_residues_phi_stack.push([291, -90])
	target_residues_phi_stack.push([292, -110])
	target_residues_phi_stack.push([293, -64])
	target_residues_phi_stack.push([294, -90])

	target_residues_psi_stack.push([291, 122])
	target_residues_psi_stack.push([292, -35])
	target_residues_psi_stack.push([293, 147])

	constr_residues_phi_stack.push(295)
	constr_residues_phi_stack.push(296)

	constr_residues_psi_stack.push(295)
	constr_residues_psi_stack.push(296)

	printStacks()

}

function jmol_isReady() {
	console.log("jmol is redy")

	beg = Number.parseInt(document.getElementById("segbeg").value)
	end = Number.parseInt(document.getElementById("segend").value)

	console.log(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo"))
	var phis = []
	var psis = []
	var torsions = []

	console.log("beg " + beg + " end " + end)
	if (!(beg > 0)) {
		beg = beg - 1
	}
	for (i = beg; i <= end; i++) {
		torsions.push(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[i].phi)
		torsions.push(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[i].psi)

	}

	document.getElementById("show_tors").style.setProperty("visibility", "visible")

	document.getElementById("intial_tosions").innerHTML = torsions

}

function show_initial_torsions() {
	beg = Number.parseInt(document.getElementById("segbeg").value)
	end = Number.parseInt(document.getElementById("segend").value)
	pdbid = document.getElementById("pdb_txt_input").value
	console.log(pdbid)
	var JmolInfo = {
		width: 300,
		height: 300,
		//serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
		use: "HTML5",
		readyFunction: jmol_isReady,
		script: "load=" + pdbid
		//script:"load http://localhost:5123/public/1crn.pdb"
	}
	document.getElementById("appdiv").innerHTML = Jmol.getAppletHtml(
		"jmolApplet0",
		JmolInfo
	);
	Jmol.script("jmolApplet0", "select backbone and (resno >=" + beg + " and resno <= " + end + ")")
}

function genStandardFileName(json_obj){
    //console.log(json_obj)

    res="PDBID_"
    res=res+json_obj.pdb_id.toUpperCase()
    res=res+`_CHAIN_${json_obj.chain}`
    res=res+"_BEG_"
    res=res+json_obj.segbeg
    res=res+"_END_"
    res=res+json_obj.segend
    res=res+"_PHITARGS"
    //console.log(json_obj.target_residues_phi.length)
    //console.log(json_obj.target_residues_phi[1].length)
    for(var i=0;i<json_obj.target_residues_phi.length;i++){
        res=res+"_"+json_obj.target_residues_phi[i][0]+"_"+json_obj.target_residues_phi[i][1]
        //console.log(`_${json_obj.target_residues_phi[i][0]}_${json_obj.target_residues_phi[i][1]}`)
    }
    
    //res=res+String(json_obj.target_residues_phi).replace(",", "_");
    res=res+"_PSITARGS"
    //console.log(json_obj.target_residues_psi.length)
    for(var i=0;i<json_obj.target_residues_psi.length;i++){
        //console.log( "value "+json_obj.target_residues_psi[i][0])
        res=res+"_"+json_obj.target_residues_psi[i][0]+"_"+json_obj.target_residues_psi[i][1]
        //console.log(`_${json_obj.target_residues_psi[i][0]}_${json_obj.target_residues_psi[i][1]}`)
    }
    //console.log(json_obj.target_residues_psi[0][0])
   //res=res+String(json_obj.target_residues_psi).replace(",", "_");
   res=res+"_PHICONSTR"
   for(var i=0;i<json_obj.constr_residues_phi.length;i++){
	  res=res+"_"+json_obj.constr_residues_phi[i]
   }
   
  //res=res+String(json_obj.constr_residues_phi).replace(",", "_");
   res=res+"_PSICONSTR"
   for(var i=0;i<json_obj.constr_residues_psi.length;i++){
	   res=res+"_"+json_obj.constr_residues_psi[i]
   }
   // res=res+String(json_obj.constr_residues_psi).replace(",", "_");
    res=res+"_ITTR_"+json_obj.itterations
    //console.log(res)
	res=res+".pdb"
    return res
    }

	function get_torsion_angle(seqNum){

		phi= Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[seqNum].phi
		psi= Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[seqNum].psi
		//console.log("phi " +phi + " psi " + psi)
		return {"phi" : phi , "psi": psi}
	  }
	  function show_torsion(){
		num=document.getElementById('seqNum').value
		tors = get_torsion_angle(num)
		console.log(psi)
		outDiv=document.getElementById('search_result1')
		p = document.createElement('p');
		p.innerText=`seq ${num}, φ ${tors.phi.toFixed(8)}, ψ ${tors.psi.toFixed(8)}`
		p.onclick = hilight_sgl
		outDiv.appendChild(p)
	  
	  }
	  function clear_torsion(){
		document.getElementById('search_result1').innerHTML=''
	  }
	  function hilight_sgl(event){
		text=event.target.innerText.match(re1)[0]
		text=text.replace("seq", "")
		text=text.trim()
		//console.log(text)
		Jmol.script(jmolApplet0, "select "+text+ "; color lawngreen")
	  }

	function setTheme(event) {
	theme=event.target.id
	console.log(theme)
	switch(theme) {
	  case 'original':
		console.log("set og theme")
		document.getElementById("first").style.backgroundColor  = 'lightblue';
		document.getElementById("first").style.color = 'black';
		document.getElementById("second").style.backgroundColor  = 'lightgreen';
		document.getElementById("second").style.color = 'black';
		document.getElementById("third").style.backgroundColor  = 'lightblue';
		document.getElementById("third").style.color = 'black';
		document.body.style.backgroundColor  = 'lightgrey';
		
		document.getElementById("nav").style.backgroundColor  ='#e3f2fd'
	  //document.querySelectorAll('nav')[0].style.backgroundColor='#e3f2fd'
	
		inputs=document.querySelectorAll('input')
		for(var i=0; i< inputs.length;i++){
		  inputs[i].style.backgroundColor='white'
		}
		
		inputs=document.querySelectorAll('.nav-link')
		for(var i=0; i< inputs.length;i++){
		  inputs[i].style.color='#839496'
		}
		
		break;
		case 'Solarised Dark':
			document.getElementById("first").style.backgroundColor  = '#073642';
			document.getElementById("first").style.color = '#839496';
			document.getElementById("second").style.backgroundColor  = '#586e75';
			document.getElementById("second").style.color = '#839496';
			document.getElementById("third").style.backgroundColor  = '#073642';
			document.getElementById("third").style.color = '#839496';
			document.body.style.backgroundColor  = '#002b36';
			
			document.getElementById("nav").style.backgroundColor  ='#93a1a1'
		  //document.querySelectorAll('nav')[0].style.backgroundColor='#e3f2fd'
		
			inputs=document.querySelectorAll('input')
			for(var i=0; i< inputs.length;i++){
			  inputs[i].style.backgroundColor='#586e75'
			}
			
			inputs=document.querySelectorAll('.nav-link')
			for(var i=0; i< inputs.length;i++){
			  inputs[i].style.color='#cb4b16'
			}
		break;
		case 'Pastel':
		  console.log("set pastal theme")
		  document.getElementById("first").style.backgroundColor  = '#A6B1E1';
		  document.getElementById("first").style.color = '#424874';
		  document.getElementById("second").style.backgroundColor  = '#9BA4B5';
		  document.getElementById("second").style.color = '#424874';
		  document.getElementById("third").style.backgroundColor  = '#A6B1E1';
		  document.getElementById("third").style.color = '#424874';
		  document.body.style.backgroundColor  = '#9BA4B5';
		  
		  document.getElementById("nav").style.backgroundColor  ='#9BA4B5'
		//document.querySelectorAll('nav')[0].style.backgroundColor='#e3f2fd'
	  
		  inputs=document.querySelectorAll('input')
		  for(var i=0; i< inputs.length;i++){
			inputs[i].style.backgroundColor='#A6B1E1'
		  }
		  
		  inputs=document.querySelectorAll('.nav-link')
		  for(var i=0; i< inputs.length;i++){
			inputs[i].style.color='black'
		  }
		break;
	}
	}