'use strict';

angular.module('GitLabApp',['LocalStorageModule','isteven-multi-select','ngAnimate','cgBusy'])
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
      if(!value){
        return ;
      }
      return config[value.toString()];
    };
  })
  .filter('toIssuePage',function(){
    return function(value){
      var config = {
        '1':'webfront/customer',
        '2':'webfront/customer-service',
        '8':'jiketravel_server/server'
      };
      if(!value){
        return ;
      }
      return config[value.toString()];
    };
  })
  .filter('date2cn', function($filter){
  var func = $filter('date');
  return function(input, format, timeZone){
    return func(input, format, timeZone || '+0800');
  };
})
