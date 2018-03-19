(function(window){
	/**
	 * @desc 表单校验 多个校验之间可以为 “且” 或 “或” 的关系
	 * 用 “;” 隔开为 “且” 的关系，用“|” 隔开为 “或” 的关系，不可同时存在 “且” 和 “或” 的关系
	 * @property must 必填项的校验
	 * @property length 长度的校验 length:2 长度必须为二 length:1,3 长度为1-3，包括1和3
	 * @property mobile 手机号的校验 
	 * @property telephone 座机号的校验
	 * @property email 电子邮箱的校验 
	 * @property currency 货币的校验
	 * @property url url的校验
	 * @property postal 邮政编码的校验
	 * @property qq qq号的校验
	 * @property idcard 身份证号的校验
	 * @property number 数字的校验
	 * @property numberInt 整数的校验
	 * @property numberFloat 浮点数
	 * @property numberPlusFloat 非负浮点数
	 * @property numberPlusInt 正整数
	 * @property pass 密码（以字母开头，长度在6-18之间，只能包含字符、数字和下划线）
	 * @property numorchar 数字或字符
	 * @property numorenglish 数字或英文字符
	 * @property character 字符校验（中文或者英文）
	 * @property chinese 中文检验
	 * @property english 英文校验
	 * @property chineseandbd 中文+中文字符校验
	 * @property contrast 值大小的校验 contrast:2 值大于等于2  contrast:2,12 值大于等于2小于等于12
	 * 
	 * @example <input class="form-control" ng-model="vm.personForm.cerno" rule="must">
	 * @example <input class="form-control" ng-model="vm.personForm.cerno" rule="must;length:12">
	 * @example <input class="form-control" ng-model="vm.personForm.cerno" rule="mobile|telephone">

	 */
	 function Rule(){
		//是否为 或校验
		this.isOr = true;
		//是否为 与校验
		this.isAnd = true;
		
		this.errorList = [];
		
	};

	Rule.CONFIG = {
		OPR_AND : ';',
		OPR_OR : '|',
		OPR_PARAMS : ':',
		OPR_PARAMS_SPR : ',',
		
		RESULT_KEY_STATE : 'state',
		RESULT_KEY_MSG : 'msg',
		
		RESULT_MSG_SPR : '；',
		DEFAULT_SUCCESS_MSG : 'ok',
		DEFAULT_ERROR_MSG : 'error'
	};
	
	/**
	 * 配置Rule属性。
	 */
	Rule.setConfig = function(c){
		if(c){
			Rule.CONFIG = $.extend({}, Rule.CONFIG, c);
		}
	}
	
	
	/**
	 * 获得封装的结果。
	 * @param result true or false
	 * @param msg {state: '状态', msg: '校验提示信息'}
	 * @returns
	 */
	Rule.prototype._getResult=function(result, msg){
		var ret = {};
		ret[Rule.CONFIG.RESULT_KEY_STATE] = result;
		ret[Rule.CONFIG.RESULT_KEY_MSG] = msg;
		return ret;
	}
	/**
	 * 获得验证不通过的结果。
	 * @param msg
	 * @returns
	 */
	Rule.prototype._getFailResult=function(msg){
		if(!msg){
			msg = Rule.CONFIG.DEFAULT_ERROR_MSG;
		}
		return this._getResult(false, msg);
	}
	/**
	 * 获得验证通过的结果。
	 * @returns
	 */
	Rule.prototype._getSuccessResult=function(){
		return this._getResult(true, Rule.CONFIG.DEFAULT_SUCCESS_MSG);
	}
	
	
	Rule.prototype._getErrorMsg = function(errorList){
		for(var i = 0, len = errorList.length; i < len; i++){
			if(this.isOr){
				return errorList.join('或者');
			}
			if(this.isAnd){
				return errorList.join('并且');
			}
		}
	}
	
	function _addErrorMsg(msg, errorList){
		if(!msg){
			return errorList;
		}
		if(!errorList){
			errorList = [];
		}
		for(var i = 0, len = errorList.length; i < len; i++){
			var item = errorList[i];
			if(item == msg){
				return errorList;
			}
		}
		errorList.push(msg);
		return errorList;
	}
	
	/**
	 * @desc 得到校验规则的数组
	 * @return Array
	 */
	Rule.prototype._getRuleExprArray = function(ruleExpr){
		if(!ruleExpr){
			return [];
		}
		var indexOr = ruleExpr.indexOf(Rule.CONFIG.OPR_OR);
		var indexAnd = ruleExpr.indexOf(Rule.CONFIG.OPR_AND);
		
		if( indexOr > -1 && indexAnd > -1){
			console.log('不支持“或规则” “且规则”同时存在');
			return [];
		}
		
		if(indexOr == -1 && indexAnd == -1){
			//默认为 与规则
			this.isAnd = true;
		}else{
			if(indexAnd > -1){
				this.isOr = false;
				this.isAnd = true;
			}
			if(indexOr > -1){
				this.isAnd = false;
				this.isOr = true;
			}
		}
		var splitChar = this.isOr ? Rule.CONFIG.OPR_OR : Rule.CONFIG.OPR_AND;
		
		// ruleExpr ： 'must;length:1,2'
		// ruleArray:  ["must","length:1,2" ]
		return ruleExpr.split(splitChar);
	}

	/**
	 * @params value 校验的值
	 * @params ruleExp 校验的表达式，如：“must;length:1,3” 或 “mobile|tel”。
	 * 					分号表示“与”的关系，竖线表示“或”的关系。
	 * 					冒号分开校验名称和校验参数，逗号分割校验参数。
	 * 					目前不支持同时使用“与”、“或”关系。
	 * 
	 * @return {"result": true, msg:"" } 
	 * 
	 */
	Rule.prototype.render = function(value, ruleExpr){
		if(!ruleExpr){
			return this._getSuccessResult();
		}
		// 表达式不是字符串类型，等同校验通过
		if(typeof(ruleExpr) != 'string'){
			return this._getSuccessResult();
		}
		var ruleExprArray = this._getRuleExprArray(ruleExpr);
		this.errorList = [];
		
		//如果value为空，只校验must
		if(!value || value == ''){
			if(ruleExprArray.indexOf('must') > -1){
				return this.must(value);
			}
			return this._getSuccessResult();
		}
		else{
			value = value.replace(/(^\s*)|(\s*$)/g, "");
			for(var i = 0, len = ruleExprArray.length; i < len; ++i ){
				var singleRuleExpr = ruleExprArray[i]; //形如："must","length:1,2"
				if(!singleRuleExpr){
					continue ;
				}
				var singleRuleObj = _parseSingleRuleExpr(singleRuleExpr);
				
				if(!singleRuleObj.name){
					continue ;
				}
				
				var validateFn = this[singleRuleObj.name];
				if(!validateFn){
					continue ;
				}
				if(!(validateFn instanceof Function)){
					continue ;
				}
				var validateResult = this[singleRuleObj.name](value, singleRuleObj.params);
				// 如果结果不可用，默认为通过。
				if(!validateResult){
					validateResult = this._getSuccessResult();
				}
				var resultState = validateResult[Rule.CONFIG.RESULT_KEY_STATE] ;
				// 关联逻辑为or，且已经出现true的结果，则返回true值
				if(this.isOr){
					if(resultState){
						return validateResult;
					}
					else{
						this.errorList = _addErrorMsg(validateResult[Rule.CONFIG.RESULT_KEY_MSG], this.errorList);
					}
				}
				//关联逻辑为and, 如果不通过，返回不通过的对象
				if(this.isAnd){
					if(!resultState){
						this.errorList = _addErrorMsg(validateResult[Rule.CONFIG.RESULT_KEY_MSG], this.errorList);
					}
				}
			}// end of for
			
			if(this.errorList.length > 0){
				var errorList = this.errorList;
				this.errorList = [];
				return this._getFailResult(this._getErrorMsg(errorList));
			}else{
				return this._getSuccessResult();
			}
		}
		

	}// end of function rule
		
	/**
	 * 将rule表达式解析为对象。
	 * 如：  must 解析为 {name:'must'}
	 *      length:1,2 解析为 {name:'length',params:[1,2]}
	 *      
	 *  name need to be trimed
	 */
	function _parseSingleRuleExpr(singleRuleExpr){
		if(!singleRuleExpr){
			return null;
		}
		
		var ret = {};
		var ruleExprArry = singleRuleExpr.split(Rule.CONFIG.OPR_PARAMS);
		if(ruleExprArry.length == 1){
			ret['name'] = ruleExprArry[0];
		}else if(ruleExprArry.length == 2){
			ret['name'] = ruleExprArry[0];
			var params = ruleExprArry[1];
			if(params){
				ret['params'] = ruleExprArry[1].split(Rule.CONFIG.OPR_PARAMS_SPR);
			}
		}else{
			return null;
		}
		return ret ;
	}
	
	/**
	 * 必填项校验
	 */
	Rule.prototype.must = function(value){
		if(typeof(value) == 'undefined' || value==""){
			return this._getFailResult("必填");
		}
		return this._getSuccessResult();
	}
	/**
     * @desc 测试正则表达式
     * @param {val} 输入需要效验的字符
     * @param {value} 效验的正则表达式
     * @return boolean
     */          
	Rule.prototype._testRegexp = function(val, rule) {
        if(typeof(rule)!='regexp'){
    		//转成RegExp对象
    		if(this._testRegex('\\/\\^', rule)){
                rule = rule.substring(1, rule.length);
    		}
            if(this._testRegex('\\/\\i', rule)){
    			rule = rule.substring(0, rule.length-2);
            }
    	    rule = new RegExp(rule); 
    	}
        var value = val;
        if (value == "")
            return true;
        
        return rule.test(value);
    }
    
	/**
     * @desc 测试正则是否匹配
     * @param {regex} 效验的正则表达式
     * @param {rule} 效验的正则表达式
     * @return boolean
     */          
	Rule.prototype._testRegex = function(regex, rule) {
        return ((typeof regex == 'string') ? new RegExp(regex) : regex).test(rule);
    }
     /**
      * 字符校验
      */
	Rule.prototype.character = function(value){
    	var regExpr=/^[\u4e00-\u9fa5A-Za-z]+$/i;
    	if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("请输入有效字符");
 		}else{
 			return this._getSuccessResult();
 		}
    }
    /**
     * 英文字符校验
     */
	Rule.prototype.english = function(value){
    	var regExpr=/^[A-Za-z]+$/i;
    	if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("请输入有效英文字符");
 		}else{
 			return this._getSuccessResult();
 		}
    }
    /**
     * 中文字符校验
     * 
     * */
	Rule.prototype.chinese = function(value){
    	var regExpr=/^[\u4e00-\u9fa5]+$/i;
    	if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("请输入中文字符");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	 /**
     * 中文字符+字符校验
     * 
     * */
	Rule.prototype.chineseandbd = function(value){
    	var regExpr=/^[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+$/i;
    	if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("请输入中文字符");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	
    /**
     * 货币校验
     */
	Rule.prototype.currency = function(value){
    	 var regExpr=/^\$[-+]?\d+(\.\d+)?([Ee][-+]?[1-9]+)?$/i;
    	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("货币输入值必须有效");
 		}else{
 			return this._getSuccessResult();
 		}
     }
	
	/**
     * @desc 数字值比较
     * @param {val}  输入需要比较的数字
     * @param {v1}   比较范围第一个参数
     * @param {v2}   比较范围第二个参数
     * @return boolean
     */        
	Rule.prototype.contrast = function(value, params) {
		//特别处理企业营业期限选择长期的校验问题
		if("长期"== value){
			return this._getSuccessResult();
		}
		value = Number(value);
		if(value == null || value == 'NAN'){
			return this._getSuccessResult();
		}
		var st = Number(params[0]);
		var lt = Number(params[1]);
		if(typeof st == 'undefined' || st == 'NAN'){
			return this._getSuccessResult();
		}
		var state = (value >= st);
		if(lt && typeof lt != 'undefined'){
			state = (state && value <= lt);
		}
		if(state){
			return this._getSuccessResult();
		}else{
			if(lt && typeof lt != 'undefined'){
				return this._getFailResult("输入"+ st +"~"+ lt +"之间的值");
			}
			return this._getFailResult("输入大于"+ st +"的值");
		}
    }
	
	/**
     * @desc 数字定义
     * @param {val} 输入需要验证的数值
     * @param {zl}  区间范围第一个参数值
     * @param {xl}  区间范围第二个参数值
     * @return boolean
	 * @example this.numberDefine(val, zl, xl)
     */         
	Rule.prototype.numberDefine = function(val, zl, xl){
    	var value = val;
    	if(value=="")return true;
        if(!this.reg.number.test(value))return false;
        var valueStrArray=value.split(".");
        var zlength= zl;
        if(valueStrArray.length==2){
        	return valueStrArray[0].length<=zlength && valueStrArray[1].length<=xl;
        }
        else{
        	return valueStrArray[0].length <= zlength;
        }
    }
	
     /***
      * 数字
      */
	Rule.prototype.number = function(value){
    	 var regExpr=/^[-]?\d+(\.\d+)?([Ee][-+]?[1-9]+)?$/i;
    	 if(!this._testRegexp(value,regExpr+"")){
  			return this._getFailResult("输入数字");
  		}else{
  			return this._getSuccessResult();
  		}
     }
	/***
     * 整数
     */
	Rule.prototype.numberInt = function(value){
   	 var regExpr=/^[-]?\d+$/i;
   	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("输入整数");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	/***
     * 浮点数
     */
	Rule.prototype.numberFloat = function(value){
   	 var regExpr=/^[-]?\d+\.\d+$/i;
   	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("输入浮点数");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	
	/***
     * 非负浮点数
     */
	Rule.prototype.numberPlusFloat = function(value){
   	 var regExpr=/^\d+(\.\d+)?$/i;
   	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("输入非负浮点数");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	
	/***
     * 正整数
     */
	Rule.prototype.numberPlusInt = function(value){
   	 var regExpr=/^\d+$/i;
   	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("输入正整数");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	
	/***
     * 密码（以字母开头，长度在6-18之间，只能包含字符、数字和下划线）
     */
	Rule.prototype.pass = function(value){
   	 var regExpr=/^[a-zA-Z]\w{5,17}$/i;
   	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("输入以字母开头，长度在6-18之间，只能包含字符、数字和下划线的值");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	
	/***
     * 数字或字符
     */
	Rule.prototype.numorchar = function(value){
   	 var regExpr=/^[\u4e00-\u9fa5A-Za-z0-9]+$/i;
   	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("输入数字或字符");
 		}else{
 			return this._getSuccessResult();
 		}
    }
	
	/***
     * 数字或英文字符
     */
	Rule.prototype.numorenglish = function(value){
   	 var regExpr=/^[\u4e00-\u9fa5A-Za-z0-9]+$/i;
   	 if(!this._testRegexp(value,regExpr+"")){
 			return this._getFailResult("输入数字或英文字符");
 		}else{
 			return this._getSuccessResult();
 		}
    }

     /**
      * qq号码校验
      */
	Rule.prototype.qq = function(value){
    	 var regExpr=/^[1-9]\d{5,11}$/i;
    	 if(!this._testRegexp(value,regExpr+"")){
  			return this._getFailResult("输入正确qq号码");
  		}else{
  			return this._getSuccessResult();
  		}
     }
	/**
	 *手机号码校验 
	 *以1开头，长度为11位
	 */
		
	Rule.prototype.mobile = function(value){
		var regExpr =/^0?1\d{10}$/i;
		if(!this._testRegexp(value,regExpr+"")){
			return this._getFailResult("输入正确手机号码");
		}else{
			return this._getSuccessResult();
		}
		
	}
	/**
	 * 座机号码校验
	 */
	Rule.prototype.telephone = function(value){
		var regExpr=/^((\(0\d{2,3}\))|(0\d{2,3}-))?[1-9]\d{6,7}(-\d{1,4})?$/i;
		if(!this._testRegexp(value,regExpr+"")){
			return this._getFailResult("输入正确座机号码");
		}else{
			return this._getSuccessResult();
		}
	}
	/**
	 * 邮政编码校验
	 */
	Rule.prototype.postal = function(value){
		var regExpr=/^\d{6}$/i;
		 if(!this._testRegexp(value,regExpr+"")){
				return this._getFailResult("输入正确邮编号码");
			}else{
				return this._getSuccessResult();
			}
	}
	/**
	 * email校验
	 */
	Rule.prototype.email = function(value){
	    var regExpr=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
	    if(!this._testRegexp(value,regExpr+"")){
			return this._getFailResult("输入正确email地址");
		}else{
			return this._getSuccessResult();
		}
	}
	/**
	 * url校验
	 */
	Rule.prototype.url = function(value){
		var regExpr=/^(http|https|ftp):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/i;
		 if(!this._testRegexp(value,regExpr+"")){
				return this._getFailResult("输入有效连接");
			}else{
				return this._getSuccessResult();
			}
	}
	/**
	 * 长度校验
	 * length:1 校验长度必须为1；
	 * length:1,2 校验长度在1和2之间，包含1和2
	 * length:0,2  校验长度必须小于3
	 * @params value
	 */
	Rule.prototype.length = function(value, params){
		var length = value ? value.length : 0;
		if(params.length == 1){
			charLength = params[0];
			if(length != charLength){
				return this._getFailResult("长度为" + charLength );
			}
		}else if(params.length == 2){
			charFrom = params[0];
			charTo = params[1];
			if(length < charFrom || length > charTo){
				return this._getFailResult("长度在"+charFrom+"和"+charTo+"之间");
			}
		}
		return this._getSuccessResult();
	} // end of length
	
	Rule.prototype.checkboxlen = function(value, params1, params2){
		if(params1 instanceof Array){
			params2 = params1[1];
			params1 = params1[0];
		}
		var length = value ? value.length : 0;
		// 只传1个参数的情况
		if(params2 === undefined){
			if(length != params1){
				return this._getFailResult("至少要选择" + params1+"个" );
			}
		}
		if(length < params1 || length > params2){
			return this._getFailResult("至少要选择"+params1+"个，但不超过"+params2+"个");
		}
		return this._getSuccessResult();
	} // end of length
	
	/**
	 * 身份证校验
	 * */
	Rule.prototype.idcard = function(idcard){

    	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}; 
    	var idcard,Y,JYM; 
    	var S,M; 
    	var idcard_array = new Array(); 
    	idcard_array = idcard; 
    	//地区检验 
    	if(area[parseInt(idcard.substr(0,2))]==null&&idcard.substr(0,2)) {
    		return this._getFailResult("不存在"+idcard.substr(0,2)+"开头的身份证号码");
    	}
    	//身份号码位数及格式检验 
    	switch(idcard.length){ 
	    	case 15: 
	        	if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){ 
	        	ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性 
	        	} else { 
	        	ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性 
	        	} 
	
	        	if(ereg.test(idcard)) return true;
	        	else return false; 
	        	break;
	
        	case 18: 
        	//18位身份号码检测 
        	//出生日期的合法性检查 
        	//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9])) 
        	//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8])) 
        		if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){ 
        			ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式 
        		} else { 
        			ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式 
        		} 
        		if(ereg.test(idcard)){//测试出生日期的合法性 
		        	//计算校验位 
		        	S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 
		        	+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 
		        	+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 
		        	+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 
		        	+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 
		        	+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 
		        	+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 
		        	+ parseInt(idcard_array[7]) * 1 
		        	+ parseInt(idcard_array[8]) * 6 
		        	+ parseInt(idcard_array[9]) * 3 ; 
		        	Y = S % 11; 
		        	M = "F"; 
		        	JYM = "10X98765432"; 
		        	M = JYM.substr(Y,1);//判断校验位 
		        	if(M == idcard_array[17])
		        		return this._getSuccessResult(); //检测ID的校验位 
		        	else 
		        		return this._getFailResult("输入正确身份证校验位"); 
        		} 
        		else 
        			return this._getFailResult("输入正确身份证号码"); 
        		break;
        	
        	default:
        		return this._getFailResult("输入正确身份证号码"); 
        		break; 
    	}// end of switch 
    
	}//end of idcard
	
	/**
	 * @desc 添加自定义校验的方法
	 */
	Rule.prototype.addCustomRule = function(custom){
		if(!custom){
			return;
		}
		for(var item in custom){
			if(custom.hasOwnProperty(item)){
				if(!(item in this)){
					this[item] = custom[item];
				}
			}
		}
	}
	
	Torch.lib('rule', function(){
		return function(){
			var r = new Rule;
			var customRule = Torch.customRule;
			r.addCustomRule(customRule);
			return r;
		}
	});
	//return rule;
})(window);

