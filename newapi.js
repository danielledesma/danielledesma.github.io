var cache = window.applicationCache;
if(document.getElementsByTagName('html')[0].manifest && cache && window.location.href.split(':')[0] != 'file') {
    cache.addEventListener('updateready', appmanifestupdated, false);
    cache.addEventListener('noupdate', startCaching, false);
    cache.addEventListener('cached', startCaching, false);
    cache.addEventListener('obsolete', startCaching, false);
    cache.addEventListener('downloading', downloading, false);
}
else {
    startCaching();
}

var serverData = {
    'jou':{
        name:"jou",
        counters:{
            fb:"mysterygame-counters-prod.azurewebsites.net",
            ios:"mysterygame-counters-ios.azurewebsites.net",
            android:"mysterygame-counters-android.azurewebsites.net"
        },
        platform:"fb",
        node:["mysterygamenode-journalsofunknown.azurewebsites.net","mysterygamenode02-journalsofunknown.azurewebsites.net","mysterygamenode03-journalsofunknown.azurewebsites.net"],
        dollarConversion:0.1,
        gifs:["401.gif","402.gif","403.gif","404.gif","405.gif","406.gif","407.gif","408.gif","409.gif","410.gif","411.gif","412.gif"]
    },
    'sherlock':{
        name:"sherlock",
        platform:"fb",
        counters:{
            fb:"mysterygame-counters-sherlock.azurewebsites.net",
            ios:"mysterygame-counters-sherlock-ios.azurewebsites.net",
            iphone:"mysterygame-counters-sherlock-iphone.azurewebsites.net"
        },
        node:["mysterygame-sherlock-prod.azurewebsites.net"],
        dollarConversion:0.1,
        gifs:["401.gif","402.gif","403.gif","404.gif","405.gif","406.gif","407.gif","408.gif","409.gif","410.gif","411.gif","412.gif"]
    },
    'jou mobage':{
        name:"jou mobage",
        platform:"mobage",
        counters:{fb:"mysterygame-counters-mobage.azurewebsites.net"},
        node:["mysterygamenode-mobage-prod.azurewebsites.net"],
        dollarConversion:0.01,
        gifs:["japon0.gif", "japon1.gif", "japon2.gif", "japon3.gif"]
    },    
    'jou vk':{
        name:"jou vk",
        platform:"vk",
        counters:{fb:"mysterygame-counters-vk.azurewebsites.net"},
        node:["mysterygame-node-rusiavk.azurewebsites.net"],
        dollarConversion:(1/60),
        gifs:["rusia1.gif","rusia2.gif","rusia3.gif","rusia_4.gif","rusia1.gif"]
    },    
    'jou ok':{
        name:"jou vk",
        platform:"vk",
        counters:{fb:"mysterygame-counters-ok.azurewebsites.net"},
        node:["mysterygame-node-rusiaok.azurewebsites.net","mysterygame-node-rusiaok2.azurewebsites.net"],
        dollarConversion:(1/60),
        gifs:["rusia1.gif","rusia2.gif","rusia3.gif","rusia_4.gif","rusia1.gif"]
    }
}

function getProduct(){
    var productName = getQueryVariable('app') || 'jou';
    return serverData[productName.toLowerCase()];
}

function toDollars(value){
    var coef = getProduct().dollarConversion;
    return Math.round(value*coef*100)/100;
}

function getCountersUrl(){
    return getProduct().counters.fb;
}
function getCountersUrliOS(){
    return getProduct().counters.ios;
}
function getCountersUrliPhone(){
    return getProduct().counters.iphone;
}
function getCountersUrlAndroid(){
    return getProduct().counters.android;
}


function getNodeUrls(){
    return getProduct().node;
}



function appmanifestupdated() {
    document.location.reload(true);
}

function downloading() {
    document.getElementById('actualizando').style.display = '';
}

function startCaching() {
    document.getElementById('actualizando').style.display = 'none';
    nextupdate();
    setInterval(nextupdate, 1000)
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for(var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if(decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj))
}
function setApp(app) {
    var qs = '?';
    if(getQueryVariable('fromDate')) qs += "&fromDate="+getQueryVariable('fromDate');
    if(getQueryVariable('toDate')) qs += "&toDate="+getQueryVariable('toDate');
    qs += "&app="+app;
    window.location.href = window.location.href.split('?')[0] + qs;
}

function setDatesYesterday() {

    var fd = document.getElementById('fDate');
    var td = document.getElementById('tDate');
    var yest = Date.now()-24*60*60*1000
    yest = new Date(yest);
    var month = yest.getMonth()+1;

    if(month <10)
        month = "0"+month;

    var day = yest.getDate();
    if(day <10)
        day = "0"+day;

    yest = yest.getFullYear()+"-"+month+"-"+day;
    fd.value = yest;
    td.value = yest;

    setDates();
}

