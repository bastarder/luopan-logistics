(function() {
  'use strict';

  //依赖：1.TokenService（身份码获取服务）
  //#

  angular
    .module('GitLabApp')
    .service('issueSearchService',issueSearchService)

    //issueSearchService.$inject = ['$q','$http','TokenService','GitLabUrlConfig','localStorageService'];

    function issueSearchService($q,$http,TokenService,GitLabUrlConfig,localStorageService){
      var config = new GitLabUrlConfig();
      this.GetIssues = GetI;
      this.GetIssuesForMore = GetIssuesForMore;
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
              console.log('请求[id:'+milestoneId+']版本Issues中...');
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
                  if(successTimes == times){
                    console.log('issues数据请求完全结束...');
                    deferred.resolve(result);
                  };
                };
              };
            };
          };

        return deferred.promise;
      }

      function GetIssuesForMore(mileStone){
        // var inject = angular.injector(['LocalStorageModule']);
        // localStorageService = inject.get('localStorageService');
        var mileStone = angular.copy(mileStone);
        var customerMileStone = mileStone[1][0];
        var customerServiceMileStone = mileStone[2][0];
        var backSystemMileStone = mileStone[8][0];
        var token = localStorageService.get('pravite_token');
        var results = [];//最后输出
        var searchLength = 0;
        if(!token){
          alert('token没有获取到,刷新页面！');
        };
        var parm = {
          private_token:token
        };

        var deferred = $q.defer();
        //bug切分函数
        function splitIssues(data){
          var issues = angular.copy(data);
          var issues = _.groupBy(issues,'state');
          var opened = issues['opened'];
          var closed = issues['closed'];
          var result = {
            opened:opened,
            closed:closed
          };
          return result;
        }
        //确认搜索完毕函数
        function versionIssuesDone(){
          if(results.length>=searchLength){
            console.log('版本更新详细内容，数据处理结束：',results);
            deferred.resolve(results);
          }
        };
        //搜索客户系统bug
        if(customerMileStone){
          searchLength = searchLength+1;
          $http.get(config.url+'projects/1/milestones/'+customerMileStone.id+'/issues',{params:parm})
            .success(customerIssue);
          function customerIssue(data){
            console.log('客户系统bug接受成功',data)
            var closed = splitIssues(data).closed;
            var record ={};
            record.name = '客户系统';
            record.closedIssues = closed;
            results.push(record);
            versionIssuesDone();
          };
        };
        //搜索客服系统bug
        if(customerServiceMileStone){
          searchLength = searchLength+1;
          $http.get(config.url+'projects/2/milestones/'+customerServiceMileStone.id+'/issues',{params:parm})
            .success(customerServiceIssue);
          function customerServiceIssue(data){
            console.log('客服系统bug接受成功',data)
            var closed = splitIssues(data).closed;
            var record ={};
            record.name = '客服系统';
            record.closedIssues = closed;
            results.push(record);
            versionIssuesDone();
          };
        };
        //搜索后台bug
        if(backSystemMileStone){
          searchLength = searchLength+1;
          $http.get(config.url+'projects/8/milestones/'+backSystemMileStone.id+'/issues',{params:parm})
            .success(backSystemIssue);
          function backSystemIssue(data){
            console.log('后台系统bug接受成功',data)
            var closed = splitIssues(data).closed;
            var record ={};
            record.name = '后台系统';
            record.closedIssues = closed;
            results.push(record);
            versionIssuesDone();
          };
        };
        return deferred.promise;
      }
    };
})();
