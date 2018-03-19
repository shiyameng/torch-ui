angular.module('common.template', []);

angular.module("common.template").run(["$templateCache", function($templateCache) {
	  $templateCache.put("common/template/accordion-group.html",
		"<div class=\"panel-line\"><span class=\"icon icon-circle panel-line-icon\" ng-class=\"{'active':isOpen}\"></span></div>"+
		"<div class=\"panel-content\">"+
	    "	<div role=\"tab\" id=\"{{::headingId}}\" aria-selected=\"{{isOpen}}\" class=\"panel-heading\" ng-keypress=\"toggleOpen($event)\">\n" +
	    "  		<h4 class=\"panel-title\">\n" +
	    "    		<a role=\"button\" data-toggle=\"collapse\" href aria-expanded=\"{{isOpen}}\" aria-controls=\"{{::panelId}}\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" uib-accordion-transclude=\"heading\" ng-disabled=\"isDisabled\" uib-tabindex-toggle>\n"+
	    "      		<span uib-accordion-header>{{heading}}</span>\n"+
	    "      		<i ng-if=\"!isDisabled\" class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': !!isOpen, 'glyphicon-chevron-right': !isOpen }\"></i>\n"+
	    "    		</a>\n" +
	    "  		</h4>\n" +
	    "	</div>\n" +
	    "	<div id=\"{{::panelId}}\" aria-labelledby=\"{{::headingId}}\" aria-hidden=\"{{!isOpen}}\" role=\"tabpanel\" class=\"panel-collapse collapse\" uib-collapse=\"!isOpen\">\n" +
	    "  		<div class=\"panel-body\" ng-transclude></div>\n" +
	    "	</div>\n" +
	    "</div>"+
	    "");
	}]);