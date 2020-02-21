/*
This is a new file created by separating the live person script code and Amex specific (MYCA Assist JS) code from mycaassist.js.
mycaxcut.js contains the Amex specific script while live person specific script code is retained in mycaassist.js.
mycaassist.js will be loaded by iTM As-IS using iNav footer.
mycaxcut.js will be statically loaded by iNav header.
*/

//*******************************************************************
// Defines the Global Constants needed for a given page through XCut
//*******************************************************************

XCState = {
	is2XIntDisplayed : false,
	version : 2,
	offerCardArtForCardInContext : '',
	interstitialAlreadyDisplayed : false,
	set2XIntDisplayed : function (paramValue){
		XCState.is2XIntDisplayed = paramValue || false;
	},
	get2XIntDisplayed : function (){
		return XCState.is2XIntDisplayed;
	},
	setVersion : function (version){
		this.version = version || 1;
	},
	getVersion : function (){
		return XCState.version;
	},
	setOfferCardArtForCardInContext : function (offerCardArtForCardInContext){
		this.offerCardArtForCardInContext = offerCardArtForCardInContext || '/myca/shared/summary/cardasset/images/NUS999999999_480x304_STRAIGHT.png';
	},
	getOfferCardArtForCardInContext : function (){
		return XCState.offerCardArtForCardInContext;
	},
	setInterstitialAlreadyDisplayed : function (interstitialAlreadyDisplayed){
		this.interstitialAlreadyDisplayed = interstitialAlreadyDisplayed || false;
	},
	isInterstitialAlreadyDisplayed : function (){
		return XCState.interstitialAlreadyDisplayed;
	}
}
var jsonObj;

