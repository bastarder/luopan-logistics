(function() {
  'use strict';

  //@
  //#

  angular
    .module('GitLabApp')
    .service('TokenService',TokenService)

    TokenService.$inject = ['$q','$http','GitLabUrlConfig','localStorageService'];

    function TokenService($q,$http,GitLabUrlConfig,localStorageService){
      var config = new GitLabUrlConfig(); //初始化配置项
      this.GetToken = GetToken;
      // localStorageService.set('localStorageDemo','12312312');
      // console.log(localStorageService.get('localStorageDemo'));

      function GetToken() {
        var deferred = $q.defer();
          var token = localStorageService.get('pravite_token');
          //查询缓存token;如果有择不请求登陆；
          if(token){
            deferred.resolve(token);
            return deferred.promise;
          }
          //请求登陆,获取pravite_token值;
          $http.post(config.url+'session',config.LoginParm)
            .then(tokenResolve)
          //回调处理;
          function tokenResolve(response) {
            var response = angular.copy(response);
            //登陆成功，返回身份码；
            if(response.data.private_token){
              localStorageService.set('pravite_token',response.data.private_token);
              deferred.resolve(response.data.private_token);
            }
          }
        return deferred.promise;
      }
    }


})();