function setDatesToday() {
      var fd = document.getElementById('fDate');
    var td = document.getElementById('tDate');  
    fd.value = null;
    td.value = null;

    setDates();
}

function setDates() {
    var fd = document.getElementById('fDate');
    var td = document.getElementById('tDate');

    var qs = '?';
    if(getQueryVariable('noSound')) qs += "noSound=true";
    if(getQueryVariable('app')) qs += "app="+getQueryVariable('app');
    if(fd.value != null && fd.value != "") qs += "&fromDate=" + fd.value;
    if(td.value != null && td.value != "") qs += "&toDate=" + td.value;

    window.location.href = window.location.href.split('?')[0] + qs;
}

var lastCachingObj = null;

function showLoader() {
    document.getElementById('money').style.opacity = 0.3;
}

function hideLoader() {
    document.getElementById('money').style.opacity = 1;
}

var protocol = window.location.href.split(':')[0];
if(protocol == 'file') protocol = 'http';

function getPayments() {


    var urls = getNodeUrls();



    var fromDate = window['lastFromDate'] ? window['lastFromDate'] : new Date(getQueryVariable('fromDate') != null ? getQueryVariable('fromDate') : Date.now());

    var toDate = new Date(getQueryVariable('toDate') != null ? getQueryVariable('toDate') : Date.now());
    if(getQueryVariable('toDate') != null) {
        if(getQueryVariable('toDate').indexOf('-') > -1) toDate = new Date(toDate.getTime() + toDate.getTimezoneOffset() * 60 * 1000)
    }
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    toDate.setMilliseconds(999);

    if(!window['lastFromDate']) {
        if(getQueryVariable('fromDate') != null) {
            if(getQueryVariable('fromDate').indexOf('-') > -1) fromDate = new Date(fromDate.getTime() + fromDate.getTimezoneOffset() * 60 * 1000)
        }

        fromDate.setHours(0);
        fromDate.setMinutes(0);
        fromDate.setSeconds(0);
        fromDate.setMilliseconds(0);

        document.getElementById('fDate').value = new Date(fromDate.getTime() - 1000 * 60 * 60 * 3).toISOString().split('T')[0]
        document.getElementById('tDate').value = new Date(toDate.getTime() - 1000 * 60 * 60 * 3).toISOString().split('T')[0]
    }

    window['lastSendDate'] = new Date();

    var onReady = function() {
        var allXhrDone = true;
        for(var i=0;i<xhrs.length;i++){
            allXhrDone = allXhrDone && xhrs[i].readyState == 4 && xhrs[i].status == 200; 
        }

        if(allXhrDone) {
            var response = [];
            for(var i=0;i<xhrs.length;i++){
                response = response.concat(JSON.parse(xhrs[i].responseText).reverse());
            }

            updateCaching(response);
        }
    };

    var xhrs = [];
    for(var i=0;i<urls.length;i++){
        var xhr = new XMLHttpRequest();
        xhrs.push(xhr);
        xhr.onreadystatechange = onReady;
        xhr.open("GET", protocol + "://"+urls[i]+"/metrics/internal/request/?id=revenue&fromDate=" + fromDate.toUTCString() + "&toDate=" + toDate.toUTCString(), true);
    }

    for(var i=0;i<xhrs.length;i++){
        xhrs[i].send();
    }
}

function filterPayments(type){
    var lastCachings = document.getElementById('lastCachingsTable');
    if(lastCachings) {
        var rows = lastCachings.childNodes[0].childNodes;
        for(var i=0;i<rows.length;i++) {
            var row = rows[i];
            if((type == 'fb' && (row.className.indexOf('fb') >=0 || row.className.indexOf('trialPay') >=0 )) || row.className.indexOf(type) >=0  || type == 'all'){
                row.style.display = '';
            }
            else {
                row.style.display = 'none';
            } 
        }
    }
}

