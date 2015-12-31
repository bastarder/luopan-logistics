(function() {
  'use strict';

  //依赖：1.TokenService（身份码获取服务）
  //#

  angular
    .module('GitLabApp')
    .service('mileStoneService',mileStoneService)
    //依赖注入;
    mileStoneService.$inject = ['$q','$http','UrlConfig','loginService','NEED_PROJECT'];

    //MileStoneService 服务主函数;
    function mileStoneService($q,$http,UrlConfig,loginService,NEED_PROJECT){
      this.getMileStone = getMileStone; //请求Gitlab 获取milestone;

      //getMileStone 函数 开始;
      function getMileStone(){
        var project = NEED_PROJECT;  //读取要获取的工程列表;
        // var putOutMile = DONT_NEED_MILESTONE;  //读取最后会被过滤掉得milestone列表,可悲,异步后拿不到
        var api = UrlConfig.api;
        var deferred = $q.defer(); //创建异步请求;
        var result = {};//用于最后返回结果;
        var sendTimes = NEED_PROJECT.length; // 记录应该发送多少次请求;
        var finishTimes = 0; //记录已经处理了多少次请求;
        //获取token值 成功继续,失败返回空
        var token = loginService.getToken();
        //token获取失败,结束服务；返回错误信息；
        if(!token){
          deferred.reject({message:'获取mileStone失败,原因：获取Token失败,请尝试重新登陆!'});
          return deferred.promise;
        };
        //拼装身份参数
        var parm = {
          private_token:token
        };

        //开始请求：
        for(var i in project){
          var project_id = project[i];
          getMileStoneOnce(project_id);
        };

        //请求函数
        function getMileStoneOnce(project_id){
          $http.get(api+'projects/'+project_id+'/milestones',{params:parm})
            .success(SuccessGetMileStone)
            .error(FaildGetMileStone)
            //获取成功回调
            function SuccessGetMileStone(response){
              finishTimes = finishTimes + 1 ; //请求处理次数+1；
              var data = angular.copy(response);
              if(data.length<=0){
                allDone();
                return ;
              };
              var project_id = data[0].project_id;
              result[project_id] = data;
              allDone();
            };
            //获取失败回调
            function FaildGetMileStone(response){
              finishTimes = finishTimes + 1 ; //请求处理次数+1；
              allDone();
            };

            //判断是否全部处理完成；
            function allDone(){
              if(finishTimes == sendTimes){
                console.log('mileStone数据获取结束',result);
                deferred.resolve(result);
              };
            };
        };

        //请求结束；

        return deferred.promise;
      };//getMileStone 函数 End;

    };//MileStoneService 服务主函数 End;


})();
