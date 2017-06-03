var myApp = angular.module('myApp', ['youtube-embed']);

myApp.controller('MyCtrl', function ($scope,youtubeEmbedUtils,$http) {
	$scope.timeListURL = [];
	$scope.counter = 0;

	//get current video time
	$scope.getTime = function(){

		if($scope.videoURL == undefined) return;

		$scope.counter++;
		nowTime =  $scope.mainPlayer.getCurrentTime();

		if(nowTime == 0) return;

		$scope.timeListURL.push(
		{
			"time": nowTime,
			"tag": "Break number " + $scope.counter
		}
		)
		console.log($scope.timeListURL);
	}

	//sTime = time of video, in seconds 
	$scope.setTimeTo = function(sTime){
		$scope.mainPlayer.seekTo(sTime)
	}


	$scope.removeItem = function(idx) {
		$scope.timeListURL.splice(idx, 1);
	};


	$scope.saveList = function(){
		if($scope.timeListURL.length <= 0)return;

		$http({ 
			method: 'POST', 
			url: 'manager.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data:{'url':$scope.videoURL, 'list': $scope.timeListURL}
		})
		.then(function(response) {
			if(response.data['ok']){
				alert("Lista Salva");
				loadTemplate();
			}else{
				alert("Falha ao manipular o Arquivo.");
			}
		})
	}

	$scope.readFile = function(){
		if($scope.filename == undefined) return;
		$http.get($scope.filename).then(sucessFileCallback, errorFileCallback);
	}

	function sucessFileCallback(resp){	
		console.log(resp);
		if(!resp.data || resp.data.length == 0){
			alert("Arquivo Inválido")
			return;
		}
		if(resp.data.list == undefined || resp.data.url == undefined){
			alert("Arquivo Inválido")
			return;	
		}
		$scope.videoURL = resp.data.url;
		$scope.timeListURL = resp.data.list;
	}

	function errorFileCallback(resp){
		alert("Falha ao abrir o arquivo.");
	}





});