/**
 * @desc 弹出框服务
 * @property info Function (content, type)
 * content: 提示框的内容
 * type: 提示框的类型 'info' 'success' 'warning' 'danger'
 * @example Torch.info('保存成功')
 * 
 * @property alert Function (content, ensure)
 * content: 弹出框的内容
 * ensure: 弹出框确定后的回调
 * @example Torch.alert('删除的数据不存在', queryFunction)
 * 
 * @property confirm Function (content, ensure, cancel)
 * content: 对话框的内容
 * ensure: 对话框确定后的回调
 * cancel: 对话框取消掉的回调
 * @example Torch.confirm('提交后数据不可更改，是否确认提交？', submitFunction, cancelFunction)
 * 
 * @property openwin Function (config)
 * @param config Object 弹出框的配置文件
 * @property content 弹出框的内容
 * @property url 弹出框的路径
 * @property title 弹出框的标题
 * @property size 弹出框的大小 sm lg md
 * @property param 弹出框的传参，可以传对象
 * @return Promise 返回一个promise对象，关闭弹窗调用reject方法，保存调用resolve方法
 * @example 
 * var win = Torch.openwin(config)
 * win.then(function(){
 * 		console.log('save');
 * },function(){
 * 		console.log('cancel');
 * })
 * 
 * @property loading Function ()
 * @return object 返回一个有close方法的对象，调用close方法关闭loading
 * @example 
 * var loading = Torch.loading()
 * loading.close()
 * 
 */
angular.module('common.modal').provider('modalService', modalService);

