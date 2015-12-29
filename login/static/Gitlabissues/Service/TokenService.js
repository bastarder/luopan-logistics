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

      function GetToken(email,password) {
        var deferred = $q.defer();
          var token = localStorageService.get('pravite_token');
          //查询缓存token;如果有择不请求登陆；
          if(token){
            deferred.resolve(token);
            return deferred.promise;
          }
          var LoginParm = {
            'email':email,
            'password':password
          };
          //请求登陆,获取pravite_token值;
          console.log('登陆链接Gitlab,获取token中...');
          $http.post(config.url+'session',LoginParm)
            .success(tokenResolve)
            .error(tokenReject)
          //回调处理;
          function tokenReject(response) {
            deferred.reject(response.message);
          }
          function tokenResolve(response) {
            var response = angular.copy(response);
            //登陆成功，返回身份码；
            if(response.private_token){
              localStorageService.set('pravite_token',response.private_token);
              console.log('最新token获取成功!进行下一步操作...');
              deferred.resolve(response.private_token);
            }
          }
        return deferred.promise;
      }
    }


})();