function updateCaching(originalResponse) {

        var response = cloneObj(originalResponse);

        if(lastCachingObj) response = response.concat(lastCachingObj);

        var money = 0;
        var moneyObj = {};
        var categoryObj = {};
        var transactions = 0;
        var utype = [];
        var activeCases = [];
        var stateTypes = [];
        var topPayers = [];
        var abgroups = {};

       
        var found;
        for(var item in response) {
            if(response[item].userType == 'developer') continue;
            transactions++;

            money += response[item].price;
       
            if(moneyObj[response[item].source] == null)
                moneyObj[response[item].source]=0;
            
            moneyObj[response[item].source] += response[item].price;

            if(categoryObj[response[item].category] == null)
                categoryObj[response[item].category]=0;
            
            categoryObj[response[item].category] += response[item].price;

            if(!abgroups[response[item].abGroup])
                {
                    abgroups[response[item].abGroup] = {money: 0, group: response[item].abGroup, payers: []};
                }

            abgroups[response[item].abGroup].money += response[item].price;
             if(abgroups[response[item].abGroup].payers.indexOf(response[item].userId) == -1) abgroups[response[item].abGroup].payers.push(response[item].userId);


          
            //console.log(response[item].activeCase)
            if(response[item].activeCase){
            	
            	var activeCaseIndex=undefined;
            	for(var i = 0; i < activeCases.length; i++) {
            		if(activeCases[i].activeCase==response[item].activeCase) {activeCaseIndex=i;}
            	}
            	if(activeCaseIndex===undefined) activeCaseIndex = activeCases.push({money:0,activeCase:response[item].activeCase})-1;
            	//console.log(toDollars(response[item].price))
            	activeCases[activeCaseIndex].money += response[item].price;
            }
            
            
           

            found = false;
            for(var i = 0; i < utype.length; i++) {
                if(utype[i].userType == response[item].userType) {
                    found = true;
                    utype[i].money += response[item].price;
                    if(utype[i].payers.indexOf(response[item].userId) == -1) utype[i].payers.push(response[item].userId)
                }
            }
            if(!found) utype.push({userType: response[item].userType, money: response[item].price, payers: [response[item].userId]})

            //StateTypes
            if(response[item].usersnapshot)
            {
                var stype = response[item].usersnapshot.stateInfo.stateType;

                if(stype == "hog" && response[item].usersnapshot.stateInfo.chapterNumber != undefined) stype = "hog adventure";

                found = false;
                for(var i = 0; i < stateTypes.length; i++) {

                    if(stateTypes[i].stateType == stype) {
                        found = true;
                        stateTypes[i].money += response[item].price;
                        break;
                    }
                }
                if(!found) stateTypes.push({stateType: stype, money: response[item].price})
            }
        
            //Top Payers
            found = false;
            for(var i = 0; i < topPayers.length; i++) {
                if(topPayers[i].userId == response[item].userId) {
                    found = true;
                    topPayers[i].money += response[item].price
                }
            }
            if(!found) topPayers.push({userId: response[item].userId, userType: response[item].userType, money: response[item].price})
        }

        money = toDollars(money);
        if(lastMoney != money && money != 0 && money > lastMoney) {
            if(lastMoney != null && !mobilecheck())
                ca_ching(money - lastMoney);

            window['lastFromDate'] = window['lastSendDate'];
        }

        lastMoney = money;

        document.getElementById('money').innerHTML = '$' + lastMoney;
        var moneyDetail = document.getElementById('moneyDetail');
        moneyDetail.innerHTML = "";
        for(var source in moneyObj) {
            moneyDetail.innerHTML +='<span>'+source+': </span><span style="color:blue">$'+toDollars(moneyObj[source])+'</span>&nbsp;';            
        }

        var categoryDetail = document.getElementById('categoryDetail');
        categoryDetail.innerHTML = "";
        for(var category in categoryObj) {
            categoryDetail.innerHTML +='<span>'+category+': </span><span style="color:blue">$'+toDollars(categoryObj[category])+'</span>&nbsp;';            
        }

        //document.getElementById('transactions').innerHTML = '<b>Transactions:</b> ' + transactions;

        /***********************************
         Grabo por ActiveCase
         ************************************/
        activeCases.sort(function(a, b) {
            if(a.money > b.money) return -1;
            return 1;
        })
        document.getElementById('bygroup').innerHTML = '';
        for(var i = 0; i < activeCases.length; i++) {
            document.getElementById('bygroup').innerHTML += '<b>$' + toDollars(activeCases[i].money) + '</b> ' + activeCases[i].activeCase + '<span class="details"> '+Math.round(toDollars(activeCases[i].money)/money*10000)/100+'%</span><br>';
        }

         /***********************************
         Grabo por ABGROUP
         ************************************/
         var abgroupsArr = [];
         for(var g in abgroups){
            abgroupsArr.push(abgroups[g]);
         }

        abgroupsArr.sort(function(a, b) {
            if(a.money > b.money) return -1;
            return 1;
        })
        document.getElementById('byabgroup').innerHTML = '';
        for(var i = 0; i < abgroupsArr.length; i++) {
            document.getElementById('byabgroup').innerHTML += '<b>$' + toDollars(abgroupsArr[i].money) + '</b> ' + abgroupsArr[i].group + '<span class="details">' + ' <b>Payers:</b> ' + abgroupsArr[i].payers.length + ' <b>ARPPU:</b> $' + Math.round(toDollars(abgroupsArr[i].money) / abgroupsArr[i].payers.length * 100) / 100 + '</span><br>';
        }


        /***********************************
         ORDENO Y AGRUPO USERTYPES
         ************************************/
        document.getElementById('bytype').innerHTML = '';
        var groupedUtypes = [];

        for(var i = 0; i < utype.length; i++) {

            var entry = utype[i];
            var entryOriginalUserType = (entry.userType.indexOf('@') > -1) ? entry.userType.split('@')[1] : entry.userType;

            for(var j = 0; j < groupedUtypes.length; j++) {
                if(groupedUtypes[j].userType == entryOriginalUserType) {
                    groupedUtypes[j].money += utype[i].money;
                    groupedUtypes[j].groups.push(utype[i]);
                    groupedUtypes[j].numPayers += utype[i].payers.length;
                    break;
                }
                if(j == groupedUtypes.length - 1) {
                    groupedUtypes.push({userType: entryOriginalUserType, groups: [utype[i]], money: utype[i].money, numPayers: utype[i].payers.length});
                    break;
                }
            }

            if(groupedUtypes.length == 0) groupedUtypes.push({userType: entryOriginalUserType, groups: [utype[i]], money: utype[i].money, numPayers: utype[i].payers.length});
        }

        groupedUtypes.sort(function(a, b) {
            if(a.money > b.money) return -1;
            return 1;
        })

        for(var i = 0; i < groupedUtypes.length; i++) {
            document.getElementById('bytype').innerHTML += '<b>$' + toDollars(groupedUtypes[i].money) + '</b> ' + groupedUtypes[i].userType + '<span class="details">' + ' <b>Payers:</b> ' + groupedUtypes[i].numPayers + ' <b>ARPPU:</b> $' + Math.round(toDollars(groupedUtypes[i].money) / groupedUtypes[i].numPayers * 100) / 100 + '</span><br>';
            for(var j = 0; j < groupedUtypes[i].groups.length; j++) {
                document.getElementById('bytype').innerHTML += '<div id="subgroup"><b>$' + toDollars(groupedUtypes[i].groups[j].money) + '</b> ' + groupedUtypes[i].groups[j].userType + '<br></div>';

            }
        }

        /***********************************
         ORDENO Y AGRUPO LUGARES DE PAGO
         ************************************/
        document.getElementById('bymoment').innerHTML = '';

        stateTypes.sort(function(a, b) {
            if(a.money > b.money) return -1;
            return 1;
        })

        for(var i = 0; i < stateTypes.length; i++) {
            document.getElementById('bymoment').innerHTML += '<b>$' + toDollars(stateTypes[i].money) + '</b> ' + stateTypes[i].stateType.toUpperCase() + '<br>';
        }

        /*********************************
         MUESTRO ULTIMOs CACHINGS Y TOP 10 Payers
         **********************************/

        topPayers.sort(function(a, b) {
            if(a.money > b.money) return -1;
            return 1;
        })

        var lasts = '<table id="lastCachingsTable">';
        for(var item in originalResponse) {
            if(originalResponse[item].userType == 'developer') continue;
            var newclass = originalResponse[item].source;
            newclass += (originalResponse[item].usersnapshot && originalResponse[item].usersnapshot.userDiamondsBoughtTimes != undefined && originalResponse[item].usersnapshot.userDiamondsBoughtTimes == 0) ? ' newPayer' : '';
            newclass += ' '+originalResponse[item].category; 


            lasts += '<tr class="' + newclass + '" onmouseover=\'setUserInfo("' + originalResponse[item].userId + '\","' + originalResponse[item].userType + '",' + JSON.stringify(originalResponse[item].usersnapshot) + ',this)\'><td><div class="userinfo"><div class="panel"></div></div>' + originalResponse[item].userType + '</td><td><a href="' + protocol + '://facebook.com/' + originalResponse[item].userId + '" target="_blank">' + originalResponse[item].userId + '</a></td><td>' + '<b>$' + toDollars(originalResponse[item].price) + '</b></td><td style="width: 12px;background:url(\'res/'+originalResponse[item].source+'.png\') no-repeat;"></td></tr>';
        }
        if(lasts != '<table id="lastCachingsTable">') {

            var topp = ""
            if(topPayers.length > 0)
                topp += '<h4>Top Payers:</h4><table>'

            for(var i = 0; i < 10; i++) {
                if(topPayers[i])
                    topp += '<tr class="         " onmouseover=\'setUserInfo("' + topPayers[i].userId + '\","' + topPayers[i].userType + '",null,this)\'><td><div class="userinfo"><div class="panel"></div></div>' + topPayers[i].userType + '</td><td><a href="' + protocol + '://facebook.com/' + topPayers[i].userId + '" target="_blank">' + topPayers[i].userId + '</a></td><td>' + '<b>$' + toDollars(topPayers[i].money) + '</b></td></tr>'
            }

            document.getElementById('lastcaching').innerHTML = topp + '</table><h4>Last Ca-chings:&nbsp;</h4>' + lasts + '</table>';

        }

        lastCachingObj = response;
        hideLoader();
        docHeight = getDocHeight();
        refreshing = false;
}

