(function() {
  'use strict';

  //依赖：
  //#

  angular
    .module('GitLabApp')
    .service('issueReportService',issueReportService)
    //依赖注入;
    issueReportService.$inject = ['$q','REPORT_GROUP'];

    //处理生成周报表数据;
    function issueReportService($q,REPORT_GROUP){
      this.getReportData = getReportData; //获得统计数据 参数：{pid:[{issue},...],...};
      this.getVersionData = getVersionData; //获得统计数据 参数：{pid:[{issue},...],...};
      this.getPersonalReportData = getPersonalReportData; //获得统计数据 参数：{pid:[{issue},...],...};
      //getReportData 开始;
      function getReportData(data){
        var data = angular.copy(data);
        var results = {};
        //遍历生成各项目统计数据;
        for(var key in data){
          var ProjectIssues = data[key];
          dealWith(ProjectIssues);
        };

        //数据统计函数
        function dealWith(ProjectIssues){
          //根据状态分为 closed opened reopen
          var record = _.groupBy(ProjectIssues,'state');
          if(!record.closed){
            return;
          };
          //准备开始统计
          var record = record.closed;
          var project_id = record[0].project_id;
          results[project_id] = {};
          results[project_id] = dataPick(record);
          //数据统计函数
          function dataPick(closed){
            var labels = angular.copy(REPORT_GROUP);
            var result = {};
            for(var i =0;i<labels.length;i++){
              var label = labels[i];
              var id = i;
              var group = _.groupBy(closed,function(n){
                var index = _.indexOf(n.labels, label);
                return index == -1 ? 0:1;
              });
              var group = group[1];
              if(!group){
                result[id] ={};
                result[id].issuesTotal = 0;
                result[id].bugTotal = [];
                result[id].featureTotal = [];
                result[id].name = label;
              }else{
                //统计bug数量；
                var bugTotal = [];
                var featureTotal = [];
                result[id] ={};
                for(var j=0;j<group.length;j++){
                  var issue = group[j];
                  if(_.indexOf(issue.labels, 'BUG') !==-1){
                    bugTotal.push(issue);
                  };
                  if(_.indexOf(issue.labels, 'FEATURE')!==-1){
                    featureTotal.push(issue);
                  };
                };//for end
                result[id].issuesTotal = group.length;
                result[id].name = label;
                result[id].bugTotal = bugTotal;
                result[id].featureTotal = featureTotal;
              };//end else
            };
            return result;
          }
        };
        return results;
      };//getReportData End 结束;

      //getPersonalReportData 开始;
      function getPersonalReportData(data){
        console.log('personnal',data);
        var record = angular.copy(data);
        var result = {};
        var issues = [];
        //合并所有项目的issue；
        _.each(record,function(array){
          issues = _(issues).concat(array).value();
        });
        var closed = _.groupBy(issues,'state').closed;
        //分组计算;
        _.each(closed,function(issue){
          //获取issues 的 姓名 和id;
          try{
            var name = issue.assignee.name;
          }catch(error){
            var name = issue.author.name;
          }
          try{
            var id = issue.assignee.id;
          }catch(error){
            var id = issue.author.id;
          }
          //开始判断数据;
          if(!result[id]){
            result[id] = {};
            result[id].issuesTotal = 0;
            result[id].bugTotal = [];
            result[id].featureTotal = [];
            result[id].name = name;
          }; //初始化数据结束

          result[id].issuesTotal = result[id].issuesTotal + 1;
          if(_.indexOf(issue.labels, 'bug') !==-1 && issue.state == 'closed'){
              result[id].bugTotal.push(issue);
          };
          if(_.indexOf(issue.labels, 'feature')!==-1 && issue.state == 'closed'){
              result[id].featureTotal.push(issue);
          };
        });//计算结束；
        return result;
      };

      //getVersionData 开始;
      function getVersionData(data){
        var data = angular.copy(data);
        var results = {};
        //遍历生成各项目统计数据;
        for(var key in data){
          var ProjectIssues = data[key];
          dealWith(ProjectIssues,key);
        };

        return results;
        //数据统计函数
        function dealWith(ProjectIssues,project_id){
          //根据状态分为 closed opened reopen
          var record = _.groupBy(ProjectIssues,'state');
          if(!record.closed){
            return;
          };
          //准备开始统计
          var record = record.closed;
          //分为 BUG 和 FEATURE 2组;
          var record = _.groupBy(record,function(issue){
            if(_.indexOf(issue.labels, 'BUG')!==-1){
              return 'BUG';
            }
            return 'FEATURE';
          });
          results[project_id] = record;
        };

      };//getReportData End 结束;

    };//issueSearchService();

})();