function modalService(){
	//提示框的配置信息
	var infoConfig = {
    	timeout: 2000
    };
	
	//弹出框的配置信息
	var alertConfig = {
    	title: '确认信息',
    	ensureText: '确认'
    };
    
    //confirm配置属性
    var confirmConfig = {
    	title: '确认信息',
    	ensureText: '确认',
    	cancelText: '取消'
    };
    
    this.setInfoConfig = setInfoConfig;
    this.setAlertConfig = setAlertConfig;
    this.setConfirmConfig = setConfirmConfig;
    this.$get = function($q, $uibModal){
    	
        	var modal = {
            		info: info,
            		alert: alert,
            		confirm: confirm,
            		openwin: openwin,
            		loading: loading
            	}
	        	Torch.lib('info', function(){return modal.info});
	        	Torch.lib('alert', function(){return modal.alert});
	        	Torch.lib('confirm', function(){return modal.confirm});
	        	Torch.lib('openwin', function(){return modal.openwin});
	        	Torch.lib('loading', function(){return modal.loading});
	        	
            	return modal;
            	
            	/**
            	 * @desc 提示框
            	 * @param content String 提示框的内容
            	 * @param type String 提示框的类型，默认值为 'info'，可选值为：'info' 'success' 'warning' 'danger' 
            	 */
            	function info(content, type){
        			type = type || 'info';
        			var timeout = infoConfig.timeout;
        			if(type!='success' && type!='warning' && type!='danger'){
        				type = 'info';
        			}
        			
        			var template = '<div uib-alert class="alert alert-' + (type || 'info') + '" close="close()"\
        			dismiss-on-timeout="' + timeout + '" >' + content + '</div>';
        			$uibModal.open({
        			      template: template,
        			      size: 'sm',
        			      windowClass: 'modal-info',
        			      controller: function($scope, $uibModalInstance) {
        			        $scope.close = function(){
        			        	$uibModalInstance.dismiss();
        			        }  
        			      }
        			});
        			
        		}
            	
            	/**
            	 * @desc 弹出框
            	 * @param content String 弹出框的内容
            	 * @param ensure Function 弹出框确定的回调方法
            	 */
            	function alert(content, ensure){
        			if(content){
        				var temp = '<div class="modal-header">\
		        						<h5 class="modal-title">' + alertConfig.title + '</h5>\
		        					</div>\
		        					<div class="modal-body">\
		        			            <p>' + (content||'') + '</p>\
		        			        </div>\
		        			        <div class="modal-footer">\
	        				            <button type="button" class="btn btn-primary btn-sm" ng-click="ensure()">' + alertConfig.ensureText + '</button>\
	        			            </div>';
        				$uibModal.open({
        				      template: temp,
        				      size: 'sm',
        				      backdrop: 'static',
        				      windowClass: 'modal-alert',
        				      resolve: {
        				          alertSet: function () {
        				            return {
        				            	ensure: ensure
        				            };
        				          }
        				        },
        				      controller: function($scope, $uibModalInstance, alertSet) {
        				        $scope.ensure = function(){
        				        	if(alertSet.ensure && alertSet.ensure instanceof Function){
        				        		alertSet.ensure();
        				        	}
        				        	$uibModalInstance.close();
        				        };
        				      }
        				    });
        			}
        		}
            	
            	/**
            	 * @desc 对话框
            	 * @param content String 对话框显示的内容
            	 * @param ensure Function 对话框确定的回掉方法
            	 * @param cancel Function 对话框取消的回掉方法
            	 */
            	function confirm(content, ensure, cancel){
        			if(content){
        				var temp = '<div class="modal-header">\
		        						<h5 class="modal-title">' + confirmConfig.title + '</h5>\
		        					</div>\
		        					<div class="modal-body">\
		        			            <p>' + content + '</p>\
		        			        </div>\
		        			        <div class="modal-footer">\
								            <button type="button" class="btn btn-primary" ng-click="ensure()">' + confirmConfig.ensureText + '</button>\
								            <button type="button" class="btn btn-default" ng-click="cancel()">' + confirmConfig.cancelText + '</button> \
		        				    <div>';
        				$uibModal.open({
        				      template: temp,
        				      size: 'sm',
        				      backdrop: 'static',
        				      windowClass: 'modal-confirm',
        				      resolve: {
        				          confirmSet: function () {
        				            return {
        				            	ensure: ensure,
        				            	cancel: cancel
        				            };
        				          }
        				        },
        				      controller: function($scope, $uibModalInstance, confirmSet) {
        				        $scope.ensure = function(){
        				        	if(confirmSet.ensure && confirmSet.ensure instanceof Function){
        				        		confirmSet.ensure();
        				        	}
        				        	$uibModalInstance.close();
        				        };
        				        
                                $scope.cancel = function(){
                                	if(confirmSet.cancel && confirmSet.cancel instanceof Function){
                                		confirmSet.cancel();
                                	}
        				        	$uibModalInstance.dismiss();
        				        }
        				      }// end of controller
        				    });
        			}
        		}
            	
            	
            	/**
            	 * @desc 弹出框的方法
            	 * @param config Object 弹出框的配置文件
            	 * @property content 弹出框的内容
            	 * @property url 弹出框的路径
            	 * @property title 弹出框的标题
            	 * @property size 弹出框的大小 sm lg md
            	 * @property param 传给弹出框的参数
            	 */
            	function openwin(config){
            		if(!config){
            			return;
            		}
            		if(!config.content && !config.url){
            			return;
            		}
            		
        			var modalInstance = $uibModal.open({
          		      ariaLabelledBy: 'modal-title',
          		      ariaDescribedBy: 'modal-body',
          		      backdrop: 'static',
          		      template: getModalTemplate,
          		      controller: function($scope, $uibModalInstance){
          		    	  	Torch.lib('modalInstance', $uibModalInstance);
          		    	  	if(config.param){
          		    	  		Torch.lib('modalParam', config.param);
          		    	  	}
          		    	  	
                			$scope.ensure = function (data) {
    	        			    $uibModalInstance.close(data);
    	        			};
    	
    	        			$scope.cancel = function () {
    	        				delete Torch.modalInstance;
    	        				delete Torch.modalParam;
    	        				$uibModalInstance.dismiss('cancel');
    	        			};
                		},
          		      size: config.size
          		    });
            		
            		function getModalTemplate(){
            			  if(config.content){
            				  var content = config.content;
	      		    	  }
	      		    	  if(config.url){
	      		    		  content = '<div class="embed-responsive embed-responsive-16by9">'+
	      		    		  				/*'<div ng-include="'+ config.url +'"</div>'+*/
										    '<iframe class="embed-responsive-item" ng-src="' + config.url + '"></iframe>'+
										'</div>';
	      		    	  }
	      		    	  
	      		    	  var t = '<div class="modal-header">'+
	      		    	  			'<button type="button" class="close" ng-click="cancel()"><span>&times;</span></button>'+
	      		    	  			'<h5 class="modal-title" id="modal-title">' + (config.title || '') + '</h5>'+
							      '</div>'+
							      '<div class="modal-body" id="modal-body">'+ content +
							      '</div>';
	      		    	  
	      		    	  return t;
            		}
            		return modalInstance.result;
            	}
            	
            	
            	/**
            	 * @desc 弹出loading的方法
            	 */
            	function loading(){
        			/*var template = '<div class="loader-line">\
				            			<div class="loader-line-wrap"><div class="loader-line"></div></div>\
				            			<div class="loader-line-wrap"><div class="loader-line"></div></div>\
				            			<div class="loader-line-wrap"><div class="loader-line"></div></div>\
				            			<div class="loader-line-wrap"><div class="loader-line"></div></div>\
				            			<div class="loader-line-wrap"><div class="loader-line"></div></div>\
				        			</div>';*/
        			var template = '<div class="loader-spinner">\
				        				<div class="loader-spinner-wrap loader-spinner-1">\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			</div>\
				        				<div class="loader-spinner-wrap loader-spinner-2">\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			</div>\
				        				<div class="loader-spinner-wrap loader-spinner-3">\
				        			    	<div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			    <div class="loader-circle"></div>\
					        			</div>\
				        			</div>';
					var modalInstance = $uibModal.open({
					      template: template,
					      size: 'sm',
					      backdrop: 'static',
					      windowClass: 'modal-loading'
					});
					return modalInstance;
            	}
            	
            	
            };
    
    
    /**
     * @desc 设置提示框的配置信息
     * @param config Object 提示信息的配置对象
     */
    function setInfoConfig(config){
    	if(config){
			this.infoConfig = $.extend( {}, this.infoConfig, config);
		}
    }
    
    /**
     * @desc 设置弹出框的配置信息
     * @param config Object 提示信息的配置对象
     */
    function setAlertConfig(config){
    	if(config){
			this.alertConfig = $.extend( {}, this.infoConfig, config);
		}
    }
    
    /**
     * @desc 设置对话框的配置信息
     * @param config Object 对话框的配置对象
     */
    function setConfirmConfig(config){
    	if(config){
			this.confirmConfig = $.extend( {}, this.confirmConfig, config);
		}
    }
    
}

