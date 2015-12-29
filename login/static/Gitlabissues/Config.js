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
    }


})();
