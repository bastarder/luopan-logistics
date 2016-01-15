(function() {
  'use strict';

  //@
  //#

  angular
    .module('GitLabApp')

    //Git Lab 接口地址配置
    .constant('UrlConfig',{
      api:'http://180.97.80.177:8087/api/v3/'
    })

    //需要展示的工程ID
    .constant('NEED_PROJECT',[
      1,2,8
    ])

    //不需要展示的mileStone ID,用于过滤mileStone;
    .constant('DONT_NEED_MILESTONE',[
      13,15,16
    ])

    //报表生成配置;
    .constant('REPORT_GROUP',[
      '👿机票组','👿酒店组','👿基础组','👿客服组'
    ])

    //跳转到指定页面
    .constant('TO_ISSUE_PAGE',{
      url:'http://180.97.80.177:8087/'
    })

})();
