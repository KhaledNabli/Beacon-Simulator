function loadDemo() {
	refreshCustomers();
	refreshBeacons();
	$("#saveBeaconPosition").hide();
}

function refreshCustomers() {

	// clear
	$("#customer-list").html("<h2>Customer Profile</h2>");

	$.each(customerList, function () {
		console.log("add customer: " + this.label)

		var customerDiv = $("<div class=\"row\"></div></div>");
		customerDiv.attr("id", this.id);
		customerDiv.css("background-color", this.color);
		customerDiv.addClass("draggableCustomer");

		var customerImgDiv = $("<div class=\"col-xs-4 avatarImgCol vcenter\"></div>");
		var avatarImg = this.img != "" ? this.img : "img/no_avatar.png" ;
		customerImgDiv.append("<img class=\"avatarImg\" src=\"" + avatarImg + "\" />");
		customerDiv.append(customerImgDiv);

		
		var customerProfileDiv = $("<div class=\"col-xs-8 vcenter\"></div>");
		customerProfileDiv.append("<h4>"+this.label+"</h4>");
		customerProfileDiv.append("Member: "+this.memberid+"<br>");
		customerProfileDiv.append("Age: "+this.age+"<br>");
		customerDiv.append(customerProfileDiv);

		$("#customer-list").append(customerDiv);
	});
	$( ".draggableCustomer" ).draggable();
}

function refreshBeacons() {
	$.each(beaconList, function () {
		console.log("add beacon: " + this.label);

		var beaconDiv = $("<div></div>");
		beaconDiv.attr("id", this.id);
		beaconDiv.css("position", "absolute");
		beaconDiv.css("top", this.position.top);
		beaconDiv.css("left", this.position.left);
		beaconDiv.css("width", this.size.width);
		beaconDiv.css("height", this.size.height);
		beaconDiv.css("background-color", this.color);
		beaconDiv.addClass("beaconPlace");
		beaconDiv.html("<h3>"+ this.label +"</h3>");
		$("#storeMapWrapper").append(beaconDiv);
	});

	$( ".beaconPlace" ).droppable({ tolerance: "intersect"});
	$( ".beaconPlace" ).on( "dropover", function( event, ui ) {
		console.log(ui.draggable.context.id + " dropped on " + this.id);			
		processBeaconEvent(this.id, ui.draggable.context.id)
	} );
}


function findObjectById(list, id) {
	for(i = 0; i < list.length; i++) {
		if(list[i].id === id) return i;
	}
	return -1;
}

function processBeaconEvent(beaconId, customerId) {
	var customerIndex = findObjectById(customerList, customerId);
	var beaconIndex = findObjectById(beaconList, beaconId);
	if(customerIndex < 0 || beaconIndex < 0)
		return;

	$("#infobox").html(customerList[customerIndex].label + " ist bei " + beaconList[beaconIndex].label + " angekommen");
		/*
		EventId*:int64,MemberId:int32,BeaconId:int32,PartnerId:int32,EventDttm:stamp
		*/
		var espEventDate = new Date();
		var espEventDttm = "" + espEventDate.getFullYear() + "-" + espEventDate.getMonth() + "-" + espEventDate.getDay() + " " + espEventDate.getHours() + ":" + espEventDate.getMinutes() + ":" + espEventDate.getSeconds();
		var espEventCsv = "i,n,,"+ (customerList[customerIndex].memberid) +","+ (beaconIndex+1) +",rewe,"+espEventDttm+","+beaconList[beaconIndex].label+"\r\n";
		publishEspEvent(espBeaconWindow, espEventCsv);
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
		$( ".beaconPlace" ).removeClass("editable");
		$( ".beaconPlace" ).draggable("destroy");
		$( ".beaconPlace" ).resizable("destroy");
	}


	function saveBeaconPosition(){
		$.each(beaconList, function () {
			//console.log("get position of beacon: " + this.label);
			this.size.width = $("#"+this.id).width();
			this.size.height = $("#"+this.id).height();
			this.position.top = $("#"+this.id).position().top;
			this.position.left = $("#"+this.id).position().left;
			//console.log(this);
		});
		makeBeaconsHidden();
		console.log("var beaconList = " + JSON.stringify(beaconList));
		$("#editBeaconPosition").show();
		$("#saveBeaconPosition").hide();
	}