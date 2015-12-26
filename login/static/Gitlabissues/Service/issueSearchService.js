(function() {
  'use strict';

  //依赖：1.TokenService（身份码获取服务）
  //#

  angular
    .module('GitLabApp')
    .service('issueSearchService',issueSearchService)

    issueSearchService.$inject = ['$q','$http','TokenService','GitLabUrlConfig','localStorageService'];

    function issueSearchService($q,$http,TokenService,GitLabUrlConfig,localStorageService){
      var config = new GitLabUrlConfig();
      this.GetIssues = GetI;
      function GetI(mileStone){
        var mileStone = angular.copy(mileStone);
        var token = localStorageService.get('pravite_token');
        var result = {};
        var project = [];
        var times = 0;
        var successTimes = 0;
        var deferred = $q.defer();
        if(!token){
          alert('没有获取到token！请刷新页面！');
          return ;
        };
        if(!mileStone){
          alert('没有选择版本号！怎么导出！');
          return ;
        }
        var parm = {
          private_token:token
        };

          for(var i in mileStone){
            var project_id = i;
            var curProject = mileStone[i];
            if(curProject.length == 0){
              delete mileStone[i];
            }

            for(var j=0;j<curProject.length;j++){
              var milestoneId = curProject[j].id;

              //project_id 工程号 milestoneid 版本号； 开始重复请求
              var times = times + 1;
              $http.get(config.url+'projects/'+project_id+'/milestones/'+milestoneId+'/issues',{params:parm})
                .success(SuccessGitI);
              function SuccessGitI(data){
                var issues = angular.copy(data)
                if(issues[0].project_id){
                  successTimes = successTimes + 1;
                  var innerId = issues[0].project_id;
                  if(result[innerId]){
                    // result[innerId].push(issues);
                    result[innerId] = _(result[innerId]).concat(issues).value();
                  }else{
                    result[innerId] = [];
                    result[innerId] = _(result[innerId]).concat(issues).value();
                    // result[innerId].push(issues);
                  };
                  console.log('请求中...');
                  if(successTimes == times){
                    console.log('数据请求完全结束');
                    deferred.resolve(result);
                  };
                };
              };
            };
          };

        return deferred.promise;
      }
    }

})();
