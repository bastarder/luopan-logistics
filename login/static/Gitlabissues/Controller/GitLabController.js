(function() {
  'use strict';

  //@
  //#

  angular
    .module('GitLabApp')
    .controller('GitLabController',GitLabController)

    GitLabController.$inject = ['$scope','MileStoneService','issueSearchService','issueDataDealService'];

    function GitLabController($scope,MileStoneService,issueSearchService,issueDataDealService) {
      var vm = this;
      vm.data = [];
      vm.tok = tok;

      function tok() {
        issueSearchService.GetIssues(vm.selectMile)
          .then(function(data){
            console.log("controller:",data);
            vm.data = issueDataDealService.Deal(data);
          })
      }
      //----正式代码------//
      vm.localLang = {
          selectAll       : "全选",
          selectNone      : "全部取消",
          reset           : "重置",
          search          : "输入并搜索",
          nothingSelected : "请选择版本号"
      }
      vm.GetMileStones = GetMileStones;
      vm.selectMile = {};
      //数据初始化；
      GetMileStones();

      //vm.GetMileStones
      function GetMileStones(argument) {
        MileStoneService.GetMileStones()
          .then(SuccessGetM);
        //回调函数；
        function SuccessGetM(data){
          //data: [array,array]
          vm.mileStone = angular.copy(data);
        }

      }


    };//controller End

})();
