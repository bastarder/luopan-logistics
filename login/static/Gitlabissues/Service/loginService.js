(function(){
  'use strict';

  // 名称: 登陆服务
  // 依赖注入: $http,localStorageService
  // 依赖服务: UrlConfig(api地址配置)
  // 功能:
  //     > 1.this.login(object)  接受一个包含账号密码的对象作为参数,返回成功登陆的用户,或者错误信息；
  //     > 2.this.getToken()  无参数,获取缓存中的token并返回,无则返回null；
  //     > 3.this.getUserData()  无参数,获取缓存中的getUserData并返回,无则返回null；

  angular.module('GitLabApp')
    .service('loginService',loginService)
    //依赖注入
    loginService.$inject = ['$q','$http','localStorageService','UrlConfig'];

    //loginService主函数
    function loginService($q,$http,localStorageService,UrlConfig) {

      this.login = login; //登陆Gitlab,【成功返回】用户对象,并缓存, 【失败返回】错误代码；
      this.getToken = getToken; //获取缓存中的Token;
      this.getUserData = getUserData; //获取缓存中的账户信息;

      //------------------------华丽的分割线---------------------------

      //login 登陆函数 (参数1：包含账号密码的对象) 例： {userName:11111,password:22222}
      function login(param) {

        var deferred = $q.defer(); //创建异步；

        //如果账号密码没有传递,则抛出一个错误;返回;
        if(!param){
          var result = {
            'message':'服务接受到的账号密码为空,请确认是否填写'
          }
          deferred.reject(result); //账号密码参数为空,登陆失败,返回错误信息；
          return deferred.promise;
        };

        //创建登陆用的参数;
        var LoginParam = {
          'email': param.userName,
          'password': param.password,
        };

        //发送登陆请求;
        $http.post(UrlConfig.api+'session',LoginParam)
          .success(LoginResolve)
          .error(LoginReject)
        //登陆成功回调;
        function LoginResolve(response){
          localStorageService.set('UserData',response); //登陆成功后,缓存用户信息;
          deferred.resolve(response); //异步请求结束,登陆成功,返回用户信息；
        };
        //登陆失败回调;
        function LoginReject(response){
          console.log(response);
          deferred.reject(response)  //异步请求结束,登陆失败,返回错误信息；
        };

        return deferred.promise;
      }//login 登陆函数 End

      //getToken 获取token值函数 (无参数) 如果成功获取Token返回Token值,反之返回null；非异步；
      function getToken(){
        var UserData = localStorageService.get('UserData');
        try{
          var result = UserData.private_token; //尝试返回缓存中的token
          return result;
        }catch(error){
          var result = null //获取缓存token失败,返回null;
          return result;
        }
      }//get Token 函数End;

      //getToken 获取UserData函数 (无参数) 如果成功获取UserData则返回值,反之返回null；非异步；
      function getUserData(){
        var UserData = localStorageService.get('UserData');
        try{
          var result = UserData; //尝试返回缓存中的UserData
          return result;
        }catch(error){
          var result = null //获取缓存UserData失败,返回null;
          return result;
        }
      }//getUserData 函数End;

    }//loginService主函数 结束

})();
