(function() {
  'use strict';

  //@
  //#

  angular
    .module('GitLabApp')
    .constant('GitLabUrlConfig',GitLabUrlConfig)

    function GitLabUrlConfig(){
      this.ip = 'http://180.97.80.177:8087';
      this.local = '/api/v3/';
      this.url = this.ip + this.local;
      this.LoginParm = {
        'login':'钱杰',
        'email':'85257684@qq.com',
        'password':'85257684'
      }
    }


})();
