(function(window){

	customRule = {
			
		/**
		 * @desc 校验许可机关是否在下拉框中存在（因为是可选可输）
		 */
		licanthCheck:function(value){
			var licanth = Torch.dict.getList('DFCM01').map(function(item){
				return item.text;
			});
			for( var i = 0 ; i < licanth.length ; i++ ){
				if(licanth[i] == value){
					return this._getSuccessResult();
				}
			}
			return this._getFailResult("输入的许可机关不存在");
		},	
		/**
		 * @desc 校验许可文件名称是否在下拉框中存在（因为是可选可输）
		 */
		licnameCheck:function(value){
			 //许可文件名称下拉框
            var licname = Torch.dict.getList('DFCPCA25').map(function(item){
				return item.text;
			});
            for( var i = 0 ; i < licname.length ; i++ ){
            	if(licname[i] == value){
					return this._getSuccessResult();
				}
			}
			return this._getFailResult("输入的许可文件名称不存在");
		},	
			
		/**
		 * @desc 校验移动电话或者座机号
		 */
		contactNumber:function(value){
			return this.render(value, 'mobile|telephone');
		},
		/**
		 * @desc 校验确认密码是否相同
		 */
		passwordCheck:function(value){
			return this._getFailResult("输入的密码不一致");
		},
		/**
		 * @desc 校验登录用户名的特殊字符
		 */
		loginCheck:function(value){

			var pattern=/[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;
			if(pattern.test(value)){
				return this._getFailResult("请输入有效字符");
			}else{
				return this._getSuccessResult();
			}
		},

		/**
		 * @desc 经营期限校验，可以是“长期”或数字 
		 */
		 operateTerm: function(value){
			 if(value == '长期'){
				//
				return this._getSuccessResult();
			 }
			 return this.render(value, 'numberPlusInt;contrast:0,999');
		 }, 
		 /**
		  * @desc 校验提交的份数是否在规定范围内
		  * 
		  * */
	     customPages:function(value,params){
	    		var length = value ? value.length : 0;
	    		if(params.length == 1){
	    			charLength = params[0];
	    			if(length != charLength){
	    				return this._getFailResult("份数为" + charLength );
	    			}
	    		}else if(params.length == 2){
	    			charFrom = params[0];
	    			charTo = params[1];
	    			if(parseInt(value) <parseInt(charFrom) || parseInt(value) >parseInt(charTo)){
	    				return  this._getFailResult("份数在"+charFrom+"和"+charTo+"之间");
	    			}
	    		}
	    		return this._getSuccessResult();
	    	
	        }
	}
	
	Torch.lib('customRule', function(){
		return customRule;
	});
	
})(window);