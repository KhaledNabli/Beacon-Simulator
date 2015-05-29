var espBeaconWindow = "http://sasbap.demo.sas.com:44444/inject/PaybackPoc/PaybackUseCases/BeaconEventSource?blocksize=1";
var espProfileWindow = "";


var storeList = [{id:"rewe", label:"Rewe Store", img:"img/storemap.png"}];

var customerList = [
	{id:"customer1", memberid: 21, label: "Philipp", age: 29, mobile: "", color: "aquamarine", img: "img/lahm.jpg",}, 
	{id:"customer2", memberid: 17, label: "Jerome", age: 41, mobile: "", color: "aliceblue", img: "img/boateng.jpg"}, 
	{id:"customer3", memberid: 8, label: "Javi", age: 37, mobile: "", color: "blanchedalmond", img: "img/javi.jpg"},
	{id:"customer4", memberid: 27, label: "David", age: 32, mobile: "", color: "honeydew", img: "img/alaba.jpg"},
	{id:"customer5", memberid: 7, label: "Franc", age: 27, mobile: "", color: "seashell", img: "img/frank.jpg"},
];


var beaconList = [
	{id:"beacon1", label: "Seafood", 		position:{top: 280, left: 560}, size:{height: 140, width: 140}, color:"red", store:"rewe"}, 
	{id:"beacon2", label: "Pasta Meals", 	position:{top: 100, left: 60}, size:{height: 160, width: 280}, color:"darkgreen", store:"rewe"}, 
	{id:"beacon3", label: "Deli", 			position:{top: 40, left: 400}, size:{height: 180, width: 200}, color:"blue", store:"rewe"},
	{id:"beacon4", label: "Rotisserie Chicken", position:{top: 310, left: 30}, size:{height: 210, width: 225}, color:"maroon", store:"rewe"},
	{id:"beacon5", label: "Salad Bar", 		position:{top: 450, left: 740}, size:{height: 225, width: 250}, color:"orange", store:"rewe"},
	{id:"beacon6", label: "Meat and Poletery", position:{top: 25, left: 600}, size:{height: 225, width: 250}, color:"darkorange", store:"rewe"},
	{id:"beacon7", label: "Gourmet Cheeses",position:{top: 70, left: 920}, size:{height: 225, width: 250}, color:"darkblue", store:"rewe"},
	{id:"beacon8", label: "Breads", 		position:{top: 290, left: 1220}, size:{height: 225, width: 250}, color:"brown", store:"rewe"},
];