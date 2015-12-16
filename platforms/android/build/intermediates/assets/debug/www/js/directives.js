angular.module('starter.directives', [])


.directive("toggleVisible", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.on('click', function() {
            	$('div.form-auth').toggle('500');
            });
        }
    };    
})
.directive("toggleReset", function(){
	return {
		restrict: "A",
		link: function(scope, element, attrs) {
			$('#reset').click(function() {
				$('div.form-auth').hide();
				$('div.form-auth-reset').toggle('500');
			});
		}
	};

})
.directive('confirmationNeeded', function () {
  return {
    priority: 1,
    terminal: true,
    link: function (scope, element, attr) {
      var msg = attr.confirmationNeeded || "¿Estas seguro de eliminarlo?";
      var clickAction = attr.ngClick;
      element.bind('click',function () {
        if ( window.confirm(msg) ) {
          scope.$eval(clickAction)
        }
      });
    }
  };
})
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])
;
