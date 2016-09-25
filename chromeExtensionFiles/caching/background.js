var cachingUrl= "https://dl.dropboxusercontent.com/u/328684/caching/index2.html?noSound=true";

chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({'url': cachingUrl});
});

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

var lastCachingObj;
var fromDate = new Date(Date.now());
	fromDate.setHours(0);
	fromDate.setMinutes(0);
	fromDate.setSeconds(0);
	fromDate.setMilliseconds(0);

var toDate = new Date(Date.now());
	toDate.setHours(23);
	toDate.setMinutes(59);
	toDate.setSeconds(59);
	toDate.setMilliseconds(999);

var newDate;	

function cloneObj(obj){
	return JSON.parse(JSON.stringify(obj))
}


function getPayments(){

    paymentsXHR = (window['paymentsXHR']!=null) ? window['paymentsXHR'] : new XMLHttpRequest();
    var xmlhttp = paymentsXHR;
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        	//Respondio bien, actualizo las fechas para el proximo request.
        	var isNewDay = fromDate.getDay() < newDate.getDay();
		    fromDate = newDate;

		    if(isNewDay) {
		    	lastCachingObj=null;
		    	lastMoney=null;
		        toDate = new Date(Date.now());
		        toDate.setHours(23);
		        toDate.setMinutes(59);
		        toDate.setSeconds(59);
		        toDate.setMilliseconds(999);
		    }

            var originalResponse = JSON.parse(xmlhttp.responseText);

            response = cloneObj(originalResponse);
            if(lastCachingObj) response = lastCachingObj.concat(response);

            var money = 0;
            var userTypes="";
            for(var item in response){
                if(response[item].userType=='developer') continue;
                money+=response[item].price;

                if(money > lastMoney && userTypes.indexOf(response[item].userType) <0)
                    userTypes += "\n"+response[item].userType;
            }

            if(lastMoney!=money && money!=0 && money>lastMoney){
                if(lastMoney!=null) ca_ching(money,money-lastMoney, userTypes);
            }

            lastMoney = money;
            lastCachingObj = response;
        }
    }
    
    //console.log('from: '+fromDate.toUTCString() + ' - to: '+toDate.toUTCString());

    xmlhttp.open("GET","http://mysterygamenode-journalsofunknown.azurewebsites.net/metrics/internal/request/?id=revenue&fromDate="+fromDate.toUTCString()+"&toDate="+toDate.toUTCString(),true);
    xmlhttp.send();

    newDate = new Date();
}

function nextupdate() {
	count--;
	if(count<0){
		count = updateFreq;
		getPayments();
	}
}

function initNotifications(){

	if(webkitNotifications.createHTMLNotification == undefined){
			 chrome.notifications.onClicked.addListener(function(){
		 	chrome.tabs.create({'url': cachingUrl}, function(e){});
		 });
	}
}

function ca_ching(total, amount, userTypes){

	total = Math.round(total/10*100)/100;
	amount = Math.round(amount/10*100)/100;

    var variation = amount<4 ? '2' : amount<9 ? '6' : amount < 29 ? '10' : amount < 59 ? '30' : amount < 99 ? '60':'100';

    var src = 'res/caching_'+variation+'.mp3';
	if(!audioCache[src]) {
		audioCache[src] = new Audio();
		audioCache[src].src = src;
	}
	if(localStorage["muted"] == null || localStorage["muted"]=="false")
	    audioCache[src].play();

    if(chrome && window.webkitNotifications)
        showNotification(total,amount, userTypes);

}

var count = 0;
var updateFreq = 45*1;
var audioCache = {};
var lastMoney = null;
var uniqueusers = 0;
setInterval(nextupdate,1000);
initNotifications();
var notID=0;

function showNotification(total,amount, userTypes){

	var options={
			type : "basic",
			message: "Hoy van $"+total + "\nUser Types:"+userTypes,
			title: "Pagaron $"+(amount) ,
			iconUrl: "res/money_bag-128.png"
		}

	if(webkitNotifications.createHTMLNotification == undefined)
		createNotification(options);
	else
		createNotificationLegacy(options);
	
}

function createNotificationLegacy(options){

var notification = window.webkitNotifications.createNotification(
	options.iconUrl,
	options.message, 
	options.title
	);
	
	notification.onclick =function(){
		chrome.tabs.create({'url': cachingUrl}, function(e){});
		notification.close();
	};
	notification.show();
    
    setTimeout(function(){notification.close();}, 2000);
}

function createNotification(options){

	var id= "id"+notID++;
	options.buttons = [];
	options.buttons.push({ title: 'Options' });
	chrome.notifications.create(id, options, function(){});


	setTimeout(function(){
		chrome.notifications.clear(id, function(){});
	}, 2000);
}

chrome.notifications.onButtonClicked.addListener(function(id, buttonId){
	chrome.tabs.create({'url': 'options.html'});
});