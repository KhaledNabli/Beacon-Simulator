var demoScenario = {};
var contactHistoryTab = {};


function loadDemo() {
	// load scenario...
	loadConfiguration();
	// build up configurator ui...
	setupConfiguration();
	
	refreshCustomers(demoScenario.customerList);
	refreshBeacons(demoScenario.beaconList);
	$("#saveBeaconPosition").hide();
	

    
	contactHistoryTab = $('#customerInfoDialogCHTab').DataTable({ bJQueryUI: true, jQueryUI: true , "paging": false, "ordering": false, "info": false });
	$("#customerInfoDialog").dialog({autoOpen: false, resizable: false, width:750, hide: "explode"});
}

function setupConfiguration() {
	$("#demoConfigurator").load("./configurator.html", function () {
		console.log("Loading Configurator completed.");
		initConfigurator();
		console.log("Init Configurator completed.");
	});
}



function loadConfiguration() {
	// check local storage
	if(window.localStorage.demoScenario == undefined) {
		console.log("No saved demoScenario in localStorage");
		demoScenario = defaultDemoScenario;
		console.log("Loading default settings from democonfig.js");
	} else {
		console.log("Loading demoScenario from localStorage");
		demoScenario = JSON.parse(window.localStorage.demoScenario);
	}
	return demoScenario;
}


function refreshCustomers(customerList) {
	// clear
	$(".draggableCustomer").parent().remove();

	$.each(customerList, function () {
		//console.log("add customer: " + this.label)

		var customerDivOuter = $("<div class=\"col-xs-4 col-sm-4 col-md-3 col-lg-2\"></div>");
		var customerDiv = $("<div></div>");
		customerDiv.attr("id", "customer_div_" + this.id);
		customerDivOuter.append(customerDiv);
		customerDiv.css("background-color", this.color);
		customerDiv.css("z-index", 10);
		customerDiv.addClass("draggableCustomer");

		var customerImgDiv = $("<div class=\"col-xs-6 avatarImgCol vcenter\"></div>");
		var avatarImg = this.img != "" ? this.img : "img/no_avatar.png" ;
		customerImgDiv.append("<img class=\"avatarImg img-circle\" src=\"" + avatarImg + "\" />");
		customerDiv.append(customerImgDiv);

		
		var customerProfileDiv = $("<div class=\"col-xs-6 vcenter\"></div>");
		customerProfileDiv.append("<h4>"+this.label+"</h4>");
		customerProfileDiv.append("Member: "+this.id+"<br>");
		customerProfileDiv.append("Age: "+this.age+"<br>");
		customerDiv.append(customerProfileDiv);

		$("#customer-list").append(customerDivOuter);
	});
	$( ".draggableCustomer" ).draggable();
	$( ".draggableCustomer" ).on('tap', function() {
  		displayCustomerProfile(this);
	});
	$( ".draggableCustomer" ).on('click', function() {
  		displayCustomerProfile(this);
	});
}

function refreshBeacons(beaconList) {
	
	var makeBeaconsEditable = $(".beaconPlace.editable").length > 0;
	$(".beaconPlace").remove();
	$("#storeMap").html("<img id=\"storeMapImg\" src=\"" + demoScenario.storeMapImg + "\" ></img>");
	demoScenario.storeMapScale = $("#storeMapImg").width() / demoScenario.storeMapOrigWidth;


	$.each(beaconList, function () {
		//console.log("add beacon: " + this.label);

		var beaconDiv = $("<div></div>");
		beaconDiv.attr("id", "beacon_div_" + this.id);
		beaconDiv.css("position", "absolute");
		beaconDiv.css("top", this.position.top * demoScenario.storeMapScale);
		beaconDiv.css("left", this.position.left * demoScenario.storeMapScale);
		beaconDiv.css("width", this.size.width * demoScenario.storeMapScale);
		beaconDiv.css("height", this.size.height * demoScenario.storeMapScale);
		beaconDiv.css("background-color", this.color);
		beaconDiv.addClass("beaconPlace");
		beaconDiv.html("<h3>"+ this.label +"</h3>");
		if(makeBeaconsEditable) {
			beaconDiv.addClass("editable");
			beaconDiv.draggable();
			beaconDiv.resizable();
		}

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
	//var espEventCsv = "i,n,,"+ (customerList[customerIndex].memberid) +","+ (beaconIndex+1) +",rewe,"+espEventDttm+","+beaconList[beaconIndex].label+"\r\n";

	var espEventDttm = getCurrentTimestamp()
	var espEventCsv = "i,n,,"+ (demoScenario.customerList[customerIndex].id) +","+ (demoScenario.beaconList[beaconIndex].id) +","+ (demoScenario.customerList[customerIndex].label) +"," + (demoScenario.beaconList[beaconIndex].label) +","+ espEventDttm+","+ (demoScenario.customerList[customerIndex].mobilenr) + ","+ (demoScenario.customerList[customerIndex].age) +"\r\n";
	

	publishEspEvent(demoScenario.espBeaconWindow, espEventCsv);
}


function getCurrentTimestamp() {
	var currentDate = new Date();
	return ("" + currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds());
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
	.error(function (responseXml, status) {
		alert("ERROR: Can not connect to ESP!\nPlease check connection details.");
	})
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
		this.size.width = 	Math.round($("#beacon_div_"+this.id).width() / demoScenario.storeMapScale);
		this.size.height = 	Math.round($("#beacon_div_"+this.id).height() / demoScenario.storeMapScale);
		this.position.top = Math.round($("#beacon_div_"+this.id).position().top / demoScenario.storeMapScale);
		this.position.left = Math.round($("#beacon_div_"+this.id).position().left / demoScenario.storeMapScale);
		//console.log(this);
	});
	makeBeaconsHidden();
	window.localStorage.demoScenario = JSON.stringify(demoScenario);
	$("#editBeaconPosition").show();
	$("#saveBeaconPosition").hide();
}