function onRadioClick() {

    document.getElementById('infoall').style.display = 'none';
    document.getElementById('infofb').style.display = 'none';
    document.getElementById('infoiOS').style.display = 'none';
    document.getElementById('infoiPhone').style.display = 'none';
    document.getElementById('infoAndroid').style.display = 'none';

    if(document.getElementById('radioAll').checked){
        document.getElementById('infoall').style.display = '';
        filterPayments('all'); 
    }

    if(document.getElementById('radiofb').checked){
        document.getElementById('infofb').style.display = ''; 
        filterPayments('fb'); 
    }

    if(document.getElementById('radioiOS').checked){
        document.getElementById('infoiOS').style.display = '';
        filterPayments('iOS');   
    }

    if(document.getElementById('radioiPhone').checked){
        document.getElementById('infoiPhone').style.display = '';
        filterPayments('radioiPhone');   
    }

    if(document.getElementById('radioAndroid').checked){
        document.getElementById('infoAndroid').style.display = '';
        filterPayments('Android');   
    }

}



var lastUpdate = Date.now();
function getUniqueUsers() {

    var uniqueXHR = (window['uniqueXHR'] != null) ? window['uniqueXHR'] : new XMLHttpRequest();
    var uniqueiOSXHR = (window['uniqueiOSXHR'] != null) ? window['uniqueiOSXHR'] : new XMLHttpRequest();
    var uniqueiPhoneXHR = (window['uniqueiPhoneXHR'] != null) ? window['uniqueiPhoneXHR'] : new XMLHttpRequest();
    var uniqueAndroidXHR = (window['uniqueAndroidXHR'] != null) ? window['uniqueAndroidXHR'] : new XMLHttpRequest();

    var onReady = function(){
        if(uniqueXHR.readyState == 4 && uniqueXHR.status == 200 && uniqueiOSXHR.readyState == 4 && uniqueiOSXHR.status == 200 && uniqueAndroidXHR.readyState == 4 && uniqueAndroidXHR.status == 200 && uniqueiPhoneXHR.readyState == 4 && uniqueiPhoneXHR.status == 200) {

            lastUpdate = Date.now();
            var responseFb = initResponse(JSON.parse(uniqueXHR.responseText)[0]);
            var responseiOS = initResponse(JSON.parse(uniqueiOSXHR.responseText)[0]);
            var responseiPhone = initResponse(JSON.parse(uniqueiPhoneXHR.responseText)[0]);
            var responseAndroid = initResponse(JSON.parse(uniqueAndroidXHR.responseText)[0]);
            var responseAll = initResponse(JSON.parse(uniqueXHR.responseText)[0]);

            function initResponse(response){
                if(!response)
                    response = {};
                if(!response.Payers)
                    response.Payers = 0;
                if(!response.Revenue)
                    response.Revenue = 0;
                if(!response.Transactions)
                    response.Transactions = 0;
                if(!response.DAUS)
                    response.DAUS = 0;
                if(!response.MAUS)
                    response.MAUS = 0;
                if(!response.viralNewUsers)
                    response.viralNewUsers=0;
                if(!response.newUsers)
                    response.newUsers=0;
                if(!response.adsRevenue)
                    response.adsRevenue={};

                response.adsRevenueInfo = {};
                for(var ad in response.adsRevenue){
                    var provider = ad.split("_")[0];
                    if(!response.adsRevenueInfo[provider])
                    {
                        response.adsRevenueInfo[provider]={count:0,amount:0};
                    }
                    response.adsRevenueInfo[provider].count +=response.adsRevenue[ad].count;
                    response.adsRevenueInfo[provider].amount +=response.adsRevenue[ad].amount;
                }

                return response;
            }
            for(var key in responseiOS){
                if(!responseiOS[key])
                    responseiOS[key]=0;
            }

            for(var key in responseAndroid){
                if(!responseAndroid[key])
                    responseAndroid[key]=0;
            }

            for(var key in responseAll){

                if(key == "adsRevenueInfo"){

                    for(var ad in responseiOS.adsRevenueInfo){
                      
                        if(!responseAll.adsRevenueInfo[ad])
                        {
                            responseAll.adsRevenueInfo[ad]={count:0,amount:0};
                        }
                        responseAll.adsRevenueInfo[provider].count +=responseiOS.adsRevenue[ad].count;
                        responseAll.adsRevenueInfo[provider].amount +=responseiOS.adsRevenue[ad].amount;
                    }

                    for(var ad in responseiPhone.adsRevenueInfo){
                      
                        if(!responseAll.adsRevenueInfo[ad])
                        {
                            responseAll.adsRevenueInfo[ad]={count:0,amount:0};
                        }
                        responseAll.adsRevenueInfo[provider].count +=responseiPhone.adsRevenue[ad].count;
                        responseAll.adsRevenueInfo[provider].amount +=responseiPhone.adsRevenue[ad].amount;
                    }

                     for(var ad in responseAndroid.adsRevenueInfo){
                      
                        if(!responseAll.adsRevenueInfo[ad])
                        {
                            responseAll.adsRevenueInfo[ad]={count:0,amount:0};
                        }
                        responseAll.adsRevenueInfo[provider].count +=responseAndroid.adsRevenue[ad].count;
                        responseAll.adsRevenueInfo[provider].amount +=responseAndroid.adsRevenue[ad].amount;
                    }

                } else {
                    if(!responseAll[key])
                        responseAll[key]=0;
                    responseAll[key]+=responseiOS[key];
                    responseAll[key]+=responseiPhone[key];
                    responseAll[key]+=responseAndroid[key];
                }
            }

            updateInfo(responseAll, "all");
            updateInfo(responseFb, "fb");
            updateInfo(responseiOS, "ios");
            updateInfo(responseiPhone, "iphone");
            updateInfo(responseAndroid, "android");
            var refund = (responseFb.Refund || 0) + (responseiOS.Refund || 0) + (responseiPhone.Refund || 0) + (responseAndroid.Refund || 0);

            document.getElementById('refund').innerHTML = (refund) ? ('<b>Refund:</b> $' + toDollars(refund)) : '';            
        }
    };


    uniqueXHR.onreadystatechange = onReady;
    uniqueiOSXHR.onreadystatechange = onReady;
    uniqueAndroidXHR.onreadystatechange = onReady;

    var fromDate = new Date(getQueryVariable('fromDate') != null ? getQueryVariable('fromDate') : Date.now());
    if(getQueryVariable('fromDate') != null) {
        if(getQueryVariable('fromDate').indexOf('-') > -1) fromDate = new Date(fromDate.getTime() + fromDate.getTimezoneOffset() * 60 * 1000)
    }
    //fromDate =  new Date(fromDate.getTime()+(new Date()).getTimezoneOffset());
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    var toDate = new Date(getQueryVariable('toDate') != null ? getQueryVariable('toDate') : Date.now());
    if(getQueryVariable('toDate') != null) {
        if(getQueryVariable('toDate').indexOf('-') > -1) toDate = new Date(toDate.getTime() + toDate.getTimezoneOffset() * 60 * 1000)
    }
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    toDate.setMilliseconds(999);
    //toDate =  new Date(toDate.getTime()+(new Date()).getTimezoneOffset());

    uniqueXHR.open("GET", protocol + "://"+getCountersUrl()+"/getCounters/General/Dialy/?fromDate=" + fromDate.toUTCString() + "&toDate=" + toDate.toUTCString(), true);
    uniqueXHR.send();
    if(getCountersUrliOS())
    {
        uniqueiOSXHR.open("GET", protocol + "://"+getCountersUrliOS()+"/getCounters/General/Dialy/?fromDate=" + fromDate.toUTCString() + "&toDate=" + toDate.toUTCString(), true);
        uniqueiOSXHR.send();
    } else {
        uniqueiOSXHR = {};
        uniqueiOSXHR.readyState = 4;
        uniqueiOSXHR.status = 200;
        uniqueiOSXHR.responseText="[{}]";
    }

    if(getCountersUrliPhone())
    {
        uniqueiPhoneXHR.open("GET", protocol + "://"+getCountersUrliPhone()+"/getCounters/General/Dialy/?fromDate=" + fromDate.toUTCString() + "&toDate=" + toDate.toUTCString(), true);
        uniqueiPhoneXHR.send();
    } else {
        uniqueiPhoneXHR = {};
        uniqueiPhoneXHR.readyState = 4;
        uniqueiPhoneXHR.status = 200;
        uniqueiPhoneXHR.responseText="[{}]";
    }

    if(getCountersUrlAndroid())
    {
        uniqueAndroidXHR.open("GET", protocol + "://"+getCountersUrlAndroid()+"/getCounters/General/Dialy/?fromDate=" + fromDate.toUTCString() + "&toDate=" + toDate.toUTCString(), true);
        uniqueAndroidXHR.send();
    } else {
        uniqueAndroidXHR = {};
        uniqueAndroidXHR.readyState = 4;
        uniqueAndroidXHR.status = 200;
        uniqueAndroidXHR.responseText="[{}]";
    }
}

