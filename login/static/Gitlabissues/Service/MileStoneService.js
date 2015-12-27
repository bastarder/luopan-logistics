(function() {
  'use strict';

  //依赖：1.TokenService（身份码获取服务）
  //#

  angular
    .module('GitLabApp')
    .service('MileStoneService',MileStoneService)

    MileStoneService.$inject = ['$q','$http','TokenService','GitLabUrlConfig'];

    function MileStoneService($q,$http,TokenService,GitLabUrlConfig){
      //取 版本号；
      this.GetMileStones = GetM;

      function GetM(){
        var deferred = $q.defer();
        var config = new GitLabUrlConfig();
        var times = 0; //如果token获取失败,再次获取,重复5次；
        var putOutMile =[16,15,13]; //过滤id为这些的milestone 理由：只是用来参照格式的,没必要展示；
        var project = [
          {id:1,name:'客户系统'},
          {id:2,name:'客服系统'},
          {id:8,name:'后台系统'}
        ]//配置需要搜索的工程;
        var result = [];

        TokenService.GetToken().then(GetMileStone)

        function GetMileStone(token) {
          if(!token){
            TokenService.GetToken().then(GetMileStone)
            times = times +1;
            if(times > 5){
              alert('连续5次获得token失败!');
              deferred.reject('error： token get 5 times；')
            }
          }else{
            for(var i= 0;i<project.length;i++){
              var id = project[i].id;
              var parm = {
                private_token:token
              };
              console.log('开始获取所有版本号...');
              $http.get(config.url+'projects/'+id+'/milestones',{params:parm})
                .success(SuccessGetMileStone)
                function SuccessGetMileStone(data){
                  console.log('版本号获取成功,开始处理筛选不需要的版本号...');
                  var resultId = data[0].project_id ;
                  result.push(angular.copy(data));
                  if(result.length == project.length){
                    for(var i=0;i<result.length;i++){
                      for(var j=0;j<result[i].length;j++){
                        if(putOutMile.indexOf(result[i][j].id) !== -1){
                          result[i].splice(j,1);
                        };
                      };
                    };
                    console.log('版本号处理完毕...');
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
