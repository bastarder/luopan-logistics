'use strict';

angular.module('GitLabApp',['LocalStorageModule','isteven-multi-select'])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('demoPrefix');
  }])
  .filter('projectName',function(){
    return function(value){
      var config = {
        '1':'客户系统',
        '2':'客服系统',
        '8':'后台'
      };
      return config[value.toString()];
    };
  })