function updateInfo(info, type) {

    document.getElementById('dau_'+type).innerHTML = '<b>DAU:</b> ' + info.DAUS;
    document.getElementById('newUsers_'+type).innerHTML = '<b>Total New Users:</b> ' + (info.newUsers + info.viralNewUsers);
    document.getElementById('viralNewUsers_'+type).innerHTML = '<b>Viral New Users:</b> ' + info.viralNewUsers + ' - <span>' + Math.round(((info.DAUS)?(info.viralNewUsers / info.DAUS):0) * 10000) / 100 + '%</span>';
    document.getElementById('payers_'+type).innerHTML = '<b>Payers:</b> ' + info.Payers + ' - <span>' + Math.round(((info.DAUS)?(info.Payers / info.DAUS):0) * 10000) / 100 + '%</span>';
    document.getElementById('arppu_'+type).innerHTML = '<b>ARPPU:</b> $' + ((info.Payers) ? (Math.round(toDollars(info.Revenue) / info.Payers * 100) / 100) : 0);
    document.getElementById('arpdau_'+type).innerHTML = '<b>ARPADAU:</b> $' + Math.round(((info.DAUS)?(toDollars(info.Revenue) / info.DAUS):0) * 1000) / 1000;
    document.getElementById('money_'+type).innerHTML = '<b>Revenue:</b>$' + toDollars(info.Revenue);
    document.getElementById('transactions_'+type).innerHTML = '<b>Transactions:</b> ' + info.Transactions;

    var infoStr = "";
    var total = 0;
        for(var ad in info.adsRevenueInfo){
        total+=info.adsRevenueInfo[ad].amount
    }
    total = toDollars(total*10);

    var prefix = ""
    for(var ad in info.adsRevenueInfo){
        infoStr+= prefix+ad+": $"+toDollars(info.adsRevenueInfo[ad].amount*10)+" ("+info.adsRevenueInfo[ad].count+")";
        prefix = " - ";
    }


    document.getElementById('adRevenue_'+type).innerHTML = '<b>Ad Revenue:</b> $' + total +" {" +infoStr+"}";
}

