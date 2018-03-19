/**
 * @desc 上传组件
 *  ngf-multiple="true"  上传多选 默认为false
    ngf-keep="true" or "false"`：默认为false,保存着以前ng-model的值和追加的新文件 
    ngf-keep-distinct="true" or "false"`：默认为false，如果ngf-keep设置了的话，则删除重复的选定文件 
    ngf-select  获取上传文件属性 
    ngf-max-size="20MB"  控制文件大小 
    ngf-change="fileSelected($files, $file, $event, $rejectedFiles)"：当文件被选择或移除时调用
    ngf-pattern="image/*" accept="image/*"  判断上传文件 application
 * 
 * fileData: 传给后台的参数，设置传输文件的条件
 * fileShow: true显示上传功能以及文件的回显 false仅显示上传文件的回显
 *
 * 
 * <file-upload file-data='vm.data' 
 * 				file-show='true'></file-upload>
 *	vm.data = {
		 fileName:'',
		 filePath:'',
		 fileState:false,//上传状态  true表示上传成功
		 moduleId:'dq', //moduleId：  dq 数据质量  ser_adv 高级查询  std标准
		 fileContent:[], //上传文件的回显数据  [{name:'',fileid:''},{name:'',fileid:''}]
		 multipleNum:'', //multipleNum:上传限制的条数
		 fileType:'' //fileType：上传文件类型  image 图片    application 文本   默认不限制类型
	 }
 *
 *  去掉上传按钮 留着备用，防止以后需要<div class="col-xs-2"><button ng-click="submit()" class="btn btn-primary btn-sm" style="width:100%;">上传</button></div>\
 */
angular.module('common.fileupload').directive('fileUpload', function($filter){
	return {
		restrict: 'E',
		scope: {
			fileData:'=',
			fileShow:'=',
			fileContent:'='
		},
		template: '\
			<div class="fileUpload">\
				<div class="col-xs-12" ng-show="fileShow">\
					<input type="file" ngf-keep="false" ngf-change="fileSelected($files, $file, $event, $rejectedFiles)" ngf-select ng-model="file" ngf-multiple="true" ngf-max-size="20MB" style="display:inline-block;width:100%;border-radius: 3px;"/>\
				</div>\
				<div class="col-xs-12">\
					<ul><li ng-repeat="file in fileData.fileContent"><span ng-bind="file.name" ng-click="download(file.fileId)"></span> <span ng-bind="file.progress"></span> <span ng-click="deleteFun(file.fileId,$index)" class="glyphicon glyphicon-remove"></span></li></ul>\
				</div>\
			</div>\
			',
		controller: function($scope,$filter,$timeout,Upload){
			//初始化显示容器
			$scope.fileData.fileContent = [];
			//删除
			$scope.deleteFun = function(fileId,index){
				var obj = {
	                url:'/file/deletefile.do?fileId='+fileId
	            };
	            Torch.dataSubmit(obj).then(function(data){    
	            	if(data.msg == 'success'){
	            		Torch.info('删除成功');
	            		$scope.fileData.fileContent.splice(index,1);
	            	}else{
	            		Torch.info('删除失败','danger');
	            	}
	            });
			} 
			$scope.download = function(fileId){
				var url = '/file/download.do?fileId='+fileId;
	         	window.open(url);
			}
			//选中文件的时候触发的方法
			$scope.fileSelected = function(){
				for(var i = 0 ; i < $scope.file.length ; i++){
					if($scope.file[i].type.indexOf($scope.fileData.fileType) == -1 && $scope.fileData.fileType){
						Torch.info('选中文件中不符合指定上传类型');
						return
					}
				}
				if($scope.file.length > 0){
					$scope.upload($scope.file);
				}
			}
            //上传方法
            $scope.upload = function (file) {
                Upload.upload({
                    //服务端接收
                    url: '/file/upload.do?moduleId='+$scope.fileData.moduleId,
                    //上传的同时带的参数
                    data: {},
                    file: file
                }).progress(function (evt) {
                    //进度条
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    /*$scope.fileContent = $scope.fileContent.map(function (item,index,input) {
                    	if(progressPercentage == '100'){
                    		item.progress = '';
                    	}else{
                    		item.progress = progressPercentage + '%';
                    	}
    				     return item;
    				})*/
                }).success(function (data, status, headers, config) {
                    //上传成功
                    $scope.fileData.fileName = data.fileName
                    $scope.fileData.filePath = data.filePath
                    $scope.fileData.fileId = data.fileId
                    $scope.fileData.fileState = true//上传状态  true表示上传成功
                    $scope.fileData.data = data;
                    for(var i = 0 ; i < data.length ; i++){
                    	$scope.fileData.fileContent.push(data[i])
                    }
                    Torch.info('上传成功');
                }).error(function (data, status, headers, config) {
                    //上传失败
                    Torch.info('上传失败','danger');
                });
            };
		},
		link: function(scope, ele, attrs){
			
		}
				
	}
});