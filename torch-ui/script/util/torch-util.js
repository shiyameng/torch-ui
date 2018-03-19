/***********************************************/
//Torch 库初始化
/***********************************************/
(function(window){
	
	if(!window.Torch){
		window.Torch = {};
	}
	
	/**
	 * @desc 用来定义Torch的工具包
	 * @param name String 工具包的名称
	 * @param oLib Object 工具包对象，可以是{}或Function，如果是Function需要Function返回一个对象
	 */
	Torch.lib = function (name,oLib){
		if(!name){
			alert("name cannot be null.");
			return ;
		}
		if(oLib == null){
			alert("oLib cannot be null.");
			return ;
		}
		
		var parent;
		if(window.Torch){
			parent = window.Torch;
		}else{
			parent = {};
			window.Torch = parent;
		}
		var t = typeof oLib;
		if(t=='function'){
			parent[name] = oLib();
		}else{
			parent[name] = oLib;
		}
	};
	
	/**
	 * @desc 项目路径配置
	 * @example Torch.baseParth
	 */
	Torch.lib('baseParth', '');
	
	/**
	 * @desc 去掉字符串中前后的空格
	 * @example Torch.trim(' werety ')
	 */
	Torch.lib('trim',function(){
		return function(){
			  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		};
	});

	/**
	 * @desc 对form中的表单单个进行校验
	 * @param form String 表单的名称
	 * @example
	 * Torch.validateInput('apply')
	 .then(function(){校验过后的回调});
	 */
	Torch.lib('validateInput', function(){
		return function(inputName){

			var Input = $('input[name="'+ inputName +'"]');
			if(Input.length == 0){
				Input = $('textarea[name="'+ inputName +'"]');
			}
			if(Input.length == 0){
				Input = $('select[name="'+ inputName +'"]');
			}
			if(Input.length == 0){
				return
			}

			var rule = Input.attr('rule');
			if(rule && typeof rule != 'undefined' && rule != ''){
				Input.blur();
			}

			var promise = new Promise(function(resolve, reject) {
				setTimeout(function(){
					if( Input.parent().hasClass('input-group') ){
						var errorItem = Input.parent().parent().find('.error');
					}else{
						errorItem = Input.parent().find('.error');
					}

					if(errorItem && errorItem.length > 0){
						for(var i = 0, len = errorItem.length; i < len; i++){
							var item = $(errorItem[i]);
							if(item.hasClass('hidden')){
								continue;
							}
							else{
								reject('cancel');
							}
						}
						resolve('ok');
					}else{
						resolve('ok');
					}
				}, 1);
			});

			return promise;
		}
	});
	
	
	/**
	 * @desc 数据提交方法
	 * @example 
	 * torch.submit({
	 * 		url : '数据提交的路径',
	 * 		params : 数据提交的参数对象,
	 * 		async : 是否为异步提交,
	 * 		sucess : 数据提交成功后的回掉方法 ,
	 * 		error : 数据提交失败后的回掉方法
	 * });
	 */
	Torch.lib("submit",function(){
		function fn(obj){
			if(!obj){ alert('submit params cannot be null.') ;return ;}
			var url = obj.url || '';
			if(!url){ alert('submit params url cannot be null.') ;return ;}
			var params = obj.params || {};
			var async = (obj.async == true); 
			var successFn = obj.success ;
			var errorFn = obj.error ;
			
//			if(window.fetch){
//				var ret = fetch(url,{method: "POST",body:paramsString})
//				.then(function(response){ 	
//					if(response.ok){
//						response.json().then(function(data) {
//							if(data.msg){
//								  if(errorFn){
//									  errorFn(data.msg);
//								  }else{
//									  alert(data.msg);
//								  }
//								  return ;
//							}
//							successFn(data);
//					    });
//					}else{
//						alert("error:" + response.status);
//					}
//				});
//				return ret;
//			}
			if(window.$){
				$.ajax({
					  type: 'POST',
					  contentType:'text/plain;charset=UTF-8',
					  url: url,
					  async: async,
					  data: params,
					  dataType: 'json',
					  success: function(data){
						  if(data.msg){
							  if(errorFn){
								  errorFn(data.msg);
							  }else{
								  alert('加载数据出错：'+data.msg);
							  }
							  return ;
						  }
						  if(successFn && typeof successFn == 'function'){
							  successFn(data);
						  }
					  },
					  error: function(data){
						  console.log('请求失败');
					  }
				});
				return ;
			}
		}
		return fn;
	});	
	
	/**
	 * @desc 数据缓存的方法，如果浏览器支持sessionStorage，存在sessionStorage中
	 * @property put Function ('缓存的对象名',缓存的对象值) 存储一个对象
	 * @property get Function ('缓存的对象名') 得到一个缓存对象
	 */
	Torch.lib('cache',{
		put : function(key,value){
			
			if(window.sessionStorage){
				sessionStorage[key] = JSON.stringify(value);
			}
			if(!window.Torch){
				window.Torch = {};
			}
			if(!window.Torch._cacheData){
				window.Torch._cacheData = {};
			}
			window.Torch._cacheData[key] = value;
		},
		get : function(key){
			if(window.sessionStorage){
				var data = sessionStorage[key];
				if(!!data){
					try{
						data = JSON.parse(data);
					}
					catch(err){
						alert('代码集存储格式有误');
					}
				}
				return data;
			}
			if(!window.Torch){
				window.Torch = {};
				return null;
			}
			if(!window.Torch._cacheData){
				window.Torch._cacheData = {};
				return null;
			}
			data = window.Torch._cacheData[key];
			return data;
		}
	});
	
	
	/**
	 * @desc 代码集的工具包，得到省市县的代码集 
	 * @property getAll 得到所有省市县的代码集
	 * @property getOne(province, city) 得到某个省或市的代码集
	 * 
	 * @example Torch.city.getAll()
	 * @example Torch.city.getOne('150000') 得到内蒙古的代码集
	 * @example Torch.city.getOne('150000','150010') 得到内蒙古 包头的代码集
	 */
	Torch.lib('city', {

		getAll: function(){
			// 如果缓存中有，直接返回
			var list = Torch.cache.get('city');
			if(!!list){
				return list || [];
			}
			// 从服务器端请求
			var postObj = {
				url : Torch.baseParth + '/app/json/city.json',
				async: false,
				success: function(responseData){
					list = responseData;
					Torch.cache.put('city',list);
				}
			};
			Torch.submit(postObj);
			return list || [];
		},
		
		getOne: function(province, city){
			var all = this.getAll();
			if(province){
				var province = this.getChild(all, province);
			}
			if(city){
				var city = this.getChild(province, city);
			}else{
				return province;
			}
			return city;
		},
		
		getChild: function(parent, value){
			if(!parent){
				return [];
			}
			if(!value){
				return parent;
			}
			for(var i = 0, len = parent.length; i < len; i++){
				var item = parent[i];
				if(item.value == value){
					return item.child || [];
				}
			}
			return [];
		}
	});
	
	
	/**
	 * @desc 代码集的工具包，得到企业类型的树形的代码集
	 * @example Torch.enttype.getAll();
	 */
	Torch.lib('enttype', {

		getAll: function(){
			// 如果缓存中有，直接返回
			var list = Torch.cache.get('enttype');
			if(!!list){
				return list || [];
			}
			// 从服务器端请求
			var postObj = {
				url : Torch.baseParth + '/app/json/enttype.json',
				async: false,
				success: function(responseData){
					list = responseData;
					Torch.cache.put('enttype',list);
				}
			};
			Torch.submit(postObj);
			return list || [];
		}
	});
	
	/**
	 * @desc 代码集的工具包，得到全国登记机关的树形的代码集
	 * @example Torch.allregorg.getAll();
	 */
	Torch.lib('allregorg', {

		getAll: function(){
			// 如果缓存中有，直接返回
			var list = Torch.cache.get('allregorg');
			if(!!list){
				return list || [];
			}
			// 从服务器端请求
			var postObj = {
				url : Torch.baseParth + '/app/json/allregorg.json',
				async: false,
				success: function(responseData){
					list = responseData;
					Torch.cache.put('allregorg',list);
				}
			};
			Torch.submit(postObj);
			return list || [];
		}
	});
	
	
	/**
	 * @desc 关闭弹框的方法
	 * @param data Object 关闭弹框后为回掉方法传的参数
	 * @example Torch.closewin(data)
	 */
	Torch.lib('closewin', function(){
		return function(data){
			var modal = Torch.modalInstance;
			if(modal){
				delete Torch.modalInstance;
				delete Torch.modalParam;
			}
			if(!modal){
				modal = parent.Torch.modalInstance;
				if(modal){
					delete parent.Torch.modalInstance;
					delete parent.Torch.modalParam;
				}
			}
			if(modal){
				modal.close(data);
			}
		}
	});
	
	/**
	 * @desc 得到弹框的方法
	 * @example Torch.getWinParam()
	 */
	Torch.lib('getWinParam', function(){
		return function(){
			var modal = Torch.modalParam;
			if(!modal){
				modal = parent.Torch.modalParam;
			}
			return modal;
		}
	});
	

	/**
	 * @desc 页面跳转的方法
	 * @param url String 跳转的路径
	 * @example Torch.redirect(url)
	 */
	Torch.lib("redirect",function(){
		return function(url){
			if(url){
				url = encodeURI(url);
				window.location.href = url;
				return;
			}
		}
	});


	/**
	 * @desc 取url中的变量值
	 * @param url中的变量名
	 * @example Torch.getParam('endId')
	 */
	Torch.lib("getParam",function(){
		function getUrlParam(name) {
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
			var r = window.location.search.substr(1).match(reg); 
			if (r!=null) { 
			   return unescape(r[2]); 
			} 
			return null; 
		}
		return getUrlParam;
	});
	
	/**
	 * @desc 判断两个对象是否完全相等，对象中的属性的值也相等
	 * @param a Object 被比较的对象
	 * @param b Object 比较的对象
	 * @example Torch.isObjDepthEqual(a, b)
	 */
	Torch.lib('isObjDepthEqual', function(){
		return function (a, b) {
		    if(typeof a == 'number' && typeof b == 'number'){
		        return a == b
		    }
		    var aProps = Object.getOwnPropertyNames(a);
		    var bProps = Object.getOwnPropertyNames(b);
		 
		    if (aProps.length != bProps.length) {
		        return false;
		    }
		 
		    for (var i = 0; i < aProps.length; i++) {
		        var propName = aProps[i];
		        if(Object.prototype.toString(a[propName]) == '[Object Object]'||Object.prototype.toString(b[propName]) == '[Object Object]'){
		            return Torch.isObjDepthEqual(a[propName],b[propName]);
		        }
		        if (a[propName] !== b[propName]) {
		            return false;
		        }
		    }
		    return true;
		}
	});
	
	/**
	 * @desc 判断两个对象是否基本类型值完全相等，对象中的属性的值相等（不包括属性值为Object的值）
	 * @param a Object 被比较的对象
	 * @param b Object 比较的对象
	 * @example Torch.isObjDepthEqual(a, b)
	 */
	Torch.lib('isObjBasicEqual', function(){
		return function(a, b) {
		    if(typeof a == 'number' && typeof b == 'number'){
		        return a == b
		    }
		    var aProps = Object.getOwnPropertyNames(a);
		    var bProps = Object.getOwnPropertyNames(b);
		 
		    if (aProps.length != bProps.length) {
		        return false;
		    }
		 
		    for (var i = 0; i < aProps.length; i++) {
		        var propName = aProps[i];
		        if(Object.prototype.toString(a[propName]) != '[Object Object]' && Object.prototype.toString(b[propName]) != '[Object Object]'){
		        	if (a[propName] !== b[propName]) {
			            return false;
			        }
		        }
		    }
		    return true;
		}
	});
	
	/**
	 * @desc 判断B对象是否完全包含A对象中的基本类型，对象中的属性的值相等（不包括属性值为Object的值）
	 * @param a Object 被比较的对象
	 * @param b Object 比较的对象
	 * @example Torch.isObjMajorityEqual(a, b)
	 */
	Torch.lib('isObjMajorityEqual', function(){
		return function(a, b, expect) {
		    if(typeof a == 'number' && typeof b == 'number'){
		        return a == b
		    }
		    var aProps = Object.getOwnPropertyNames(a);
		    var bProps = Object.getOwnPropertyNames(b);
		 
		    for (var i = 0; i < aProps.length; i++) {
		        var propName = aProps[i];
		        if(!expect || expect.indexOf(propName) < 0){
		        	if(Object.prototype.toString(a[propName]) != '[Object Object]' && Object.prototype.toString(b[propName]) != '[Object Object]'){
			        	if (a[propName] !== b[propName]) {
				            return false;
				        }
			        }
		        }
		    }
		    return true;
		}
	});
	
	/**
	 * @desc 对form中的表单全部进行校验
	 * @param form String 表单的名称
	 * @example Torch.validateForm(formname)
	 * @example 
	 * Torch.validateForm('apply')
		.then(function(){校验过后的回调});
	 */
	Torch.lib('validateForm', function(){
		return function(formName){
			var form = $('ng-form[name="'+ formName +'"]');
			if(form.length == 0){
				form = $('form[name="'+ formName +'"]');
			}
			if(form && form.length == 1){
				var inputs = form.find('input');
				for(var i = 0, len = inputs.length; i < len; i++){
					var item = $(inputs[i]);
					var rule = item.attr('rule');
					if(rule && typeof rule != 'undefined' && rule != ''){
						item.blur();
					}
				}
				var textareas = form.find('textarea');
				for(var i = 0, len = textareas.length; i < len; i++){
					var item = $(textareas[i]);
					var rule = item.attr('rule');
					if(rule && typeof rule != 'undefined' && rule != ''){
						item.blur();
					}
				}
				var selects = form.find('select');
				for(var i = 0, len = selects.length; i < len; i++){
					var item = $(selects[i]);
					var rule = item.attr('rule');
					if(rule && typeof rule != 'undefined' && rule != ''){
						item.blur();
					}
				}
			}
			var promise = new Promise(function(resolve, reject) {
				setTimeout(function(){
					var errorItem = $('.error');
					if(errorItem && errorItem.length > 0){
						for(var i = 0, len = errorItem.length; i < len; i++){
							var item = $(errorItem[i]);
							if(item.hasClass('hidden')){
								continue;
							}else{
								reject('cancel');
							}
						}
						resolve('ok');
					}
					else{
						resolve('ok');
					}
				}, 1);
			});
			return promise;
		}
	});
	
	/**
	 * @desc 刷新最外层当前选中的tab页
	 * @example Torch.reloadTab()
	 */
	Torch.lib('reloadTab', function(){
		return function(){
			var tab = $('.tab-pane.active',top.document);
			if(tab && tab.length > 0){
				var iframe = tab.find('iframe');
				if(iframe && iframe.length > 0){
					iframe.attr('src', iframe.attr('src'));
				}
			}
			
		}
	});
	
	Torch.lib('tableCols',{
		/*
		 * 返回：
		 * 		{
		 * 			'name' : '汉族',
		 * 			'value' : '满族'
		 * 		}
		 */
		getName: function(val){
			list = this.getList();
			var ret = {};
			var _item ;
			
			for(var i=0, len=list.length ;i<len; ++i){
				if(list[i].value == val){
					return list[i].name
				}
			}
			return val;
		},
		/*
		 * 返回：
		 * 		[
		 * 			{text:'汉族',value:'01'} ,
		 * 			{text:'满族',value:'06'} 
		 * 		]
		 */
		getList: function(){
			// 如果缓存中有，直接返回
			var list = Torch.cache.get('tableCols');
			if(!!list){
				return list || [];
			}
			// 从服务器端请求
			var postObj = {
				url : Torch.baseParth + '/app/json/tableCols.json',
				async: false,
				success: function(responseData){
					list = responseData;
					Torch.cache.put('tableCols',list);
				}
			};
			Torch.submit(postObj);
			return list || [];
		}
	});
	
	/**
	 * @desc 代码集的工具包
	 * @property getList Function ('代码') 根据代码得到代码值组
	 * @preperty getText Function ('代码', '代码组中的某个代码') 得到代码组中某个代码对应的代码值
	 * 
	 * @example Torch.dict.getList('DFNMCA03')
	 * @example Torch.dict.getText('DFNMCA03','102102101')
	 */
	Torch.lib('dict',{
		/*
		 * 返回：
		 * 		{
		 * 			'01' : '汉族',
		 * 			'06' : '满族'
		 * 		}
		 */
		getMap: function(key){
			if(!key){
				return {};
			}
			if(Array.isArray(key)){
				var list = key;
			}else{
				list = this.getList(key);
			}
			
			if(!list){
				return {};
			}
			var ret = {};
			var _item ;
			
			for(var i=0, len=list.length ;i<len; ++i){
				_item = list[i];
				if(!_item){ continue; }
				if(!_item.value){ continue; }
				
				ret[_item.value] = _item.text;
			}
			return ret;
		},
		/*
		 * 返回：
		 * 		[
		 * 			{text:'汉族',value:'01'} ,
		 * 			{text:'满族',value:'06'} 
		 * 		]
		 */
		getList: function(key){
			if(!key){
				return [];
			}
			// 如果缓存中有，直接返回
			var list = Torch.cache.get('dict');
			if(!!list){
				return list[key] || [];
			}
			// 从服务器端请求
			var postObj = {
				url : Torch.baseParth + '/app/json/dict.json',
				async: false,
				success: function(responseData){
					list = responseData;
					Torch.cache.put('dict',list);
				}
			};
			Torch.submit(postObj);
			return list[key] || [];
		},
		getText: function(key,val){
			if(!key){
				return '';
			}
			if(!val){
				return '';
			}
			var dictMap = this.getMap(key);
			if(dictMap){
				var ret = dictMap[val];
				ret = ret || '';
				return ret;
			}else{
				return '';
			}
		},
		getValue: function(key, text){
			if(!key){
				return '';
			}
			if(!text){
				return '';
			}
			var dictList = this.getList(key);
			for(var i = 0, len = dictList.length; i < len; i++){
				var item = dictList[i];
				if(text == item.text){
					return item.value || '';
				}
			}
			return '';
		}
	});
	
	/**
	 * @desc 代码集的工具包，得到登记机关树形的代码集
	 * @example Torch.regorg.getAll();
	 */
	Torch.lib('regorg', {

		getAll: function(){
			// 如果缓存中有，直接返回
			var list = Torch.cache.get('regorg');
			if(!!list){
				return list || [];
			}
			// 从服务器端请求
			var postObj = {
				url : Torch.baseParth + '/app/json/regorg.json',
				async: false,
				success: function(responseData){
					list = responseData;
					Torch.cache.put('regorg',list);
				}
			};
			Torch.submit(postObj);
			return list || [];
		},
		getList: function(regcode){
			var allList = this.getAll();
			if(!allList){
				return [];
			}
			var retList = [];
			var map = {};
			map['root_'+regcode] = regcode;
			for(var i = 0;i<allList.length;++i){
				var item = allList[i] ;
				var itemId = item.id || '';
				if(map['root_'+itemId]){
					item.open = true;
					retList.push(item);
					map['item_'+itemId] = item;
					continue;
				}
				var itemPid = item.pid || '';
				if(map['item_'+itemPid]){
					retList.push(item);
					map['item_'+itemId] = item;
				}
			}
			return retList;
		}
	});
	
})(window);


