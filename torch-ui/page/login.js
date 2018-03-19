(function(){
angular.module('app', ['common'])
.controller('LoginController', LoginController);

	//注入服务
    LoginController.$inject = ['dataService','$scope','$cacheFactory']
    
    function LoginController(dataService,$scope,$cacheFactory){
        var vm = this;



        //默认用户信息
        vm.loginUserForm = {
            loginname:'',
            loginpwd:''
        }
        
        //登陆方法
        vm.login = login;
        //通过回车提交
        vm.enterEvent = enterEvent;

        //登陆方法
        function login(){
            var obj = {
                url:'/torch/service.do?fid=loginQuery',
                param:{
                    //"loginUserForm": vm.loginUserForm
                    "loginUserForm": {
                        loginname:$('#loginname').val(),
                        loginpwd:$('#loginpwd').val()
                    }
                }
            }
            Torch.dataSubmit(obj).then(
	            function(data){
	            	Torch.redirect('../../app/page/frame.html');
	            }
            );
        }

        //通过回车提交
        function enterEvent(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                login();
            }
        }
    }
})();