var lastUpdate;
function nextupdate() {
    count--;
    if(count < 0) {
        //Para forzar el refresco si el node no responde y hacer otro request.
        refreshing = false;
        refresh();
    }

    if(lastUpdate)
        document.getElementById('lastupdate').innerHTML = 'Last Update: ' + getDateString(Date.now() - lastUpdate) + ' ago.'

    document.getElementById('nextupdate').innerHTML = 'Next Update in: ' + count;
}

function getDateString(time) {

    var seconds = Math.floor(time / 1000) % 60;
    var minutes = Math.floor(time / 1000 / 60) % 60;
    var hours = Math.floor(time / 1000 / 60 / 60) % 24;
    var days = Math.floor(time / 1000 / 60 / 60 / 24);
    var daysStr = days < 10 ? "0" + days : days;
    var hoursStr = hours < 10 ? "0" + hours : hours;
    var minutesStr = minutes < 10 ? "0" + minutes : minutes;
    var secondsStr = seconds < 10 ? "0" + seconds : seconds;

    var str = "<b>" + secondsStr + "</b>" + "s"
    if(minutes > 0)
        str = "<b>" + minutesStr + "</b>" + "m " + str;
    if(hours > 0)
        str = "<b>" + hoursStr + "</b>" + "hs " + str;
    if(days > 0)
        str = "<b>" + daysStr + "</b>" + ((days != 1) ? " days " : " day ") + str;

    return str;
}

