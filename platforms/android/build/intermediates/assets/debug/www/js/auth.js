angular.module('starter.auth', [])

.factory('authIn', function(FURL, $firebaseAuth){
	var ref = new Firebase(FURL);
	return $firebaseAuth(ref);
})