//**************************************
// XCut logging framework and functions.
//**************************************
XCutLogger = {
	/*
		config defines default configuration values.
		isLoggingEnabled : will be set to "true" in all environments except for E3SL and E3PROD.
	*/
	config : {
		'isLoggingEnabled' : false
	},

	//**********************************************
	// Function used for TeaLeaf logging.
	//**********************************************
	tealeafLogging : function (message){
		try{
			if (typeof(TeaLeaf)!="undefined" ) {
				var tealeafObject = { name1 : message};
				TeaLeaf.Event.tlAddCustomEvent("PaymentCenterErrorMessage", tealeafObject );
			}
		}catch(e){
		}
	},

	logMsg : function (message){
		if (XCutLogger.config['isLoggingEnabled']) {
			console.log(message);
		}
	},

	logJSONDataWithMsg : function (message, jsonData){
		if (XCutLogger.config['isLoggingEnabled']) {
			if (!message){
				message = "";
			}
			try{
				var tempJSON =  JSON.parse(jsonData);
				console.log(message);
				console.log(JSON.stringify(tempJSON, null, "\t"));
			}catch(e){
				try {
					console.log(message);
					console.log(JSON.stringify(jsonData, null, "\t"));
				} catch(e){
					console.log("Error in logging logJSONDataWithMsg Data...");
				}
			}
		}
	},

	logJSONData : function (jsonData){
		if (XCutLogger.config['isLoggingEnabled']) {
			try{
				var tempJSON =  JSON.parse(jsonData);
				console.log(JSON.stringify(tempJSON, null, "\t"));
			}catch(e){
				try {
					console.log(JSON.stringify(jsonData, null, "\t"));
				} catch(e){
					console.log("Error in logging logJSONData Data...");
				}
			}
		}
	}
}
//##############################################
//Start of MYCAAssist definition.
//##############################################
MycaAssist = {

	//Defines MYCA Assist Configuration parameters.
	//timeout - to timeout the AJAX call. default value is: 15Secs.
	//jsonPath - Request handler URL for AJAX call to MYCA Assist component.
	//ajaxCallStatus - default value is: 'unknown'. Other values include: 'initiated', 'completed', 'failed'
	//canAddToQueue - default value is: true. If this value is true, then client requests can be queued until AJAX response is ready.
	//requestDataArray - default is empty array. Represents the no.of requests queued during AJAX call processing.
	//mycaAssistTempJSON - Added new element for holding Temporary JSON being prepared in other applications for FallBack purposes.
	//makeAjaxCallWithNoConfigUpdates - Default value is false. When True, during AJAX calls, it will not make any updates to ajaxCallStatus,
	//									requestDataArray, canAddToQueue attributes.
	config : {
		'timeout' : 30000,
		'jsonPath' : '/myca/mycaassist/us/verifyJSON.do?request_type=authreg_home',
		'ajaxCallStatus' : 'unknown',
		'canAddToQueue' : true,
		'requestDataArray' : [],
		'mycaAssistTempJSON':'',//Added new element for holding Temporary JSON being prepared in other applications
		'makeAjaxCallWithNoConfigUpdates':'false'
	},

	/*
		This is the ------------'Entry Method'--------- for MYCAAssist component.
		All explicit client requests will prepare requestData object.
		Implicit call from iNav Header (static inclusion) will make the call without requestData.
	*/
	populateRequestedInfo : function(requestData){
		//Explicit Client calls when requestData is available.
		if (requestData !== null && requestData !== undefined && typeof requestData === 'object'){
			XCutLogger.tealeafLogging("MYCA Assist: Explicit Request from client.");
			XCutLogger.logMsg("Serving Request with " + requestData.requestedDataGroup + " Option.");
			var isAlreadyResponded = false;
			var isThisReqAddedToQueue = false;
			//Checking for Janus,AccountHub, domain
			if(MycaAssist.isSummaryDomain() && requestData.requestedDataGroup === 'DEMOG'){
				XCutLogger.logMsg("Inside MYCA Domain for " + requestData.requestedDataGroup + " Option.");
				//Check whether the requestedDataGroup is present in mycaassistJSON.commonAppData
				XCutLogger.logJSONDataWithMsg("JSON from AH (or) Janus :: ", mycaAssistJSON.commonAppData);
				var XCutData = MycaAssist.populateXCutData(requestData.requestedDataGroup, mycaAssistJSON.commonAppData);
				var isXCutDataPrepared = (XCutData.resStatus && XCutData.resStatus === true) ? true : false;
				if (isXCutDataPrepared){
					XCutLogger.logMsg("Inside isXCutDataPrepared if condition for " + requestData.requestedDataGroup + " Option.");
					//make a call to onSuccess callback method with XCutData as an argument to the calling function.
					var successCallBackMethod = requestData.onSuccess;
					if(successCallBackMethod){
						successCallBackMethod = successCallBackMethod+'(XCutData)';
						XCutLogger.logMsg("Sending Immediate Success Call back with Janus/AH data for " + requestData.requestedDataGroup + " Option.");
						XCutLogger.logJSONData(XCutData);
						 try{
							//To invoke callback asynchronously.
							setTimeout( function() {
								eval(successCallBackMethod);
							}, 0 );
						}catch(err){
						}
					}
					isAlreadyResponded = true;
				} else{
					XCutLogger.logMsg("Inside isXCutDataPrepared else block for " + requestData.requestedDataGroup + " Option.");
					/*For fixing issue when resStatus is false but ajax call status will be completed.
					To make ajax call happen resetting status to failed only when status is completed only*/
					if(MycaAssist.config['ajaxCallStatus'] === 'completed'){
						MycaAssist.config['ajaxCallStatus'] = 'failed';
					}
				}
			} else {
				XCutLogger.logMsg("Inside NON-MYCA Domain for " + requestData.requestedDataGroup + " Option.");
			}

			//requestData can be queued iff
			// 1) the request is not responded earlier.
			// 2) canAddToQueue == true.
			// 3) ajaxCallStatus != 'completed'.
			if(MycaAssist.config['canAddToQueue']
				&& isAlreadyResponded  == false
				&& MycaAssist.config['ajaxCallStatus'] != 'completed'){
				XCutLogger.logMsg("Adding the request to queue for " + requestData.requestedDataGroup + " Option.");
				isThisReqAddedToQueue = true;
				//then Queue the requestData into array.
				MycaAssist.config['requestDataArray'].push(requestData);
			}
			//AJAX Call must be made only in the case of 'unknown' and 'failed' status.
			if (MycaAssist.config['ajaxCallStatus'] === 'unknown'
				|| MycaAssist.config['ajaxCallStatus'] === 'failed') {
				XCutLogger.logMsg("Making AJAX Call for " + requestData.requestedDataGroup + " Option.");
				MycaAssist.validateJSON(requestData);
			} else {
				if (!isThisReqAddedToQueue && !isAlreadyResponded) {
					XCutLogger.logMsg("Serving request from existing JSON for " + requestData.requestedDataGroup + " Option.");
					//Check whether the requestedDataGroup is present in mycaassistJSON.commonAppData
					var XCutData = MycaAssist.populateXCutData(requestData.requestedDataGroup, mycaAssistJSON.commonAppData);
					var isXCutDataPrepared = (XCutData.resStatus && XCutData.resStatus === true) ? true : false;
					if (isXCutDataPrepared){
						XCutLogger.logMsg("Inside isXCutDataPrepared if condition for " + requestData.requestedDataGroup + " Option.");
						//make a call to onSuccess callback method with XCutData as an argument to the calling function.
						var successCallBackMethod = requestData.onSuccess;
						if(successCallBackMethod){
							successCallBackMethod = successCallBackMethod+'(XCutData)';
							XCutLogger.logJSONDataWithMsg("Sending Success Call back for " + requestData.requestedDataGroup + " Option.", XCutData);
							try{
								//To invoke callback asynchronously.
								setTimeout( function() {
									eval(successCallBackMethod);
								}, 0 );
							}catch(err){
							}
							//Calling the OffersPage Html
							//MycaAssist.handleInterstitial();
						}
					} else{
						XCutLogger.logMsg("Inside isXCutDataPrepared else block for " + requestData.requestedDataGroup + " Option.");
						var failCallBackMethod = requestData.onFailure;
						//Setting failCallBack to successCallBack if failure callback is not present
						if(failCallBackMethod === null || failCallBackMethod === undefined){
							failCallBackMethod = requestData.onSuccess;
						}
						if(failCallBackMethod){
							failCallBackMethod = failCallBackMethod+'(XCutData)';
							XCutLogger.logJSONDataWithMsg("Sending error Call back for " + requestData.requestedDataGroup + " Option.", XCutData);
							try{
								setTimeout( function() {
									eval(failCallBackMethod);
								}, 0 );
							}catch(err){

							}
						}
						/*For fixing issue when resStatus is false but ajax call status will be completed.
						To make ajax call happen resetting status to failed only when status is completed only*/
						if(MycaAssist.config['ajaxCallStatus'] === 'completed'){
							MycaAssist.config['ajaxCallStatus'] = 'failed';
						}
					} // end of isXCutDataPrepared else block
				} else {
					XCutLogger.logMsg("Requested is added to the queue for " + requestData.requestedDataGroup + " Option.");
					XCutLogger.logMsg("Hence not getting served from this block for " + requestData.requestedDataGroup + " Option.");
				}
			}
		}else{
			XCutLogger.tealeafLogging("MYCA Assist: Implicit Request made.");
			XCutLogger.logMsg("Making Implicit Call from Static reference.");
			//Implicit call from static iNav Header including mycaxcut.js.
			MycaAssist.validateJSON();
		}
	},

	/*
		This function will parse the JSON by reading mycaAssistJSON.commonAppData and checks for
		pageDetails and DataAvailability.

		1)if DataAvailability is true then it will invoke JSON component with action = update
		2)if DataAvailability is false then it will invoke JSON component with action = verify
		3)if mycaAssistJSON.commonAppData is not defined then it will invoke JSON component with action = retrieve
		and create a new JSON.
	*/
	validateJSON : function(requestData){
		XCutLogger.tealeafLogging("Inside validateJSON.");
		//parameters added for XCut iNav Changes to handle RequestData
		var timeOut ='';
		var parameters = '';
		var mycaPageDetails;
		var jsonData;
		//Checking the client Request Object and populating the parameters for ajaxCall
		if (requestData !== null && requestData !== undefined){
			var origin = requestData.originationID;
			// If input requestGroup is not contained in XCut fragments, then default to ALL.
			var reqDataGroup = requestData.requestedDataGroup;
			reqDataGroup = XCut['fragments'][reqDataGroup] === undefined ? XCut.fragments.ALL : reqDataGroup;
			var xCutParams="&origin="+origin+"&reqDG="+reqDataGroup;
			//If the request is for default card update, then there is no need to update any of the queue status, ajax call status.
			//Add this request to requestDataArray so that we don't need additional AJAX call API's for handling between AJAX Call Status
			//Updates required Vs Not required.
			if (requestData.requestedDataGroup === XCut.fragments.SETTINGS) {
				XCutLogger.logMsg("Inside Settings option.");
				MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] = 'true';
				xCutParams += "&newDefaultCard="+requestData.newDefaultCard;
				MycaAssist.config['canAddToQueue'] = true;
				MycaAssist.config['requestDataArray'].push(requestData);
			}
			parameters += xCutParams;
			//timeOut = requestData.timeout; //enable this when started accepting timeouts from clients.
			timeOut = MycaAssist.config['timeout'];
		} else {
			XCutLogger.logMsg("Calling validate JSON for implicit call.");
			timeOut = MycaAssist.config['timeout'];
		}
		//Adding defaultActionType to be retrieve
		var actionType = 'retrieve';
		/*Removed all client specific callBackMethods as argument for Ajax calls as elements can be retreived from global JSON and Array */
		if (mycaAssistJSON.commonAppData != '')
		{
			try{
				/*  Modified below conditions to remove the unnecessary checks
					Removed all ajax calls after every action type check and making calls only after getting the action Type by validating the globalJSON
					By default actionType is retrieve
				*/
				jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
				XCutLogger.tealeafLogging("JSONParseSuccess from validateJSON.");

				if (jsonData)
				{
					mycaPageDetails = jsonData.pageDetails;
					if (mycaPageDetails && mycaPageDetails.status && mycaPageDetails.status.toUpperCase() === "SUCCESS")
					{
						if (jsonData.dataAvailability === "true")
						{
							actionType = "update";
						}else{
							actionType = "verify";
						}
					}
				}
			}catch(e){
				XCutLogger.tealeafLogging("JSON Parse Error from validateJSON.");
				//Here action will be retrieve by default
			}
		}
		//Moving the parameters setting to one place to reduce redundancy in code
		//Making the ajax call after getting the actionType by validating the global json
		parameters =  parameters+"&action="+actionType;

		var tempLogText = "";
		if (requestData !== null && requestData !== undefined){
			tempLogText = " explicit client call.";
		} else {
			tempLogText = " Implicit static reference call.";
		}
		try{
			XCutLogger.logMsg("Triggering " + actionType + " action for " + tempLogText);
			MycaAssist.ajaxCall(MycaAssist.config['jsonPath'], parameters, 'POST', 'handleResponse' ,jsonData, timeOut);
			XCutLogger.logMsg("Returning from " + actionType + " action for " + tempLogText);
		}catch(e){
			XCutLogger.logMsg("Exception occurred while executing Ajax Call for " + tempLogText);
			XCutLogger.tealeafLogging("Exception occurred while executing Ajax Call.");
		}
	},

	/*
		This method is used to make the ajaxCall to update the data in the session, to verify / refresh the JSON Content.
		New arguments were added as part of iNav integration with MYCA Assist component.
	*/
	ajaxCall : function(endpoint, parameters, method, callback ,appJSON, reqTimeOut){
		//Getting the current window URL & Validating the url against valid MYCA specific domains
		var pageURL = window.location.href;
		var isValidDomain = false;
		if(pageURL.indexOf("americanexpress.com") >= 0
			|| pageURL.indexOf("aexp.com") >= 0){
			isValidDomain = true;
        }

		//Added unknown check to make ajax call only if it is not started or completed. Even though this check will not guarantee the synchronized access to Ajax calls,it will handle concurrent call with minute delay.
		//makeAjaxCallWithNoConfigUpdates is true then no need to check for any status.
		if ( isValidDomain && ( MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'true'
							   || MycaAssist.config['ajaxCallStatus'] === 'unknown'
							   || MycaAssist.config['ajaxCallStatus'] === 'failed') ){
			XCutLogger.tealeafLogging("JSONajaxCall");
			var ajaxRequest;
			try{ ajaxRequest = new XMLHttpRequest(); }
			catch (e){
				try{ ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");}
				catch (e){
						try{ ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");}
						catch (e){ return false;}
					}
			}
			var randomNumber = MycaAssist.generateRandomNumber();
			endpoint= endpoint + "?p=" + randomNumber;
			var jsonString;
			var params;

			if (typeof appJSON != 'undefined' && appJSON !=''){
				XCutLogger.tealeafLogging("JSONbeforestringify");
				jsonString = JSON.stringify(appJSON);

				/* Modified below replace logic "-" with "~" as lastLogon field contains Date with hyphen "-" symbols.*/
				jsonString = jsonString.replace(/\&/g,'~');
				jsonString = "requestJSON=" + encodeURIComponent(jsonString);
				params = parameters +"&"+jsonString;
			}else{
				XCutLogger.tealeafLogging("JSONemptyAjax");
				params = parameters;
			}
			//Calling DeviceType method to get the deviceType of Application Loaded.
			params += MycaAssist.getDeviceType();
			ajaxRequest.open(method, endpoint, true);
			ajaxRequest.withCredentials="true";
			ajaxRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");

			//No need to update the status of AJAX Call when makeAjaxCallWithNoConfigUpdates == true
			if(MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false'){
				//Adding flag to track the ajax call initiated status
				MycaAssist.config['ajaxCallStatus'] = 'initiated';
			}

			ajaxRequest.send(params);

			var timeout = setTimeout(function() {
				ajaxRequest.abort();
				var errMsg = "Ajax request timed out";
				MycaAssist['handleError'](errMsg);
				}, reqTimeOut);

			ajaxRequest.onreadystatechange = function(){
				if(ajaxRequest.readyState == 4){
					clearTimeout(timeout);
					if(ajaxRequest.status == 200){
						var ajaxResponse = ajaxRequest.responseText;

						if(ajaxResponse !=null){
							//Added parameters to default callback function to handle client call back related data,requestGroup
							MycaAssist[callback](ajaxResponse);
							XCutLogger.tealeafLogging("JSONcallback");
						}
						var errMsg = "Ajax request failed";
					}else if(ajaxRequest.status !== 0){
						MycaAssist['handleError'](errMsg);
					}

					XCutLogger.tealeafLogging("JSONAjaxComplete");
				}
			};
		}else{
			var errMsg = "Page does not belong to valid MYCA Domain";
			MycaAssist['handleError'](errMsg);
		}
	},

	refreshAjaxCall : function(endpoint, parameters, method, callback){

		var ajaxRequest;
	    try{ ajaxRequest = new XMLHttpRequest(); }
	    catch (e){
            try{ ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");}
            catch (e){
                    try{ ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");}
                    catch (e){ return false;}
                }
        }

		ajaxRequest.open(method, endpoint, true);
		ajaxRequest.withCredentials="true";
	    ajaxRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
	    ajaxRequest.send(parameters);

	    var timeout = setTimeout(function() {
			ajaxRequest.abort();
	        MycaAssist['handleError']();
			}, MycaAssist.config['timeout']);

	    ajaxRequest.onreadystatechange = function(){
        	if(ajaxRequest.readyState == 4){
        		clearTimeout(timeout);
        		if(ajaxRequest.status == 200){
					if(mycaAssistJSON.commonAppData !=null){
						MycaAssist[callback]();
					}
				}else if(ajaxRequest.status !== 0){
            		MycaAssist['handleError']();
            	}

            }
        };
	},

	/*
		This method is the endPoint for any success response got from ajax calls in application Flow
		Removed unwanted arguments for modularity.
		Added parameters are ajaxResponse to invoke client
	*/
	handleResponse : function(ajaxResponse){
		//Below lines of code moved from ajaxCall method so as to set new iNav field in JSON before setting into commonAppData
		//Removing the successCallBack Check before placing the ajaxResponse in global JSON,as global JSON must be updated for every success response.
		mycaAssistJSON.commonAppData = MycaAssist.decodeJSONString(ajaxResponse);
		XCutLogger.logJSONDataWithMsg("JSON from AJAX Call Response from XCut APP is :: ", mycaAssistJSON.commonAppData);
		//Checking for Smaller Devices and making the interstitialURL as blank so as to allow the individual Applications to show their respective Offers Pages by controlling or restricting the Ajax Call from our end for showing the Offers Page. 
			if(document.body.className.indexOf("res_Small") >= 0){
					if (mycaAssistJSON.commonAppData != '')
						{
							try{
								jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
								if (jsonData)
								{
									interstitialURL = jsonData.interstitialURL;
									if (interstitialURL)
									{
										jsonData.interstitialURL = '';
									}
									mycaAssistJSON.commonAppData = JSON.stringify(jsonData);
								}
							}catch(e){
								XCutLogger.tealeafLogging("JSON Parse Error from handleResponse.");
							}
						}
			}
		if (MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false'){
			
			jsonObjReady = true;
			XCutLogger.tealeafLogging("jsonObjReady");
			if( document.createEvent ) {
				document.body.dispatchEvent(maevObj);
			} else {
				document.body.jsonAvailable++;

			}
			XCutLogger.logMsg("Setting JSON Availability Event Object.");
			//Enabling Employee Control Tab only for Estatement & Payments
			MycaAssist.enableEmpCtrl();
		}
		//Adding flag to check whether to add request to array
		MycaAssist.config['canAddToQueue'] = false;
		requestDataArray = MycaAssist.config['requestDataArray'];
		
		if (requestDataArray.length > 0){
			XCutLogger.logMsg("requestDataArray size is: " + requestDataArray.length);
			//Looping through the RequestData Array and preparing the XcutData & handling callbacks
			for(var i = 0; i < requestDataArray.length; i++){
				var requestedDataGroup = requestDataArray[i].requestedDataGroup;
				var successCallBackMethod = requestDataArray[i].onSuccess;
				if(successCallBackMethod !== null && successCallBackMethod !== undefined){
					var XCutData = MycaAssist.populateXCutData(requestedDataGroup, mycaAssistJSON.commonAppData);
					var isXCutDataPrepared = (XCutData.resStatus && XCutData.resStatus === true) ? true : false;
					XCutLogger.logMsg("isXCutDataPrepared = " + isXCutDataPrepared);
					if ( isXCutDataPrepared || (typeof(MycaAssist.config['mycaAssistTempJSON']) == "undefined"
								|| MycaAssist.config['mycaAssistTempJSON'] == null) ){
						XCutLogger.logMsg("Inside Success callback with JSON prepared by XCut.");
						//Checks for Xcut callback from client,if exists will invoke callback method along with ajaxResponse.
						successCallBackMethod = successCallBackMethod+'(XCutData)';
						XCutLogger.logJSONDataWithMsg("Calling success AJAX callback for " + requestDataArray[i].requestedDataGroup, XCutData);
						try{
							setTimeout( function() {
								eval(successCallBackMethod);
							}, 0 );
						}catch(err){
						}
					    //Calling the OffersPage Html
						//MycaAssist.handleInterstitial();
					} else {
						XCutLogger.logMsg("Inside Success callback with JSON already prepared by Individual Applications.");
						XCutData = MycaAssist.populateXCutData(requestedDataGroup, MycaAssist.config['mycaAssistTempJSON']);
						//Checks for Xcut callback from client,if exists will invoke callback method along with ajaxResponse.
						successCallBackMethod = successCallBackMethod+'(XCutData)';
						XCutLogger.logJSONDataWithMsg("Calling success AJAX callback for " + requestDataArray[i].requestedDataGroup, XCutData);
						try{
							setTimeout( function() {
								eval(successCallBackMethod);
							}, 0 );
						}catch(err){
						}
						//Calling the OffersPage Html
						//MycaAssist.handleInterstitial();
					}
				}
			} //end of for loop
			//empty the requestDataArray
			MycaAssist.config['requestDataArray'] = [];
			MycaAssist.config['canAddToQueue'] = true;
		} else {
			XCutLogger.logMsg("Just Served the Implicit call Successfully.");
		}

		if (MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false'){
			//Update ajaxCallStatus to completed, empty the input requestData array and canAddToQueue to true.
			//Keeping the ajaxCallStatus as completed if dataAvailability is true ,if not setting as fail inorder to provide the next client to make the ajax call to get the mycaAssistJSON with dataAvailability true.
			try{
				var assistJSON = JSON.parse(mycaAssistJSON.commonAppData);
				if(assistJSON && assistJSON.dataAvailability === "true"){
					MycaAssist.config['ajaxCallStatus'] = 'completed';
					XCutLogger.logMsg("ajaxCallStatus set as completed.");
				}else{
					MycaAssist.config['ajaxCallStatus'] = 'failed';
					XCutLogger.logMsg("ajaxCallStatus set as failed.");
				}
			}catch(err){
					//Set ajaxCallStatus as failed in case of parsing error
					MycaAssist.config['ajaxCallStatus'] = 'failed';
					XCutLogger.logMsg("ajaxCallStatus set as failed.");
			}
			MycaAssist.config['mycaAssistTempJSON']='';//Emptying the tempJSON value
		}

		//After the AJAX call with no configuration updates is completed. Try to reset it to default values.
		if (MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'true'){
			MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false';
		}
		    //Calling the OffersPage Html
			//MycaAssist.handleInterstitial();
	},
	/*
		This method is used to handle the Error scenarios occur in different levels of application flow
		Removed unwanted arguments for modularity.
		Added parameters are errMsg to invoke client failCallback method with custom error message
	*/
	handleError : function(errMsg){
		XCutLogger.logMsg("Inside handleError.");
		//Adding flag to check whether to add request to array
		MycaAssist.config['canAddToQueue'] = false;
		requestDataArray = MycaAssist.config['requestDataArray'];
		var requestedDataGroup;
		
		//First try to verify whether data from Other applications is available. 
		//If yes, then use the data provided by them.
		//If not, send the error call back to clients.
		if (MycaAssist.config['mycaAssistTempJSON'] && MycaAssist.config['mycaAssistTempJSON'] != ''){
			XCutLogger.logMsg("Inside Success call back with Application specific data from handleError.");
			//requestDataArray can never be null (or) undefined.	
			if (requestDataArray.length > 0){
				XCutLogger.logMsg("requestDataArray size is: " + requestDataArray.length);	
				for(var i = 0; i < requestDataArray.length; i++){
					requestedDataGroup = requestDataArray[i].requestedDataGroup;
					var successCallBackMethod = requestDataArray[i].onSuccess;
					if(successCallBackMethod !== null && successCallBackMethod !== undefined){
						XCutLogger.logMsg("Invoking Success call back.");	
						var XCutData = MycaAssist.populateXCutData(requestedDataGroup, MycaAssist.config['mycaAssistTempJSON']);			
						//Checks for Xcut callback from client,if exists will invoke callback method along with ajaxResponse.
						var successCallBackMethod = successCallBackMethod+'(XCutData)';
						XCutLogger.logJSONDataWithMsg("Calling success AJAX callback from handleError for external clients with XCutData:: ", XCutData);
						try{
							setTimeout( function() {
								eval(successCallBackMethod);
							}, 0 );
						}catch(err){
						}
					} else {
						XCutLogger.logMsg("Ignoring the request as there is no success call back method.");	
					}
				}
			} else {
				XCutLogger.logMsg("requestDataArray size is: 0 and is in else block.");
				XCutLogger.logMsg("Invoking success call back for Implicit call " + XCut.fragments['ALL'] + " Option." );
				var XCutData = MycaAssist.populateXCutData(XCut.fragments['ALL'], MycaAssist.config['mycaAssistTempJSON']);			
				//Checks for Xcut callback from client,if exists will invoke callback method along with ajaxResponse.
				var successCallBackMethod = successCallBackMethod+'(XCutData)';
				XCutLogger.logJSONDataWithMsg("Calling success AJAX callback from handleError for implicit static call with XCutData:: ", XCutData);
				try{
					setTimeout( function() {
						eval(successCallBackMethod);
					}, 0 );
				}catch(err){
				}
			}			
			//Trigger the Success callBack event. This will be triggered for every success callback from handleError for each request.
			if (MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false'){
				jsonObjReady = true;
				XCutLogger.tealeafLogging("jsonObjReady");
				if( document.createEvent ) {
					document.body.dispatchEvent(maevObj);
				} else {
					document.body.jsonAvailable++;

				}
				XCutLogger.logMsg("Setting JSON Availability Event Object.");
				MycaAssist.enableEmpCtrl();
			}
		} else {
			XCutLogger.logMsg("Inside error call back.");
			var XCutData = MycaAssist.prepareDefaultJSON(errMsg);
			//requestDataArray can never be null (or) undefined.	
			if (requestDataArray.length > 0){
				XCutLogger.logMsg("requestDataArray size is: " + requestDataArray.length);	
				//Looping through the ReqeustData Array and preparing the XcutData & handling callbacks
				for(var i = 0; i < requestDataArray.length; i++){
					requestedDataGroup = requestDataArray[i].requestedDataGroup;
					var failCallBackMethod = requestDataArray[i].onFailure;
					//Setting failCallBack to successCallBack if failure callback is not present
					if(failCallBackMethod === null || failCallBackMethod === undefined){
						failCallBackMethod = requestDataArray[i].onSuccess;
					}
					if(failCallBackMethod){
						failCallBackMethod = failCallBackMethod+'(XCutData)';
						XCutLogger.logJSONDataWithMsg("Calling error AJAX callback for " + requestDataArray[i].requestedDataGroup, XCutData);
						try{
							setTimeout( function() {
								eval(failCallBackMethod);
							}, 0 );
						}catch(err){

						}
					} else {
						XCutLogger.logMsg("Ignoring the failureCallback request as there is no call back method.");
					}
				} // end of for loop.
			} else {
				XCutLogger.logMsg("Invoking failureCallBack for Implicit call.");
			}
			//Fire the error callback event. This will be fired for every request in handleError.
			if (MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false'){
				jsonObjReady = true;
				if( document.createEvent ) {
					document.body.dispatchEvent(maevObjerr);
				} else {
					document.body.jsonError++;
				}
				XCutLogger.logMsg("Setting Error Event Object.");
			}
		} // end individual application's Assist JSON data else check.
		//This check is only needed when configuration updates are required.
		if (MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false'){
			//Update ajaxCallStatus to completed, empty the input requestData array and canAddToQueue to true.
			MycaAssist.config['ajaxCallStatus'] = 'failed';
		}
		MycaAssist.config['requestDataArray'] = [];
		MycaAssist.config['canAddToQueue'] = true;
		//After the AJAX call with no configuration updates is completed. Try to reset it to default values.
		if (MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'true'){
			MycaAssist.config['makeAjaxCallWithNoConfigUpdates'] == 'false';
		}
		//Calling the OffersPage Html
		//MycaAssist.handleInterstitial();
	},

	refreshCallBack : function(){
		return "true";
	},

/*
This function is used for getting the card's sorted index
for which CSS data is available
*/

getCSSAvailableIndex : function(cssCode){

var sortedIndex = null;
 if (mycaAssistJSON.commonAppData != '')
 {
	var jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
	var cardsInfoList = jsonData.cardsInfoList;

	if (typeof jsonData!='undefined')
	{
		 if (typeof cardsInfoList!='undefined')
		 {
			for(var i = 0; i < cardsInfoList.length; i++)
			 {
			    var finData = cardsInfoList[i].finData;
				if (typeof finData!='undefined' && typeof finData.creditStatusCodes !='undefined'){
						for(var j = 0; j < finData.creditStatusCodes.length; j++) {
							if(finData.creditStatusCodes[j] === cssCode){
								sortedIndex = cardsInfoList[i].sortedIndex;
								break;
							}
						}
					}
					}
				}


	}
  }
  return sortedIndex;
},

/*
This function is used for getting the card's sorted index
for which CSS data is available
*/
getCSSAvailableIndexForIC : function() {
 var sortedIndex = null;
 if (mycaAssistJSON.commonAppData != '') {
	var jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
	if (typeof jsonData!='undefined') {
		var cardsInfoList = jsonData.cardsInfoList;	
		 if (typeof cardsInfoList!='undefined')	 {
			for(var i = 0; i < cardsInfoList.length; i++) {
			    var finData = cardsInfoList[i].finData;
				var is_IO_IQ_Available = false;
				var is_IZ_Available = false;
				if (typeof finData!='undefined' && typeof finData.creditStatusCodes !='undefined') {
					for(var j = 0; j < finData.creditStatusCodes.length; j++) {
						if((finData.creditStatusCodes[j] === "IO_IncomeCapture_eStmt_Solicit" 
							|| finData.creditStatusCodes[j] === "IQ_IncomeCapture_Janus_Solicit")) {
							is_IO_IQ_Available = true;
						}
						
						if(finData.creditStatusCodes[j] === "IZ_IncomeCapture_Suppress") {
							is_IZ_Available = true;
						}
					}
				}
				// return the sorted index only when IZ code is not available
				if(is_IO_IQ_Available && !is_IZ_Available) {
					sortedIndex = cardsInfoList[i].sortedIndex;
					break;
				}
			} // end of card list loop
		}// end of checking list is null or not
	} // checking jsonData is null or not
  }//checking mycaAssistJSON.commonAppData is null or not
  return sortedIndex;
},

checkAndLoadRDMOIncCapLayer : function() {
	//Don't call, Income Capture page if it is already Loaded.
	if(document.getElementById("rdmorwd_main_content") == null) {
		var solicitIndex = MycaAssist.getCSSAvailableIndexForIC();
		var isIncptrEligible = false;
		// check if any one of the CAS codes(IO_IncomeCapture_eStmt_Solicit/IQ_IncomeCapture_Janus_Solicit) available and not eligible for suppress.
		 if(solicitIndex != null) {
			var jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
			var cardsInfoList = jsonData.cardsInfoList;
			for (var i =0;i< cardsInfoList.length;i++) {
				// Check if the eligible card is not Active/Corporate/Supp Card 
				var isSupp = cardsInfoList[i].additionalCard;
				if (cardsInfoList[i].sortedIndex == solicitIndex && 
   					  cardsInfoList[i].cardStatus === "Active" &&
					  cardsInfoList[i].cardType !== "Corporate" && 
									typeof isSupp !='undefined' &&
										(isSupp == "false" || !isSupp)) {
					isIncptrEligible = true;
					break;
				}
			}
		}
		// Load income capture interstitial when CAS codes are available.
		if(isIncptrEligible && MycaAssist.getQueryVariable("request_type") != "authreg_pic") {
			MycaAssist.displayICLayer(solicitIndex, "xcut");
		}
	}
},

displayICLayer : function(sortedIndex, orgId){
	RDMOIncCapPojo  = function () {
		this.sortedIndex = -1;
		this.originatorId = "xcut";
	};

	if(!MycaAssist.isSmallDevice()){
		var rdmoIncCap = new RDMOIncCapPojo();
		rdmoIncCap.sortedIndex = sortedIndex;
		
		if(orgId !== "undefined") {
			rdmoIncCap.originatorId = orgId;
		}		
		
		if(typeof(RDMORwdWidget) == "undefined") {
			var body = document.getElementsByTagName('body')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = "/myca/shared/summary/rdmo/js/rdmorwd_lib_compress.js";
			script.id = "rdmorwdIncCapJS";
			if(typeof(script.onload) != "undefined"){
				script.onload = function(){
					RDMORwdWidget.initialize(rdmoIncCap);
				};
			} else {
				script.onreadystatechange = function(){
					 if (this.readyState == 'complete' || this.readyState == 'loaded') {
						RDMORwdWidget.initialize(rdmoIncCap);
					}
				};
			}
			body.appendChild(script);
		} else {
			//If JS is already loaded call the RDMO function directly.
			RDMORwdWidget.initialize(rdmoIncCap);
		}
	}
	var event = window.attachEvent ? 'onresize' : 'resize';
	window.addEventListener(event, function(){
		var rdmorwd_main_content = document.getElementById("rdmorwd_main_content");
		var rdmorwd_content = document.getElementById("rdmorwd_content");
		if(rdmorwd_main_content != null && rdmorwd_content != null) {
			var isRDMORwdInterstitial = false;
			if(rdmorwd_content.className.indexOf("rdmorwdAsLayer") > -1){
				isRDMORwdInterstitial = true;
			}
			if(MycaAssist.isSmallDevice() && isRDMORwdInterstitial){
				rdmorwd_main_content.style.display = "none";
			} else {
				rdmorwd_main_content.style.display = "block";
			}
		}
	});
},

getQueryVariable: function(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++){
		var pair = vars[i].split("=");
		if(pair[0] == variable){
			return pair[1];
		}
	} 
	return null;
},

isSmallDevice : function(){
	var isSmall = false;
	if(document.body.className.indexOf("res_Small") > -1){
		isSmall = true;
	}
	return isSmall;
},

	isWidgetReady : function() {
	  try {
			// this logic is to control overlapping of multiple interstitials on the myca pages
			var jsonData = JSON.parse(mycaAssistJSON.commonAppData);
			if (jsonData && MycaAssist.getCSSAvailableIndexForIC() != null) {
				XCutLogger.tealeafLogging("MYCA Assist: XCut Triggering Income Capture Interstitial");
				jsonData.interstitialURL = "/myca/shared/summary/rdmo/html/rdmorwd_home.html";
				mycaAssistJSON.commonAppData = JSON.stringify(jsonData);
			} else if(jsonData && MycaAssist.interstitial.paperless.isEligible(mycaAssistJSON.commonAppData)) {
				XCutLogger.tealeafLogging("MYCA Assist: XCut Triggering Paperless Interstitial");
				jsonData.interstitialURL = "paperless";
				mycaAssistJSON.commonAppData = JSON.stringify(jsonData);
			}
		} catch(e) {
			XCutLogger.tealeafLogging("isWidgetReady: JSONParseError");
		}
		return jsonObjReady;
	},

	generateRandomNumber : function(){
		var chars = "ABCDEFG";
		var result = "";
		for(var i=0; i<chars.length; i++){
			var randomPos = Math.floor( Math.random() * chars.length );
			result += chars.substr(randomPos, 1);
		}

		return result;
	},

/*
This function is used to refresh/update CSS data in JSON by calling CreditStatusService.
*/
refreshCSSData : function(){

if (mycaAssistJSON.commonAppData != '')
     {
	var jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
	var cardsInfoList = jsonData.cardsInfoList;
	jsonData.dataAvailability = "false";

	if (typeof jsonData!='undefined')
	   {
		 if (typeof cardsInfoList!='undefined')
		 {
			for(var i = 0; i < cardsInfoList.length; i++){

			  delete jsonData.cardsInfoList[i].badgingIndicator;
			}
}
			var parameters = "action=refresh";
			MycaAssist.refreshAjaxCall(MycaAssist.config['jsonPath'], parameters, 'POST', 'refreshCallBack');
       }
      }
	},

refreshJSONData : function(){
	if (mycaAssistJSON.commonAppData != ""){
		var jsonData;
		var mycaPageDetails;

		try{

		jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
		 mycaPageDetails = jsonData.pageDetails ;

		} catch(e) {
			XCutLogger.tealeafLogging("JSONParseErrorRefresh");
		}

		if (typeof jsonData!='undefined'){

			if (typeof mycaPageDetails!='undefined' && typeof mycaPageDetails.status!='undefined' && mycaPageDetails.status == "fail"){

				var parameters =  "action=refresh";
				MycaAssist.refreshAjaxCall(MycaAssist.config['jsonPath'], parameters, 'POST', 'refreshCallBack');

			}
		} else {

			XCutLogger.tealeafLogging("RfrhDtaUndfnd");

		}
	}
},
/*
This function is used to clear the Session Data unconditionally.
*/
refreshJSON : function(){
	try {
		var parameters =  "action=refresh";
		MycaAssist.refreshAjaxCall(MycaAssist.config['jsonPath'], parameters, 'POST', 'refreshCallBack');
	} catch (e) {
		XCutLogger.tealeafLogging("UnExpected error occurred while refreshing the data using refreshJSON.");
	}
},

	/*
		This method is used to determine the default card information to be sent as input to PZN Offers service.
		Default card is determined using the below logic.
		1) First verify whether it is a single card. If yes, then assign "0" as defCardForOffers.
		2) For a multi card, verify whether valid sorted_index is coming from the URL request. If yes, set the 
			valid sorted_index value to defCardForOffers.
		3) If not, verify whether card member has setup any default card using the Card Drawer 
			and set the default card to  defCardForOffers.
		4) If none of the conditions are met, ignore the call to PZN Offers.
	*/
	determineDefaultCard : function (){
		var defCardForOffers;
		
		try{
			if (mycaAssistJSON && mycaAssistJSON.commonAppData){
				jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
				var cardsInfoList = jsonData.cardsInfoList;
				if (cardsInfoList && cardsInfoList.length == 1){
					defCardForOffers = "0";
				} else {
					if(cardsInfoList) {
						var sorted_index = MycaAssist.getQueryVariable('sorted_index');
						var isSortedIndexValid = false;
						for(var i=0;i<cardsInfoList.length;i++) {
							if(cardsInfoList[i].sortedIndex == sorted_index) {
							   isSortedIndexValid =true;
							   break;
							}
						}
						if(isSortedIndexValid) {
							defCardForOffers = sorted_index;
						} else if(jsonData && jsonData.defaultCard !== undefined && 
							jsonData.defaultCard !== null && jsonData.defaultCard !== "" 
							&& jsonData.defaultCard != "-1"){
							defCardForOffers = jsonData.defaultCard;
						}
						XCutLogger.logMsg("defCardForOffers"+defCardForOffers);
					}
				}
			}
		} catch (error) {
			XCutLogger.tealeafLogging("Exception occured while obtaining default card info. for PZN input.");
			XCutLogger.logMsg("Exception occured while obtaining default card info. for PZN input.");
		}
		
		return defCardForOffers;
	},
/*
This function is used to append 'iNEmpCont' css class to <body> for controlling iNav on payments page.
*/
	enableEmpCtrl : function(){},
	enableEmpCtrlINav : function(iNavSortedIndex) {},
	cardUpgradePZNCall:function(sortedIndex) {},
	populatePZNJson :function(ajaxResponse) {},
	invokeOtherInterstitials: function() {},
	PZNFailureCalBack :function(errMsg){},
	cardUpgradePZNSuccessCalBack :function(ajaxResponse){},
	cardUpgradePZNFailureCalBack : function(errMsg){},
	cardAcquisitionOne : function(treatmentList) {},
	/*
		This function checks with global json,checks for Demographics data content present,prepares new XCutData object with required fields.
	*/
	populateXCutData : function(reqGroup, assistJSON){
		//Creating new XCutData to hold XCutData elements to respond to client
		var XCutData = {
			resStatus:false,
			profile:{}
		}
		if(XCut['fragments'][reqGroup] === "SETTINGS" && assistJSON){
			XCutData.resStatus = true;
			//Not updating the JSON back to clients.
		}
		//Checking for DEMOG Element in RequestGroup and validating againt fragments element from XCut
		if((XCut['fragments'][reqGroup] === "DEMOGRAPHICS" || XCut['fragments'][reqGroup] === "ALL") && assistJSON){
			var jsonData;
			try{
				jsonData =  JSON.parse(assistJSON);
				if(jsonData){
					var xCutPageDetails = jsonData.pageDetails;
					if(xCutPageDetails && xCutPageDetails.status.toUpperCase() === "SUCCESS" ){
						var profile = XCutData.profile;
						//Added DefaultCard element in XCut as part of Release2
						if(jsonData.defaultCard){
							profile.defaultCard = jsonData.defaultCard;
						}
						var demographics = jsonData.demographics;
						var cardsInfoList = jsonData.cardsInfoList;
						if(demographics){
							profile.memberSince = demographics.memberSince;
							profile.lastLogon = demographics.lastLogon;
						}//Iterating over CardInfoList and setting in to XCutData JSON Object
						if(cardsInfoList){
							profile.cardsInfo = [];
							for(var i = 0; i < cardsInfoList.length; i++)
							{
								var cardsInfoTemp ={} ;
								cardsInfoTemp.firstName = cardsInfoList[i].firstName;
								cardsInfoTemp.lastName = cardsInfoList[i].lastName;
								cardsInfoTemp.embName = cardsInfoList[i].embossedName;
								cardsInfoTemp.acctStatus = cardsInfoList[i].cardStatus;
								cardsInfoTemp.lastFive = cardsInfoList[i].acctNum;
								cardsInfoTemp.cardKey = cardsInfoList[i].cardKey;
								cardsInfoTemp.busName = cardsInfoList[i].businessName;
								cardsInfoTemp.cardDesc = cardsInfoList[i].cardDesc;
								cardsInfoTemp.sortIndex = cardsInfoList[i].sortedIndex;
								cardsInfoTemp.cardType = cardsInfoList[i].cardType;
								cardsInfoTemp.pmcGrp = cardsInfoList[i].pmcGrp;
								//Iterating & Setting cardAssets value
								if(cardsInfoList[i].cardAssets){
									cardsInfoTemp.sCardArt = cardsInfoList[i].cardAssets.smallCardArt;
									cardsInfoTemp.lCardArt = cardsInfoList[i].cardAssets.largeCardArt;
									cardsInfoTemp.x3lCardArt = cardsInfoList[i].cardAssets.x3LargeCardArt;
								}
								cardsInfoTemp.isAddlCard = cardsInfoList[i].additionalCard;
								cardsInfoTemp.pastDueDays = cardsInfoList[i].pastDueDays;
								cardsInfoTemp.homeLocale = cardsInfoList[i].homeCountryLocale;

								//Iterating and setting associatedSupps values
								var associatedSuppJSON = cardsInfoList[i].associatedSupps;
								if(associatedSuppJSON)
								{
									cardsInfoTemp.associatedSupps =[];
									for(var j = 0; j < associatedSuppJSON.length; j++)
									{
										var associatedSuppsTemp ={};

										associatedSuppsTemp.name = associatedSuppJSON[j].name;
										associatedSuppsTemp.status = associatedSuppJSON[j].status;
										associatedSuppsTemp.cardKey = associatedSuppJSON[j].cardKey;
										//Setting firstName ,Lastname & RecentCharges for AssociatedSupps as part of Release2
										associatedSuppsTemp.fName = associatedSuppJSON[j].firstName;
										associatedSuppsTemp.lName = associatedSuppJSON[j].lastName;
										associatedSuppsTemp.recCharges = associatedSuppJSON[j].recentCharges;
										cardsInfoTemp.associatedSupps.push(associatedSuppsTemp);
									}
								}

								if(XCut['fragments'][reqGroup] === "ALL"){
									//Populate messaging ,Rewards and fin data if request group is ALL
									var messagingTemp = MycaAssist.populateMessagingData(cardsInfoList[i]);
									var finTemp = MycaAssist.populateFinData(cardsInfoList[i]);
									var rewardsTemp = MycaAssist.populateRewardsData(cardsInfoList[i]);
									cardsInfoTemp.messaging = messagingTemp;
									cardsInfoTemp.fins = finTemp;
									cardsInfoTemp.rewards = rewardsTemp;
								}

								//Adding cardInfo object to profile Root Element
								profile.cardsInfo.push(cardsInfoTemp);
							}
						}

						if(XCut['fragments'][reqGroup] === "ALL"){
							XCutData["others"] = MycaAssist.populateOthersData(jsonData);
						}
						//setting response value to XCutData
						XCutData.resStatus = MycaAssist.getXCutDataRespStatus(XCutData, reqGroup);

					}
				}
			}catch(err){
			}
		}
		return XCutData;
	},

	/*
		This function is used to populate messaging data
	*/
	populateMessagingData: function(cardDetails){
		var messagingTemp={};
		if(cardDetails){
			messagingTemp.badgingInd = cardDetails.badgingIndicator;
			messagingTemp.badgingInfo = cardDetails.badgingInfo;
			if(cardDetails.finData){
				messagingTemp.cssCds = cardDetails.finData.creditStatusCodes;
			}
		}
		return messagingTemp;
	},

	/*
		This function is used to populate fins data
	*/
	populateFinData: function(cardDetails){
		var finTemp={};
		if(cardDetails && cardDetails.finData){
			finTemp.currBal = cardDetails.finData.currentBalance;
			finTemp.minDueAmt = cardDetails.finData.minDueAmt;
			finTemp.outstdngBal = cardDetails.finData.outstdngBalance;
			finTemp.pastDueAmt = cardDetails.finData.pastDueAmt;
			var tempPaymentMessage = cardDetails.finData.paymentMessage;
			//changed variable name as part of release 2
			//Checking for payment not required at this time / payment not required / PAST DUE text in payment Message,
			//if exists, we are populating the paymentDueDate as blank.
			//if not, we are adding the original paymentDueDate from the backend.
			//Based on the above change, iNav will display blank after "Payment message" instead of Not Available.
			//This change is requested by iNav in order to handle blank "Closing date is" and "PAST DUE" with Corp cards
			//during ACE Conditions.
			if ( tempPaymentMessage && (("Payment not required at this time" == tempPaymentMessage)
									|| ("Payment not required" == tempPaymentMessage) 
									|| ("PAST DUE" == tempPaymentMessage)) ) {
				finTemp.pymtDueDt = '';
			} else {
				finTemp.pymtDueDt = cardDetails.finData.paymentDueDate;
			}
			finTemp.pymtMsg = tempPaymentMessage;
			//Added new elements as part of release2
			finTemp.closeDt = cardDetails.finData.closingDate;
			finTemp.recCharges = cardDetails.finData.recentCharges;
		}
		return finTemp;
	},

	/*
		This function is used to populate others data
	*/
	populateOthersData :function(jsondata){
		var others={};
		if(jsondata){
			others.stoken = jsondata.stoken;
			others.gkFlag = jsondata.gkFlag;
			others.bbPublic = jsondata.bbPublic;
			others.pageURL = jsondata.pageURL;
			if(jsondata.psEligible !== null && jsondata.psEligible !== undefined){
			others.psEligible = jsondata.psEligible;
			}	
		}
		return others;
	},

	/*
		This function populates MR/Rewards data
	*/
	populateRewardsData :function(jsondata){
		var rewards={};
		if(jsondata && jsondata.lyltyAcctDtls){
			rewards.tier = jsondata.lyltyAcctDtls.tier;
			rewards.rwdsNum = jsondata.lyltyAcctDtls.loyaltyAcctNum;
			rewards.authRedeemFlag = jsondata.lyltyAcctDtls.AuthFlagForRedemption;
			rewards.ptBal = jsondata.lyltyAcctDtls.availPts;
			rewards.nonMRFlag = jsondata.lyltyAcctDtls.nonMRFlag;
		}
		return rewards;
	},

	/*
		This function iterates through XCutData and checks for required/mandatory elements present in the JSON
	*/
	getXCutDataRespStatus : function(XCutData, reqGroup){
		return MycaAssist.isDemogDataComplete(XCutData);
	},

	/*
		This function iterates over profile in XCutData object and returns whether mandatory elements are present or not

	*/
	isDemogDataComplete : function(XCutData){
		var respStatus = false;
		if(XCutData && XCutData.profile && XCutData.profile.cardsInfo){
			var cardList = XCutData.profile.cardsInfo;
			for(var i = 0; i < cardList.length; i++)
			{
				var cardInfoTemp = cardList[i];//Removed sCardArt mandatory check and added sortedIndex check
				//Perform the mandatory check for non-failed and us cards only.
				if ( !(cardInfoTemp && cardInfoTemp.acctStatus && cardInfoTemp.homeLocale
								&& (cardInfoTemp.acctStatus.toLowerCase() == "failure" || cardInfoTemp.homeLocale != "en_US") ) ) {
					// if (cardInfoTemp.sortIndex) is failing when sortIndex = 0 as 0 also considered failure. Hence using the alternative.
					if(cardInfoTemp.lastFive && cardInfoTemp.sortIndex !== null && cardInfoTemp.sortIndex !== undefined && cardInfoTemp.sortIndex !== "" ){
						respStatus = true;
					}else{
						//To break the loop and set respSatus as false if any one of the cards' data is incomplete
						respStatus = false;
						break;
					}
				} else {
					XCutLogger.logMsg("Skipping the mandatory check for the card ending with : " + cardInfoTemp.lastFive);
					//In all other scenarios consider this as a success response as we will not get complete information in these cases.
					//These cases will be considered failure (or) international cards.
					respStatus = true;
				}
			}
		}
		return respStatus;
	},

	/*
		This function iterates over demog,others,messaging,fins data in XCutData object and returns whether mandatory
		elements are present or not.
	*/
	isAllDataComplete : function(XCutData){
		var respStatus = false;
		//Check if demog and others data is complete
		if(MycaAssist.isDemogDataComplete(XCutData) && MycaAssist.isOthersDataComplete(XCutData)){
			var cardList = XCutData.profile.cardsInfo;
			for(var i = 0; i < cardList.length; i++)
			{
				var cardInfoTemp = cardList[i];
				/* Checking mandatory elements in Messaging - badging Indicator
				   Fins- current Balance and paymentDueDate
				*/
				if(cardInfoTemp.messaging && cardInfoTemp.messaging.badgingInd !== null && cardInfoTemp.messaging.badgingInd !== undefined && cardInfoTemp.messaging.badgingInd !== "" && cardInfoTemp.fins && cardInfoTemp.fins.currBal !== null && cardInfoTemp.fins.currBal !== undefined && cardInfoTemp.fins.currBal !== "" //&& cardInfoTemp.fins.paymtDueDt
				){
					respStatus = true;
				}else{
					//To break the loop and set respSatus as false if any one of the cards' data is incomplete
					respStatus = false;
					break;
				}
			}

		}
		return respStatus;
	},

	/*
		This function iterates over others data in XCutData object and returns whether mandatory elements are present or not
	*/
	isOthersDataComplete: function(XCutData){
		var respStatus = false;
		if(XCutData && XCutData.others && XCutData.others.stoken && XCutData.others.bbPublic){
			respStatus = true;
		}
		return respStatus;
	},

	/* This function is used to prepare default XCutData json with error message in case of failures. */
	prepareDefaultJSON : function(errMsg){

		var XCutData = {
			resStatus:false
		}
		//Populate the error message into XCutData
		if(!errMsg){
			errMsg = 'UnKnown error occured while preparing XCutData.';
		}
		XCutData["message"] = errMsg;

		return XCutData;
	},

	// Function for decoding the URLEncoded JSON String before parsing into JSON object
	 decodeJSONString :function(encodedJSONStr) {
		var decodedJSON = "";
		if (encodedJSONStr) {
			decodedJSON = decodeURIComponent(encodedJSONStr.replace(/\+/g,  " "));
		}
		return decodedJSON;
	},

	isSummaryDomain : function(){
		var isSummaryPage = false;
		var pageURL = window.location.href;
		if(pageURL.indexOf("/myca/acctmgmt/us") >= 0
			|| pageURL.indexOf("/myca/acctmgmt/alt/us") >= 0
			|| pageURL.indexOf("/myca/accountsummary/us") >= 0
			|| pageURL.indexOf("/accounthub") >= 0){
			isSummaryPage = true;
        }
		XCutLogger.tealeafLogging("isSummaryPage = " + isSummaryPage); // remove this line before going to production.
		return isSummaryPage;
	},

	//While making this call, there should not be any change in AJAX Call Status.
	updateJSONData : function(requestData){
		MycaAssist.validateJSON(requestData);
	},
	/* This function is used to get the additional Values from Backend and to populate the global json with this new element. */
	populateAdditionalData : function(requestData){
		XCutLogger.tealeafLogging("JSONajaxCall for populating additional Data from BackEnd");
			var ajaxRequest;
			try{ ajaxRequest = new XMLHttpRequest(); }
			catch (e){
				try{ ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");}
				catch (e){
						try{ ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");}
						catch (e){ return false;}
					}
			}
			var randomNumber = MycaAssist.generateRandomNumber();
			var endpoint = '/myca/mycaassist/us/getDATA.do?request_type=authreg_home';
			endpoint= endpoint + "?p=" + randomNumber;
			var params =  "&action=fetch";
			var successCallBack = requestData.onSuccess;
			var failCallBack = requestData.onFailure;
			ajaxRequest.open('POST', endpoint, true);
			ajaxRequest.withCredentials="true";
			ajaxRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");

			ajaxRequest.send(params);

			var timeout = setTimeout(function() {
				ajaxRequest.abort();
				var errMsg = "Ajax request timed out";
				MycaAssist['handleError'](errMsg);
				}, MycaAssist.config['timeout']);

			ajaxRequest.onreadystatechange = function(){
				if(ajaxRequest.readyState == 4){
					clearTimeout(timeout);
					if(ajaxRequest.status == 200){
						var ajaxResponse = ajaxRequest.responseText;

						if(ajaxResponse !=null){
							//Added parameters to default callback function to handle client call back related data,requestGroup
							MycaAssist[successCallBack](ajaxResponse);
							XCutLogger.logMsg("Inside Success response for additional Data with response as :" + ajaxResponse);
							XCutLogger.tealeafLogging("JSONcallback");
						}
					}else if(ajaxRequest.status !== 0){
						var errMsg = "Ajax request failed";
						MycaAssist['handleError'](errMsg);
					}

					XCutLogger.tealeafLogging("JSONAjaxComplete");
				}
			};
		
	},
	/* This function is used as the success call back method to append the new element from backend to global json */
	AdditionalSuccessCallBack : function(ajaxResponse){
		mycaAssistJSON.commonAppData = MycaAssist.decodeJSONString(ajaxResponse);
		XCutLogger.logJSONDataWithMsg("JSON from AJAX Call Response from Additional Data Ajax Call SuccessCallBack is :: ", mycaAssistJSON.commonAppData);
		
	},
	/* This function is used as Failure call back method for additional Data Ajax Call */
	AdditionalFailureCallBack : function(errMsg){
		XCutLogger.logMsg("Error Message from Additional Failure Call Back method:" + errMsg);
	
	},
	handleInterstitial : function(){
	},//End of handleInterstitial method 
	loadStyles : function(array, callback) {},
	makeAjaxCall : function(endPoint, methodType, successCallBack, failureCallBack){
	
		var ajaxRequest;
				try {
					ajaxRequest = new XMLHttpRequest();
				} catch (e) {
					try {
						ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
					} catch (e) {
					try {
						ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {
						return false;
					}
				}
			}
			
			ajaxRequest.open(methodType, endPoint, true);
			ajaxRequest.withCredentials="true";
			ajaxRequest.send(null);
			
			var timeout = setTimeout(function() {
				ajaxRequest.abort();
				var errMsg = "Ajax request timed out";
				MycaAssist[failureCallBack](errMsg);
			}, MycaAssist.config['timeout']);

			ajaxRequest.onreadystatechange = function() {
				if (ajaxRequest.readyState == 4) {
					clearTimeout(timeout);
					if (ajaxRequest.status == 200) {
						var ajaxResponse = ajaxRequest.responseText;

						if (ajaxResponse != null) {
							MycaAssist[successCallBack](ajaxResponse);
						}
					} else if (ajaxRequest.status !== 0) {
						var errMsg = "Ajax request failed while retrieving the Test.html";
						MycaAssist[failureCallBack](errMsg);
					}
				}
			};
	},
	getDeviceType : function(){
		var deviceType = "&dT=";
		if(document.body.className.indexOf("res_Small") >= 0){
			deviceType  = deviceType + "res_Small";
		}else if(document.body.className.indexOf("res_Medium") >= 0){
			deviceType  = deviceType + "res_Medium";
		}else if(document.body.className.indexOf("res_Large") >= 0){
			deviceType  = deviceType + "res_Large";
		}
		return deviceType;
	},
	getResponsiveDeviceType : function(){
		var deviceType="";
		if(document.body.className.indexOf("res_Small") >= 0){
			deviceType  = "res_Small";
		}else if(document.body.className.indexOf("res_Medium") >= 0){
			deviceType  = "res_Medium";
		}else if(document.body.className.indexOf("res_Large") >= 0){
			deviceType  = deviceType + "res_Large";
		}
		return deviceType;
	},	
//This method returns whether the current domain is wct domain or not.
	isWCTDomain : function(){
		  var isWCTPage = false;
		  var pageURL = window.location.href;
		  if((pageURL.indexOf("/myca/wct/us") >= 0) || (pageURL.indexOf("/myca/wct/alt/us") >= 0)){
				isWCTPage = true;
			}
		  XCutLogger.tealeafLogging("isWCTPage = " + isWCTPage); // remove this line before going to production.
		  return isWCTPage;
 },
	canMakeDefaultCall : function() {
		return true;

	},
	endswithstr:function(str,suffix){
		return str.indexOf(suffix,str.length -suffix.length)!== -1;
	},
	isValidRange : function(exptdRange){
		var returnVal=false;
		try{
			if (mycaAssistJSON.commonAppData != ''){
				jsonData =  JSON.parse(mycaAssistJSON.commonAppData);
				if(jsonData){
					var bbPubVal = jsonData.bbPublic;
					if(bbPubVal && exptdRange){
						var bbPublicLastChar = bbPubVal.charAt(bbPubVal.length - 1);
						if(exptdRange.test(bbPublicLastChar)){
							returnVal=true;
						}
					}
				}
			}				
		}catch(err){
			XCutLogger.tealeafLogging("JSON Parse Error from arbitrateOffer.");
		}
		return returnVal;
	},

	/**
	 * Placeholder for interstitial
	 */
	interstitial: (function () {})()
};
//##############################################
//End of MYCAAssist definition.
//##############################################


//==============================================
//Start of XCut definition.
//==============================================
//Created a new name space to manage MYCAAssist clients other than live person.
XCut = {
	//Enumeration of Data Fragments.
	fragments : {"DEMOG":"DEMOGRAPHICS", "ALL":"ALL", "SETTINGS":"SETTINGS"},

	/* Entry Method for all client requests which takes requestData and process it. */
	getRequestedInfo : function(requestData){
		MycaAssist.populateRequestedInfo(requestData);
	},

	/* This method will be invoked to refresh the entire JSON data in the session for ALL (or) update default card for SETTINGS. */
	refreshData : function(requestData){
		if (XCut['fragments'][requestData.requestedDataGroup] === "SETTINGS"){
			XCutLogger.logMsg("Inside Settings update.");
			MycaAssist.updateJSONData(requestData);
		} else if (XCut['fragments'][requestData.requestedDataGroup] === "ALL") {
			XCutLogger.logMsg("Inside refresh JSON for ALL option.");
			MycaAssist.refreshJSON();
		}
	},
	
	/* Entry Method for all client requests to update the additional Data */
	getAdditionalData : function(requestData){
		MycaAssist.populateAdditionalData(requestData);
	},
	//This method been modified to get an argument of the Target Div which we need to align
	alignLayerContent: function(targetDiv){		 
		var element = document.getElementById(targetDiv);
		//Start to align Layer to Center.
		var innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var windowwidth = parseInt(innerWidth/2);
		var offerLayerWidth = element.offsetWidth;
		var layerWidth = parseInt(offerLayerWidth/2);
		var layerStartPos = windowwidth - layerWidth;		
		if(innerWidth > element.offsetWidth){
			element.style.left = layerStartPos+"px";			
		}
		var innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		var windowHeight = parseInt(innerHeight/2);
		var offerLayerHeight = element.offsetHeight;
		var layerHeight = parseInt(offerLayerHeight/2);
		if(layerHeight < windowHeight){
			element.style.top = ((windowHeight-layerHeight)+"px");
		}else{
			element.style.top = "50px";
		}	
		//End to align Layer to Center.
	}
}
//==============================================
//end of XCut definition.
//==============================================

//**********************************************
//  Actual Script Execution Starts Here.
//**********************************************
try{
	//TeaLeaf event for Script Execution Start.
	XCutLogger.tealeafLogging("MYCA XCut Script Execution Started.");

	//Variables declaration.
	var jsonObjReady = false;
	//Setting empty string if mycaAssistJSON.commonAppData is undefined.
	if(typeof(mycaAssistJSON)=="undefined" || typeof (mycaAssistJSON.commonAppData) =="undefined"){
		XCutLogger.logMsg("Assigning default value to mycaAssistJSON.");
		var mycaAssistJSON = {
			commonAppData:""
		}
	} else {
		//Store the non-empty mycaAssistJSON data prepared by all apps other than Janus in a local variable
		//and then ignore the mycaAssistJSON data (by emptying it) so that XCut will prepare the mycaAssistJSON data.
		if (!MycaAssist.isSummaryDomain()){
			XCutLogger.logMsg("Inside assigning the application JSON value to mycaAssistTempJSON.");
			try{
				//Checking for mycaAssistJSON.commonAppData availability before loading the appSpecific assistData to Temporary Variable.
				var assistJSON = JSON.parse(mycaAssistJSON.commonAppData);
				if(assistJSON){
					MycaAssist.config['mycaAssistTempJSON'] = mycaAssistJSON.commonAppData;
					mycaAssistJSON.commonAppData = "";
				}
			}catch (err){
				XCutLogger.logMsg("Inside catch block while assigning the application JSON value to mycaAssistTempJSON.");
			}
		} else {
			XCutLogger.logMsg("Serving SummaryRequest.");
		}
	}

	//Events for notifying the LivePerson based AJAX Call response.
	var maevObj;
	var maevObjerr;
	if(document.createEvent) {
		maevObj = document.createEvent('HTMLEvents');
		maevObj.initEvent('jsonAvailable', true, true);

		maevObjerr = document.createEvent('HTMLEvents');
		maevObjerr.initEvent('jsonError', true, true);
	} else {
		maevObj = document.createEventObject();
		maevObjerr = document.createEventObject();
	}

	//JSON stringify method is explicitly defined for IE7 browsers.
	var JSON = JSON || {};
	JSON.stringify = JSON.stringify || function (obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string") obj = '"'+obj+'"';
			return String(obj);
		}else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				v = obj[n]; t = typeof(v);
				if (t == "string") v = '"'+v+'"';
				else if (t == "object" && v !== null) v = JSON.stringify(v);
				json.push((arr ? "" : '"' + n + '":') + String(v));
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	}

	//TeaLeaf event for Script Execution End.
	XCutLogger.tealeafLogging("MYCA XCut: Preparing Assist Data.");

	//This is the entry point for preparing the global Assist JSON object (for LivePerson)
	//and will be implicitly invoked through static inclusion of mycaxcut.js in iNav Header.
	//This replaces the previous MycaAssist.handleDelay() method.
	if(MycaAssist.canMakeDefaultCall()) {

	XCut.getRequestedInfo();

	}
	//TeaLeaf event for Script Execution End.
	XCutLogger.tealeafLogging("MYCA XCut Script Execution Ended.");
}catch(err){
	XCutLogger.tealeafLogging("UnExpected Script Error: MYCA XCut execution Aborted.");
}
//**********************************************
//  Actual Script Execution Ends Here.
//**********************************************

