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
  .filter('mainLabel',function(){
    return function(value){
      var labels = value
      var deleteLabels = ['BUG','FEATURE','👿机票组','👿酒店组','👿基础组','👿客服组'];
      var dafaultLabels = ['👿机票组','👿酒店组','👿基础组','👿客服组'];
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
      if(!label){
        _.each(labels,function(la){
          if(_.indexOf(dafaultLabels,la)===-1){
            label =  ' ';
          }else{
            label = la;
          }
        });
      }
      return label;
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
