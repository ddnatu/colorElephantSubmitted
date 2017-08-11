app.service('MyService', function ($http) {

    var req1 = {
        method: 'POST',
        url: 'http://uitask.azurewebsites.net/fetchRecords',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "RequestObject":"Telemetry",
            "UserID": "Admin",
            "containerName":"garwareanaloginputtelemetry",
            "fromDate":"2017-07-22 00:00:00",
            "toDate":"2017-07-22 23:00:00"
        }
    }

    var reqUploadFile = {
        method: 'POST',
        url: 'http://localhost:3000/upload'
        // transformRequest: function(data, headersGetterFunction) {
        //     return data; // do nothing! FormData is very good!
        // }
    }
    var reqadminRegisters = {
        method: 'POST',
        url: 'http://localhost:3000/registerAdmin',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    var reqadminLogsIn = {
        method: 'POST',
        url: 'http://localhost:3000/loginAdmin',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    var reqsaveUserForm = {
        method: 'POST',
        url: 'http://localhost:3000/saveUserForm',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    var reqCheckIfDuplicate = {
        method: 'POST',
        url: 'http://localhost:3000/checkIfDuplicate',
        headers: {
            'Content-type': 'application/json'
        }
    }
    var reqadminVerifyRegister = {
        method: 'POST',
        url: 'http://localhost:3000/verifyRegistration',
        headers: {
            'Content-type': 'application/json'
        }
    }

    var reqFetchProfiles = {
        method: 'GET',
        url: 'http://localhost:3000/getProfiles',
        headers: {
            'Content-type': 'application/json'
        }  
    }

    var reqGetProfileData = {
        method: 'POST',
        url: 'http://localhost:3000/getProfileDetails',
        headers: {
            'Content-type': 'application/json'
        } 
    }
    var reqSubmitRating = {
        method: 'POST',
        url: 'http://localhost:3000/submitRating',
        headers: {
            'Content-type': 'application/json'
        } 
    }
    /* ----------------------------------------------------------------------------------------- */

    this.uploadAttachment = function(attachment){
        reqUploadFile.data = attachment;
        return $http(reqUploadFile);
    }

    this.adminRegisters = function(adminCredentialsObject){
        reqadminRegisters.data = adminCredentialsObject;
        return $http(reqadminRegisters);
    }

    this.verifyRegistration = function(timestamp){
        reqadminVerifyRegister.data = {
            "timestamp": timestamp
        }
        return $http(reqadminVerifyRegister);
    }

    this.adminLogsIn = function(adminCredentialsObject){
        console.log('check', adminCredentialsObject);
        reqadminLogsIn.data = adminCredentialsObject;
        return $http(reqadminLogsIn);
    }


    this.userSubmitsForm = function(userFormData){
        reqsaveUserForm.data = userFormData;
        return $http(reqsaveUserForm);
    }

    this.checkIfDuplicate = function(emailId){
        reqCheckIfDuplicate.data = {
            "emailId": emailId
        };
        return $http(reqCheckIfDuplicate);
    }


    /* Services for fetching of submitted profiles and profile details for admin */
    this.fetchProfiles = function(){
        return $http(reqFetchProfiles);
    }

    this.getProfileData = function(emailId){
        reqGetProfileData.data = {
            "emailId": emailId
        };
        return $http(reqGetProfileData);
    }

    this.submitRating = function(emailId, rating){
        console.log('email',emailId);
        console.log('service rating', rating);
        reqSubmitRating.data = {
            "emailId": emailId,
            "rating": rating
        }
        return $http(reqSubmitRating);
    }
});