function displayCustomerProfile(element) {
	var customerId = parseDivId("customer_div_", element.id);
	var customerIndex = findObjectById(demoScenario.customerList, customerId);
	console.log("Display Customer Profile for : " + element.id + " Index: " + customerIndex);
	$("#customerInfoDialog").dialog({'title': 'Profile of ' + demoScenario.customerList[customerIndex].label});
	$('#dialogCustomerName').html(demoScenario.customerList[customerIndex].label);
	$('#dialogCustomerAge').html(demoScenario.customerList[customerIndex].age);
	$('#dialogCustomerPhone').html(demoScenario.customerList[customerIndex].mobilenr);
	contactHistoryTab.clear().draw();

	readCustomerProfileFromRtdm(customerId);

	$("#customerInfoDialog").dialog('open');
}













function readCustomerProfileFromRtdm(customerId) {
	var rtdmRequestUrl = "http://" + demoScenario.rtdmHost + "/SASDecisionServices/rest/runtime/decisions/" + demoScenario.rtdmEvent;
	var contentType = 'application/vnd.sas.decision.request+json';
	//var rtdmRequestUrl = "http://" + rtdmHost + ( rtdmPort != undefined ? ":" + rtdmPort : '') + "/SASDecisionServices/rest/runtime/decisionDefinitions/" + rtdmEvent; 
	//var contentType = 'application/vnd.sas.decision.definition+json';
	var rtdmRequest = {"version" : "", "clientTimeZone" : "", "inputs":{}};
	rtdmRequest.clientTimeZone = "EST";
	rtdmRequest.version= 1;
	

	rtdmRequest.inputs.MemberID = customerId;
	console.log(JSON.stringify(rtdmRequest));

	$.ajax({
		method: "POST",
		contentType: contentType,
		url: rtdmRequestUrl,
		data: JSON.stringify(rtdmRequest)
	})
	.done(function( rtdmResponse ) {
		console.log(rtdmResponse);
		$('#dialogCustomerAvgTurnOver').html(rtdmResponse.outputs["AvgTurnover"]);
		$('#dialogCustomerSegment').html(rtdmResponse.outputs["Segment"]);
		$('#dialogCustomerVisitsLst4Weeks').html(rtdmResponse.outputs["VisitsLst4Weeks"]);
		$('#dialogCustomerLstOffer').html(rtdmResponse.outputs["LstOffer"]);
		
		var dataSet = rtdmResponse.outputs["ContactHistory"][1].data;
		$.each(dataSet, function(index) {
			/*var tabRowObj = {
		        "date":        dataSet[index][0],
		        "campaign":    dataSet[index][1],	
		        "segment":     dataSet[index][2],	
		        "offer":     	dataSet[index][3],
		       // "extInfo1":     dataSet[index][4],
		       // "extInfo2":      dataSet[index][5]
		    };

		    console.log(tabRowObj);
		    */

		    var entryDate = new Date(dataSet[index][0]);
		    var entryDateTxt = entryDate.getFullYear() + "-" + (entryDate.getMonth()+1) + "-" + entryDate.getDate() + " " + entryDate.getHours() + ":" + entryDate.getMinutes();
		    contactHistoryTab.row.add([entryDateTxt, dataSet[index][1], dataSet[index][2], dataSet[index][3], dataSet[index][4], dataSet[index][5]]);
		});

		
		contactHistoryTab.draw();
		//contactHistoryTab = $('#customerInfoDialogCHTab').DataTable(

	});
}


function windowsResize(event) {

	if(event.target === window) {
		console.log("resize window");
		refreshBeacons(demoScenario.beaconList);
	}
	else {
		console.log("resize " + event.type);
		event.stopPropagation();
	}
}


