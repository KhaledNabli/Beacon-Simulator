function loadDemo(demoScenario) {
	// load scenario...

	// build up configurator ui...
	setupConfiguration();
	
	refreshCustomers(demoScenario.customerList);
	refreshBeacons(demoScenario.beaconList);
	$("#saveBeaconPosition").hide();
}

function setupConfiguration() {
	$("#demoConfigurator").load("./configurator.html", function () {
		console.log("Loading Configurator completed.");
		initConfigurator();
		console.log("Init Configurator completed.");
	});

}


function refreshCustomers(customerList) {
	// clear
	$(".draggableCustomer").remove();

	$.each(customerList, function () {
		console.log("add customer: " + this.label)

		var customerDiv = $("<div class=\"row\"></div></div>");
		customerDiv.attr("id", "customer_div_" + this.id);
		customerDiv.css("background-color", this.color);
		customerDiv.addClass("draggableCustomer");

		var customerImgDiv = $("<div class=\"col-xs-4 avatarImgCol vcenter\"></div>");
		var avatarImg = this.img != "" ? this.img : "img/no_avatar.png" ;
		customerImgDiv.append("<img class=\"avatarImg\" src=\"" + avatarImg + "\" />");
		customerDiv.append(customerImgDiv);

		
		var customerProfileDiv = $("<div class=\"col-xs-8 vcenter\"></div>");
		customerProfileDiv.append("<h4>"+this.label+"</h4>");
		customerProfileDiv.append("Member: "+this.id+"<br>");
		customerProfileDiv.append("Age: "+this.age+"<br>");
		customerDiv.append(customerProfileDiv);

		$("#customer-list").append(customerDiv);
	});
	$( ".draggableCustomer" ).draggable();
}

function refreshBeacons(beaconList) {
	
	$(".beaconPlace").remove();
	$("#storeMap").html("<img id=\"storeMapImg\" src=\"" + demoScenario.storeMapImg + "\" ></img>");
	


	$.each(beaconList, function () {
		console.log("add beacon: " + this.label);

		var beaconDiv = $("<div></div>");
		beaconDiv.attr("id", "beacon_div_" + this.id);
		beaconDiv.css("position", "absolute");
		beaconDiv.css("top", this.position.top);
		beaconDiv.css("left", this.position.left);
		beaconDiv.css("width", this.size.width);
		beaconDiv.css("height", this.size.height);
		beaconDiv.css("background-color", this.color);
		beaconDiv.addClass("beaconPlace");
		beaconDiv.html("<h3>"+ this.label +"</h3>");
		$("#storeMap").append(beaconDiv);
	});

	$( ".beaconPlace" ).droppable({ tolerance: "intersect"});
	$( ".beaconPlace" ).on( "dropover", function( event, ui ) {
		console.log(ui.draggable.context.id + " dropped on " + this.id);			
		processBeaconEvent(parseDivId("beacon_div_",this.id), parseDivId("customer_div_",ui.draggable.context.id));
	} );
}


function findObjectById(list, id) {
	for(i = 0; i < list.length; i++) {
		if(list[i].id === id) return i;
	}
	return -1;
}

function processBeaconEvent(beaconId, customerId) {
	console.log("processBeaconEvent(beaconId: " + beaconId + ", customerId: " + customerId + ");");
	var customerIndex = findObjectById(demoScenario.customerList, customerId);
	var beaconIndex = findObjectById(demoScenario.beaconList, beaconId);
	if(customerIndex < 0 || beaconIndex < 0)
		return;

	$("#infobox").html(demoScenario.customerList[customerIndex].label + " ist bei " + demoScenario.beaconList[beaconIndex].label + " angekommen");
		/*
		EventId*:int64,MemberId:int32,BeaconId:int32,PartnerId:int32,EventDttm:stamp
		*/
		var espEventDate = new Date();
		var espEventDttm = "" + espEventDate.getFullYear() + "-" + espEventDate.getMonth() + "-" + espEventDate.getDay() + " " + espEventDate.getHours() + ":" + espEventDate.getMinutes() + ":" + espEventDate.getSeconds();
		//var espEventCsv = "i,n,,"+ (customerList[customerIndex].memberid) +","+ (beaconIndex+1) +",rewe,"+espEventDttm+","+beaconList[beaconIndex].label+"\r\n";
		var espEventCsv = "i,n,,"+ (demoScenario.customerList[customerIndex].id) +","+ (demoScenario.beaconList[beaconIndex].id) +","+ (demoScenario.customerList[customerIndex].label) +"," + (demoScenario.beaconList[beaconIndex].label) +","+ espEventDttm+","+ (demoScenario.customerList[customerIndex].mobilenr) +"\r\n";
		publishEspEvent(demoScenario.espBeaconWindow, espEventCsv);
}

function parseDivId(divPrefix, divId) {
	return parseInt(divId.replace(divPrefix, ""));
}
	
function publishEspEvent(windowUrl, eventCsv) {
	$.ajax({
		type: "POST",
		url: windowUrl,
		contentType : "text/csv",
		data: eventCsv})
	.always(function(responseXml, status) {
		console.log(responseXml);
	});
}
	
function makeBeaconsEditable() {
	$( ".beaconPlace" ).addClass("editable");
	$( ".beaconPlace" ).draggable();
	$( ".beaconPlace" ).resizable();
	$("#editBeaconPosition").hide();
	$("#saveBeaconPosition").show();
}
	
function makeBeaconsHidden() {
	$( ".beaconPlace.editable" ).draggable("destroy");
	$( ".beaconPlace.editable" ).resizable("destroy");
	$( ".beaconPlace.editable" ).removeClass("editable");
}


function saveBeaconPosition(){
	$.each(demoScenario.beaconList, function () {
		//console.log("get position of beacon: " + this.label);
		this.size.width = $("#beacon_div_"+this.id).width();
		this.size.height = $("#beacon_div_"+this.id).height();
		this.position.top = $("#beacon_div_"+this.id).position().top;
		this.position.left = $("#beacon_div_"+this.id).position().left;
		//console.log(this);
	});
	makeBeaconsHidden();
	console.log("var beaconList = " + JSON.stringify(demoScenario.beaconList));
	$("#editBeaconPosition").show();
	$("#saveBeaconPosition").hide();
}



function windowsResize() {

}