(function() {
  'use strict';

  //@
  //#

  angular
    .module('GitLabApp')
    .controller('GitLabController',GitLabController)

    GitLabController.$inject = ['$scope','MileStoneService','TokenService','issueSearchService','issueDataDealService','localStorageService'];

    function GitLabController($scope,MileStoneService,TokenService,issueSearchService,issueDataDealService,localStorageService) {
      var vm = this;
      vm.data = null; //周报表数据统计最终结果；
      vm.VersionIssues = null; //版本更新详情统计；
      vm.remenberUsername = true;
      vm.GetMileStones = GetMileStones; //获得版本号
      vm.searchNumber = searchNumber; //生成报表
      vm.searchVersion = searchVersion;
      vm.selectMile = {};
      vm.isLogin = false;
      vm.onLogin = false;
      //数据初始化；
      vm.email = localStorageService.get('email')||null;
      vm.password = null;
      var token = localStorageService.get('pravite_token');
      if(token){
        vm.isLogin = true;
        GetMileStones();
      };

      vm.login = login;
      vm.signOut = signOut;

      function login(){
        vm.onLogin = true;
        TokenService.GetToken(vm.email,vm.password)
        .then(function(data) {
          vm.isLogin = true;
          if(vm.remenberUsername){
            localStorageService.set('email',vm.email);
          }else{
            localStorageService.remove('email');
          }
          GetMileStones();
          vm.onLogin = false;
        })
        .catch(function(data) {
          alert('登陆失败！');
          vm.onLogin = false;
          return ;
        })
      }

      function signOut(){
        localStorageService.remove('pravite_token');
        vm.isLogin = false;
        vm.email = localStorageService.get('email')||null;
        vm.password = null;
      }

      function GetMileStones(argument) {
        MileStoneService.GetMileStones()
          .then(SuccessGetM);
        //回调函数；
        function SuccessGetM(data){
          //data: [array,array]
          vm.mileStone = angular.copy(data);
        }

      }
      function searchNumber() {
        //清空旧数据
        vm.data = null;
        vm.VersionIssues = null;
        if(vm.selectMile[1].length==0&&vm.selectMile[2].length==0&&vm.selectMile[8].length==0){
          alert('请选择版本号');
          return ;
        }
        document.getElementById('search').innerHTML="报表生成中...";
        issueSearchService.GetIssues(vm.selectMile)
          .then(function(data){
            vm.data = issueDataDealService.Deal(data);
          })
      }
      function searchVersion(){
        for(var i in vm.selectMile){
          if(vm.selectMile[i].length>1){
            alert('生成BUG更新页面的时候只能每项工程选择一个版本号！');
            return ;
          }
        };
        if(vm.selectMile[1].length==0&&vm.selectMile[2].length==0&&vm.selectMile[8].length==0){
          alert('请选择版本号');
          return ;
        }
        //清空旧数据
        vm.data = null;
        vm.VersionIssues = null;
        document.getElementById('searchIssues').innerHTML="页面生成中...";
        issueSearchService.GetIssuesForMore(vm.selectMile)
          .then(function(data){
            vm.VersionIssues = angular.copy(data);
          })
      };
      $scope.$watch('vm.data',function(n,o){
        document.getElementById('search').innerHTML="生成报表";
      })
      $scope.$watch('vm.VersionIssues',function(n,o){
        document.getElementById('searchIssues').innerHTML="生成Bug更新页面";
      })
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
