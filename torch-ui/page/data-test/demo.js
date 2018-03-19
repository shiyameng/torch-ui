(function(){
angular.module('app', ['common'])
.controller('TestController', TestController);

TestController.$inject = ['dataService', 'modalService'];

function TestController(dataService, modalService){
	var vm = this;
	vm.submit = submit;
	
	function submit(){
		var param = vm.param;
		if(!param){
			param = '';
		}
		param = param.replace(/\r\n/g,"");
		try
		{
			param = JSON.parse(param);
		}
		catch(err)
		{
		   alert('提交的参数格式错误');
		   return;
		}
		var fid = vm.fid;
		if(!fid){
			alert('请输入相应的fid');
			return;
		}
		var data = {
				url: '/torch/service.do' + fid,
				param: param
		}
		dataService.submit(data)
		.then(function(data){
			modalService.info('提交成功', 'success');
			vm.data = JSON.stringify(data);
		},function(){
			modalService.info('提交失败', 'danger');
		})
		
	}
}
})();
