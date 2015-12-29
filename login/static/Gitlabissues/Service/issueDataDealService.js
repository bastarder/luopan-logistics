(function() {
  'use strict';

  //依赖：
  //#

  angular
    .module('GitLabApp')
    .service('issueDataDealService',issueDataDealService)

    issueDataDealService.$inject = ['$q'];

    function issueDataDealService($q){

      this.Deal = issueDeal;

      function issueDeal(issues){
        console.log('开始处理issues数据...');
        var results = {};
        var issues = angular.copy(issues);
        //issues为 1 2 8 项目 所有符合milestone的issues
        //数据处理函数
        function dataPick(closed){
          var labels = ['👿机票组','👿酒店组','👿基础组','👿客服组']
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
              result[id].bugTotal = 0;
              result[id].featureTotal = 0;
              result[id].name = label;
            }else{
              //统计bug数量；
              var bugTotal = 0;
              var featureTotal = 0;
              result[id] ={};
              for(var j=0;j<group.length;j++){
                var issue = group[j];
                if(_.indexOf(issue.labels, 'bug') !==-1){
                  bugTotal = bugTotal + 1;
                };
                if(_.indexOf(issue.labels, 'feature')!==-1){
                  featureTotal = featureTotal + 1;
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
        //客户系统数据处理
        if(issues[1]){
          console.log('处理[客户系统]数据中...');
          var record = angular.copy(issues[1]);
          var record = _.groupBy(record,'state');
          var opened = record['opened'];
          var closed = record['closed'];
          var customer = dataPick(closed);
          results['客户系统'] = customer;
          console.log('客户前台统计:',customer)
        };

        //客服系统数据处理
        if(issues[2]){
          console.log('处理[客服系统]数据中...');
          var record = angular.copy(issues[2]);
          var record = _.groupBy(record,'state');
          var opened = record['opened'];
          var closed = record['closed'];
          var customerService = {};
          if(!closed){
            customerService[0] ={};
            customerService[0].issuesTotal = 0;
            customerService[0].bugTotal = 0;
            customerService[0].featureTotal = 0;
          }else{
            var bugTotal = 0;
            var featureTotal = 0;
            customerService[0] ={};
            for(var j=0;j<closed.length;j++){
              var issue = closed[j];
              if(_.indexOf(issue.labels, 'bug') !==-1){
                bugTotal = bugTotal + 1;
              };
              if(_.indexOf(issue.labels, 'feature')!==-1){
                featureTotal = featureTotal + 1;
              };
            };//for end
            customerService[0].issuesTotal = closed.length;
            customerService[0].bugTotal = bugTotal;
            customerService[0].featureTotal = featureTotal;
            results['客服系统'] = customerService;
            console.log('客服系统结果：',customerService)
          };
        };

        //后台系统数据处理
        if(issues[8]){
          console.log('处理[后台系统]数据中...')
          var record = angular.copy(issues[8]);
          var record = _.groupBy(record,'state');
          var opened = record['opened'];
          var closed = record['closed'];
          var result = [];
          var backSystem = dataPick(closed);
          results['后台'] = backSystem;
          console.log('后台系统结果:',backSystem)
        };

        //个人汇总数据处理
        if(issues){
          console.log('开始汇总个人数据...')
          var personName = [];
          var personal = {};
          for(var x in issues){
            var re = issues[x];
            for(var i=0;i<re.length;i++){
              var issue = re[i];
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

              if(_.indexOf(personName,name)==-1){
                personName.push(name);
                personal[id]={
                  issuesTotal:0,
                  featureTotal:0,
                  bugTotal:0
                };
                personal[id].name = name;
              };

              if(_.indexOf(issue.labels, 'bug') !==-1 && issue.state == 'closed'){
                personal[id].bugTotal = personal[id].bugTotal + 1;
                personal[id].issuesTotal = personal[id].issuesTotal + 1;
              };
              if(_.indexOf(issue.labels, 'feature')!==-1 && issue.state == 'closed'){
                personal[id].featureTotal = personal[id].featureTotal + 1;
                personal[id].issuesTotal = personal[id].issuesTotal + 1;
              };
            };
          };
          results['个人统计'] = personal;
          console.log('个人统计结果:',personal);
        };
        console.log('Done! 数据全部处理结束--> 成功生成报表',results);
        return results;

      };//issueDeal();

    };//issueSearchService();

})();
