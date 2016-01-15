(function() {
  'use strict';

  //@
  //#

  angular
    .module('GitLabApp')
    .controller('GitLabController',GitLabController)

    GitLabController.$inject = ['$scope','localStorageService','UrlConfig','loginService','mileStoneService','issueByMileStoneService','issueReportService','DONT_NEED_MILESTONE','TO_ISSUE_PAGE'];

    function GitLabController($scope,localStorageService,UrlConfig,loginService,mileStoneService,issueByMileStoneService,issueReportService,DONT_NEED_MILESTONE,TO_ISSUE_PAGE) {
      var vm = this;
      vm.selectMile = {}; //已选版本号;
      vm.toIssueUrl = TO_ISSUE_PAGE //跳转到指定issue;
      vm.MileStone = null; //获取到得版本号;
      vm.rememberUsername = true; //是否记住账号;
      vm.login = login; //登陆;
      vm.logOut = logOut; //退出登陆;
      vm.createReport = createReport;
      vm.reportData = null;
      vm.createVersion = createVersion;
      vm.versionData = null;
      vm.isLogin = false; //用于判断是否登陆;
      vm.versionOrder = versionOrder;//更新页面BUG分类;
      vm.param = {    //初始化登陆参数；
        userName: null,
        password: null
      };
      var token = loginService.getToken(); //判断是否登陆;

      if(token){
        vm.isLogin = true;
        vm.UserData = localStorageService.get('UserData');
        getMileStone();
      };

      //登陆函数;
      function login(){
        var FormIsTrue = loginFormIsTrue();
        if(!FormIsTrue){
          return ;
        }
        $('#login').html('登陆中...');
        loginService.login(vm.param)
          .then(LoginSuccess)
          .catch(LoginFaild)
          //登陆成功处理
          function LoginSuccess(response){
            console.log('success',response);
            vm.UserData = localStorageService.get('UserData');
            vm.isLogin = true;
            if(vm.rememberUsername){
              localStorageService.set('userName',vm.param.userName||null  );
            };
            getMileStone();
          };
          //登陆失败处理
          function LoginFaild(response){
            console.log('faild',response);
            $('#login').html('登陆');
            alert('账号或密码错误!登录失败!');
          };
        }

      //退出登陆函数;
      function logOut(){
        localStorageService.remove('UserData');
        vm.isLogin = false;
        vm.param = {    //初始化登陆参数；
          userName: localStorageService.get('userName')||null,
          password: null
        };
      };

      //获取版本号函数;
      function getMileStone(){
        mileStoneService.getMileStone()
        .then(setMileStone);
        //初始化可选的milestone
        function setMileStone(response){
          var result = angular.copy(response);
          //过滤不需要的milestone列表
          for(var i in result){
              for(var j in result[i]){
                if(DONT_NEED_MILESTONE.indexOf(result[i][j].id) !== -1){
                  result[i].splice(j,1);
                };
               }
           };//过滤 End；
           vm.MileStone = result; //展示MileStone;
        };
      };
      //创建Bug页面函数
      function createVersion(){
        //清空数据；
        vm.versionData = null;
        vm.reportData = null;
        var MileStoneTrue = isSelectMileStoneBlank();
        if(!MileStoneTrue){
          return;
        };
        //开始生成；
        $('#createVersion').html('生成中...');
        issueByMileStoneService.getIssues(vm.selectMile).then(function(response){
          var versionData = issueReportService.getVersionData(response);
          console.log('versionData',versionData);
          var times = 0;
          for(var i in versionData){
            times = times + 1;
          };
          if(times<=0){
            alert('生成成功,但结果为空,可能是您选择版本号本身还没被创建issues,或者所有issues均未满足条件');
          };
          vm.versionData = versionData;
          $('#createVersion').html('生成更新页');
        })
      };
      //创建报表页面函数
      function createReport(){
        //清空数据；
        vm.versionData = null;
        vm.reportData = null;
        var MileStoneTrue = isSelectMileStoneBlank();
        if(!MileStoneTrue){
          return;
        };
        //开始生成；
        $('#createReport').html('生成中...');
        issueByMileStoneService.getIssues(vm.selectMile).then(function(response){
          var reportData ={}
          reportData.project = issueReportService.getReportData(response);
          reportData.personnal = issueReportService.getPersonalReportData(response);
          console.log('ReportData',reportData);
          var times = 0;
          _.each(reportData,function(n){
            for(var i in n){
              times = times + 1;
            };
          });
          if(times<=0){
            alert('生成成功,但结果为空,可能是您选择版本号本身还没被创建issues,或者所有issues均未满足条件');
          };
          vm.reportData = reportData;
          $('#createReport').html('生成报表页');
        })
      };
      //查看账号密码是否输入完整函数
      function loginFormIsTrue(){
        if(vm.param.userName==null||vm.param.password==null){
          alert('账号或密码为空!');
          return false;
        };
        return true;
      };
      //判断版本号是否选择正确;
      function isSelectMileStoneBlank(){
        var truly = false;
        _.each(vm.selectMile,function(n){
          if(n.length>0){
            truly = true;
          };
        });
        if(!truly){
          alert('请选择版本号!');
        };
        return truly;
      };
      function versionOrder(issue){
        var labels = issue.labels;
        var deleteLabels = ['BUG','FEATURE','👿机票组','👿酒店组','👿基础组','👿客服组'];
        var label = null;
        if(!labels){
          return null;
        }
        for(var i=0;i<labels.length;i++){
          if(_.indexOf(deleteLabels,labels[i])===-1){
            label = labels[i];
            break;
          };
        };
        return label;
      };
      //配置select文字；
      vm.localLang = {
          selectAll       : "全选",
          selectNone      : "全部取消",
          reset           : "重置",
          search          : "输入并搜索",
          nothingSelected : "请选择版本号"
      }

    };//controller End

})();
