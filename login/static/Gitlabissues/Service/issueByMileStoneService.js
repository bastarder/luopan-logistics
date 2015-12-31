(function() {
  'use strict';

  //依赖：
  //#

  angular
    .module('GitLabApp')
    .service('issueByMileStoneService',issueByMileStoneService)

    //依赖注入;
    issueByMileStoneService.$inject = ['$q','$http','loginService','UrlConfig','localStorageService'];

    //根据mileStone查询issues
    function issueByMileStoneService($q,$http,loginService,UrlConfig,localStorageService){
      this.getIssues = getIssues;

      // getIssues函数开始 接受参数{pid:[{id:1},...],...},返回{pid：[{issue},...],...}
      function getIssues(MileStone){
        var api = UrlConfig.api;
        var MileStone = angular.copy(MileStone); //获得版本号;
        var MileStone = FilterMileStone(MileStone); //删除空白版本号;
        var result = {};//用于最后返回结果;
        var sendTimes = 0; // 记录应该发送多少次请求;
        var finishTimes = 0; //记录已经处理了多少次请求;
        var deferred = $q.defer(); //创建异步请求;

        //获取token值 成功继续,失败返回空
        var token = loginService.getToken();
        //token获取失败,结束服务；返回错误信息；
        if(!token){
          deferred.reject({message:'获取issues失败,原因：获取Token失败,请尝试重新登陆!'});
          return deferred.promise;
        };
        //拼装身份参数
        var parm = {
          private_token:token
        };

        //开始请求issues;
        for(var key in MileStone){
          for(var i in MileStone[key]){
            var projectId = key;
            var MileId = MileStone[key][i].id;
            getIssuesOnce(projectId,MileId); //循环请求数据;
          }
        };//请求issues结束;

        //发送请求并且处理回调函数;
        function getIssuesOnce(projectId,MileId){
          sendTimes = sendTimes + 1; //发送次数记录；
          $http.get(api+'projects/'+projectId+'/milestones/'+MileId+'/issues',{params:parm})
            .success(SuccessGetIssues)
            .error(FaildGetIssues)
          //成功回调函数
          function SuccessGetIssues(response){
            finishTimes = finishTimes + 1;
            var data = angular.copy(response);
            //判断结果是否为空;
            if(data.length<=0){
              allDone();
              return ;
            };
            var projectId = data[0].project_id;
            //如果还未存在此对象,初始化
            if(!result[projectId]){
              result[projectId] = [];
            };
            //像指定对象添加内容;
            result[projectId] = _(result[projectId]).concat(data).value();
            //判断是否完全结束;
            allDone();
          };

          //失败回调函数
          function FaildGetIssues(response){
            finishTimes = finishTimes + 1;
            allDone();
          };

          //判断是否全部处理完成；
          function allDone(){
            if(finishTimes == sendTimes){
              console.log('issues数据获取结束',result);
              deferred.resolve(result);
            };
          };

        };

        //过滤删除空白版本号；
        function FilterMileStone(MileStone){
          var record = MileStone;
          for(var i in record){
            if(record[i].length <= 0){
              delete record[i];
            };
          };
          return record;
        };//过滤结束；

        return deferred.promise;
      };

    };
})();