function refresh() {
    if(!refreshing) {
        showLoader();
        refreshing = true;
        count = updateFreq;
        getUniqueUsers();
        getPayments();
    }
}

function mobilecheck() {
    var check = false;
    (function(a) {
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

var audioCache = {};
function ca_ching(amount, isNewPayer) {

    //Si fue abierta por la extension de chrome, no reproduzco el sonido porque ya lo hace la extension en background
    if(!getQueryVariable('noSound')) {
        var variation = amount < 4 ? '2' : amount < 9 ? '6' : amount < 29 ? '10' : amount < 59 ? '30' : amount < 99 ? '60' : '100';

        var src = 'caching_' + variation + '.mp3';
        if(!audioCache[src]) {
            audioCache[src] = new Audio();
            audioCache[src].src = src;
        }
        audioCache[src].play();
    }
    var imgNr = Math.floor(Math.random() * (getProduct().gifs.length));
    
    var danceImg = 'res/' + getProduct().gifs[imgNr];
    document.getElementById('celeb').innerHTML = '<img src="' + danceImg + '">';
    setTimeout(function() {
        document.getElementById('celeb').innerHTML = '';
    }, 15 * 1000);
}

function getTopOffset(element) {

    var elementAux = element;
    var offset = 0;
    do
    {
        offset += elementAux.offsetTop;
        elementAux = elementAux.offsetParent;
    }
    while(elementAux != null)

    return offset;
}

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

var userInfoCache = {};
function setUserInfo(userId, usertype, snapshot, trelement) {
    if(userInfoCache[userId]) {
        var txt = "";
        txt += "<img src='" + userInfoCache[userId].picture.data.url + "'>"
        txt += '<div class="uid">' + userInfoCache[userId].id + '</div>';
        txt += '<div class="uname">' + userInfoCache[userId].name + '</div>';
        txt += '<div class="utype">' + usertype + '</div>';

        if(snapshot) {
            txt += '<div id="uinfo">'

            txt += '<div><span>Session:</span> ' + ((snapshot.userSession != undefined) ? snapshot.userSession : '--') + '</div>';
            txt += '<div><span>Level:</span> ' + snapshot.userLevel + '</div>';
            txt += '<div><span>XP:</span> ' + snapshot.userXP + '</div>';
            txt += '<div><span>Coins:</span> ' + snapshot.userCoins + '</div>';
            txt += '<div><span>Diamonds:</span> ' + snapshot.userDiamonds + '</div>';
            txt += '<div><span>B. Times</span> ' + ((snapshot.userDiamondsBoughtTimes != undefined) ? snapshot.userDiamondsBoughtTimes : '--') + '</div>';

            txt += '</div>'

            txt += '<div id="ustateInfo">'

            txt += '<div>' + snapshot.stateInfo.stateType.toUpperCase() + ((snapshot.stateInfo.quickplay && !snapshot.stateInfo.chapterNumber) ? ' QUICK' : '') + '</div>';
            txt += '<div><span>' + ((snapshot.stateInfo.chapterNumber) ? 'Ep. ' + snapshot.stateInfo.chapterNumber + ' ' + snapshot.stateInfo.stateKey.split('.')[2] : snapshot.stateInfo.stateKey.split('.')[2] ) + '</span></div>';

            if(snapshot.stateInfo.chapterPlayedTimes != undefined) txt += '<div><span>Ch. played: </span> ' + snapshot.stateInfo.chapterPlayedTimes + '</div>';
            else if(snapshot.stateInfo.hogPlayedTimes != undefined) txt += '<div><span>Played #: </span> ' + snapshot.stateInfo.hogPlayedTimes + '</div>';
            if(snapshot.stateInfo.scene) txt += '<div>' + snapshot.stateInfo.scene.split("_")[1] + '</div>';
        }
        txt += '</div>'

        trelement.childNodes[0].childNodes[0].childNodes[0].innerHTML = txt;

        var txtElement = trelement.childNodes[0].childNodes[0];
        var topOffset = getTopOffset(trelement);

        if(docHeight) {
            if(topOffset + txtElement.scrollHeight > docHeight) {
                txtElement.style.bottom = "0px";
            }
        }

    } else {
        
        if(getProduct().platform=="fb"){

                        userInfoCache[userId] = {
                picture:{data:{url:"http://graph.facebook.com/"+userId+"/picture"}},
                id:userId,
                name:"Una vieja"
            };
            setUserInfo(userId, usertype, snapshot, trelement);


            /*var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var resp = JSON.parse(xmlhttp.responseText)
                    userInfoCache[userId] = resp;

                    setUserInfo(userId, usertype, snapshot, trelement);
                }
            }
            xmlhttp.open("GET", protocol + "://graph.facebook.com/" + userId + "?fields=id,name,picture", true);
            xmlhttp.send();*/
        } 
        if(getProduct().platform=="mobage"){
            userInfoCache[userId] = {
                picture:{data:{url:"http://sb.yahoo-mbga.jp/img_ava/profile/"+userId.split(":")[1]+"/1/medium-entire.gif"}},
                id:userId,
                name:"Un chino"
            };
            setUserInfo(userId, usertype, snapshot, trelement);
        }
        if(getProduct().platform=="vk") {


            /*var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        var resp = JSON.parse(xmlhttp.responseText)
                         userInfoCache[userId] = {
                        picture:{data:{url:resp.photo_50}},
                        id:userId,
                        name: resp.first_name + " "+resp.last_name
                    };

                    setUserInfo(userId, usertype, snapshot, trelement);
                }
            }
            xmlhttp.open("GET", 'https://api.vk.com/method/users.get?user_ids=302348973&fields=photo_50&name_case=Nom&v=5.23', true);
            xmlhttp.withCredentials=true;
            xmlhttp.send();*/

            userInfoCache[userId] = {
                picture:{data:{url:"res/ruso.jpg"}},
                id:userId,
                name:"Un ruso"
            };
            setUserInfo(userId, usertype, snapshot, trelement);
        }

    }
}

var count = 0;
var updateFreq = 45;

var lastMoney = null;
var uniqueusers = 0;
var payers = 0;
var refreshing = false;
        
