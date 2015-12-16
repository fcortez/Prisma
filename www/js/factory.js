angular.module('starter.factory', [])

.factory('Auth', function(FURL, $firebaseAuth){
	var ref = new Firebase(FURL);
	var auth = $firebaseAuth(ref);

	var Auth = {
	 user: {},
	resetpassword: function(user) {
		return auth.$resetPassword({
		email: user.email
		}).then(function() {
		alert("Exito. La clave fue enviada a su correo.");
		console.log("Password reset email sent successfully!");
		}).catch(function(error) {
		alert(error);
		console.error("Error: ", error.message);
		});
	  }
    }
    return Auth;
})
.factory('Loader', ['$ionicLoading', '$timeout',
    function ($ionicLoading, $timeout) {

        return {
            show: function (text) {
                //console.log('show', text);
                $ionicLoading.show({
                    content: (text || 'Cargando...'),
                    noBackdrop: true
                });
            },

            hide: function () {
                //console.log('hide');
                $ionicLoading.hide();
            },

            toggle: function (text, timeout) {
                var that = this;
                that.show(text);

                $timeout(function () {
                    that.hide();
                }, timeout || 3000);
            }
        };
    }
])
.factory('Utils', [function () {
    return {
        getBase64ImageFromInput: function (input, callback) {
            window.resolveLocalFileSystemURL(input, function (fileEntry) {
                    fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (evt) {
                                callback(null, evt.target.result);
                            };
                            reader.readAsDataURL(file);
                        },
                        function () {
                            callback('failed', null);
                        });
                },
                function () {
                    callback('failed', null);
                });
        }
    };
}]);