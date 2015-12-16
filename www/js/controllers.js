'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $ionicPopover, 
  $timeout, $rootScope, authIn, FURL, $ionicHistory, $firebaseAuth) {
    
    var ref = new Firebase(FURL);
    var loginData = $firebaseAuth(ref);


    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.logout = function(authData) {
        authIn.$unauth();
        $ionicHistory.clearCache();
        $state.go('login')
    };
})

.controller('LoginCtrl', function($scope, FURL, $rootScope, $state, $timeout, Auth, 
$stateParams, ionicMaterialInk, authIn, $firebaseAuth) {

var ref = new Firebase(FURL);
var loginData = $firebaseAuth(ref); 
var users = ref.child('Users');

$scope.$on('addProfile', function ($event, authData) {
   
    
    if(authData.google) {
      var authDataVar = authData.google;
      var img = authDataVar.cachedUserProfile.picture;
      var provider = 'Google+';
    } else if (authData.twitter) {
      var authDataVar = authData.twitter;
      var img = authDataVar.cachedUserProfile.profile_image_url;
      var provider = 'Twitter';
    } else {
      var authDataVar = authData.facebook;
      var img = authDataVar.cachedUserProfile.picture.data.url;
      var provider = 'facebook';
    }

    users.push().set({
      id: authData.uid,
      name: authDataVar.displayName,
      provider: provider,
      picture: img,
      horaingreso: Date.now()
     });
     
});



    $rootScope.$on('newHome', function ($event, authData) {
        console.log('Algo'+ authData.password.email);
        user.name = authData.password.email;
        user.img = 'http://learnsauce.com/googleandroidstudio/img/anyone.png';

        $rootScope.user = user;
  });

  var user = {
    email: '',
    password: '',
    rpassword: ''
  };

  $scope.signup = function(){
    var user = $scope.user;
    if(!user || (!user.email || user.password.length == 0 || user.rpassword.length == 0)){
      alert('Ingresa los campos requeridos');
    } else {
      if(user.password == user.rpassword){
        authIn.$createUser({
          email: user.email,
          password: user.password
        }).then(function(user){
          alert('Creación de cuenta exitosa')
          $state.go($state.current, null, {reload: true, notify:true});
        }).catch(function(error){
            if (error.code == 'INVALID_EMAIL') {
              alert('Porfavor, ingrese un email valido');
            } else if (error.code == 'EMAIL_TAKEN') {
              alert('Este email ya está en uso, pruebe con otro');
            } else {
              alert("Error al crear al usuario");
            }
          });
      }
      else {
        alert('No coincide los password');
      }
    }
  };

  $scope.signin = function(){
    var user = $scope.user;
    if(!user.email || user.password.length == 0){
      alert('Ingrese los campos requeridos');
    } else {
      authIn.$authWithPassword({
      email: user.email,
      password: user.password
    }).then(function(authData, user){     
      $state.go('app.profile');      
      $rootScope.$broadcast('newHome', authData);
      console.log('Exito! Estas loggeado con al cuenta:' + authData.uid);
    }).catch(function(error){
          if (error.code == 'INVALID_EMAIL') {
            alert('Porfavor, ingrese un email valido');
          } else if (error.code == 'INVALID_PASSWORD' || error.code == 'INVALID_USER') {
            alert('Email o Password invalidos');
          } else {
            alert("Ha ocurrido un error");
          }
        }); 
    }

  };

setTimeout(function() {
    authIn.$onAuth(function(authData) {
      if(authData === null){
        console.log("No esta logueado");
        $state.go('login');
      } else {
        console.log('Logueado con:', authData.uid);
        $state.go('app.profile');
        $scope.$apply();
      }            
      $rootScope.authData = authData;    
    });
}, 0);


  $scope.login = function(provider){
    authIn.$authWithOAuthPopup(provider).then(function(authData){
      console.dir(authData);
      $scope.$broadcast('addProfile', authData);
    }).catch(function(error){
      if (error.code === "TRANSPORT_UNAVAILABLE") {
                loginData.$authWithOAuthPopup(provider).then(function(authData) {
                    
                });
            } else {
                console.log(error);
            }
    });
  };

    $scope.resetpassword = function(user) {
      if(angular.isDefined(user)){
      Auth.resetpassword(user)
        .then(function() {
          console.log("Password reset email sent successfully!");
          $state.go($state.current, null, {reload: true, notify:true});
        }, function(err) {
           console.error("Error: ", err);
        });
      }
    };

  $scope.regresar = function(){
    $state.go($state.current, null, {reload: true, notify:true});
  };


})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, FURL, $firebaseArray,
  ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    var ref = new Firebase(FURL + 'Users');

    var userlist = $firebaseArray(ref);
    $scope.users = userlist;

})

.controller('ProfileCtrl', function($scope, FURL, $stateParams, $state, $timeout, 
  ionicMaterialMotion, ionicMaterialInk, $firebaseArray) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    var ref = new Firebase(FURL + 'Users');

    var userlist = $firebaseArray(ref);
    $scope.users = userlist;

  
})

.controller('ActivityCtrl', function($scope, FURL, $firebaseArray, authIn, $state, $rootScope, $location, 
  $stateParams, $timeout, ionicMaterialMotion, Loader, ionicMaterialInk, $ionicPopover, $ionicScrollDelegate, $ionicPlatform) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    /* $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200); */

$ionicPlatform.ready(function() {


$timeout(function() {
  $ionicScrollDelegate.$getByHandle("actividad").scrollBottom(true);
}, 1000);
    // Activate ink for controller
    ionicMaterialInk.displayEffect();


  var ref = new Firebase(FURL + 'Boards');
  var sync = $firebaseArray(ref);


  // Data activity
  $scope.boards = sync;
  

  $scope.deleteRoom = function(comment) {

    sync.$remove($scope.boards[comment].$id);
  };

  $scope.like = function(comment){
    ref.child($scope.boards[comment].$id).child('/rank').transaction(function(current_value) {
      console.log('ruta es: ' + ref);
      return (current_value || 0) + 1;
    });
  };


  $scope.joinChat = function(comment) {
    console.log('algo');
    $state.go('app.comment', {commentid: $scope.boards[comment].$id} );
    //$location.path('/board/' + $scope.boards[board].$id);
  };

  $scope.estilo = function(board){
    if(board.subject == 'Importante') {
      return {"background": "#B71C1C","color": "white" }
    } else if (board.subject == 'Reunión') {
      return {"background": "#311B92", "color": "white" }
    } else {
      return {"background": "#004D40", "color": "white" }
    }
  };

  $scope.logoutUser = function(){
    authIn.$unauth();
    $scope.authData = null;
    $state.go('login');
  };

  $scope.redir = function(authData){
    console.log('comprobacion', authData.id);
    $state.go('app.add');
  };

  });

})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion,
   $cordovaImagePicker, Utils, FURL, $firebaseArray, Loader, $ionicScrollDelegate, $state, 
   $cordovaCapture, $ionicPlatform, $rootScope) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

 $ionicPlatform.ready(function(){
  Loader.toggle();

    var ref = new Firebase(FURL + 'Afiches');
    var refChild = $firebaseArray(ref);

    $scope.image = refChild;
    var authData = ref.getAuth();

    $timeout(function() {
      $ionicScrollDelegate.$getByHandle("galeria").scrollBottom(true);
    }, 1000);

  if(authData.provider == 'facebook'){
    var id = authData.uid;
    var displayName = authData.facebook.displayName;
    var imgProfile = authData.facebook.cachedUserProfile.picture.data.url;
    var authProvider = authData.provider;
  } else if (authData.provider == 'google'){
    var id = authData.uid;
    var displayName = authData.google.displayName;
    var imgProfile = authData.google.cachedUserProfile.picture;
    var authProvider = authData.provider;
  } else if (authData.provider == 'password'){
    var id = authData.uid;
    var displayName = authData.password.email;
    var imgProfile = $rootScope.user.img;
    var authProvider = authData.provider;
  } else {
    var id = authData.uid;
    var displayName = authData.twitter.displayName;
    var imgProfile = authData.twitter.cachedUserProfile.profile_image_url;
    var authProvider = authData.provider;
  }

    $scope.estilo = function(img){
    if(img.provider == 'google') {
      return {"background": "#B71C1C","color": "white" }
    } else if (img.provider == 'facebook') {
      return {"background": "#311B92", "color": "white" }
    } else if (img.provider == 'twitter') {
      return {"background": "#2196F3", "color": "white" }
    } else {
      return {"background": "#009688", "color": "white"}
    }
  };

    $scope.addImage = function(){
        var options = {
          maximumImagesCount: 1,
          width: 320,
          height: 480,
          quality: 60
          };
          $cordovaImagePicker.getPictures(options)
          .then(function (results) {
            if(results.length > 0) {
              var imageData = results[0];
              Utils.getBase64ImageFromInput(imageData, function (err, base64Img) {
              //Process the image string. 
              refChild.$add({
              autorid: authData.uid,
              name: displayName,
              provider: authProvider,
              imgautor: imgProfile,
              image: base64Img,
              date: Date.now(),
              origin: 'Agregada desde la galería'
              });
              Loader.hide();
              $ionicScrollDelegate.scrollBottom(true);
            });
          }
        }, function (error) {
           // error getting photos
            console.log('error: ', error);
            Loader.hide();
        });
        Loader.hide();
    };

    $scope.takePhoto = function () {
      Loader.show('Processing...');
      var options = {
      limit: 1,
      width: 320,
      height: 480,
      quality: 50
      };

      $cordovaCapture.captureImage(options).then(function (imageData) {


      Utils.getBase64ImageFromInput(imageData[0].fullPath, function (err, base64Img) {
      //Process the image string. 
              refChild.$add({
              autorid: authData.uid,
              name: displayName,
              imgautor: imgProfile,
              image: base64Img,
              date: Date.now(),
              origin: 'Tomada con la cámara del móvil'
              });
              Loader.hide();
              $ionicScrollDelegate.scrollBottom(true);
        });
      }, function (err) {
          console.log(err);
          Loader.hide();
      });

    };

      $scope.joinChat = function(comment) {
        $state.go('app.commentGaleria', {commentid: $scope.image[comment].$id} );
        //$location.path('/board/' + $scope.boards[board].$id);
      };

      $scope.like = function(like){
        ref.child($scope.image[like].$id).child('/rank').transaction(function(current_value) {
        console.log('ruta es: ' + ref);
        return (current_value || 0) + 1;
    });
  };

 });
})

.controller('addCtrl', function($scope, $timeout, $state, FURL,
 $rootScope, $firebaseArray, ionicMaterialInk, ionicMaterialMotion, authIn, $ionicScrollDelegate){
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    $timeout(function() {
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });
    }, 500);

    ionicMaterialInk.displayEffect();

var ref = new Firebase(FURL);
var board = ref.child('Boards');
//var sync = $firebaseArray(ref);

//$scope.boards = sync;
$scope.boards = {};


var authData = ref.getAuth();

if(authData.provider == 'facebook'){
  var displayName = authData.facebook.displayName;
  var imgProfile = authData.facebook.cachedUserProfile.picture.data.url;
} else if (authData.provider == 'google'){
  var displayName = authData.google.displayName;
  var imgProfile = authData.google.cachedUserProfile.picture;
} else if (authData.provider == 'password'){
  var displayName = authData.password.email;
  var imgProfile = $rootScope.user.img;
} else {
  var displayName = authData.twitter.displayName;
  var imgProfile = authData.twitter.cachedUserProfile.profile_image_url;  
}

  $scope.newRoom = function() {
    board.push().set({
      idcreator: authData.uid,
      createdby: displayName,
      activityName: $scope.boards.activityName,
      imgcreator: imgProfile,
      subject: $scope.boards.subject,
      createddate: Date.now(),
      descripcion: $scope.boards.descripcion

    });
    $ionicScrollDelegate.scrollBottom(true);
    $state.go('app.activity');
  };

  $scope.backInbox = function (){
    $state.go('app.activity');
  };


})


.controller('commentCtrl', function(FURL, $state, $scope, $rootScope, $firebaseArray, $firebaseObject, 
  $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate,
  $ionicPopover, $ionicActionSheet, $cordovaClipboard) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });


    ionicMaterialInk.displayEffect();


  //var ref = new Firebase(FURL);
  //var comment = ref.child('Boards/' + $stateParams.commentid);

  var commentRoom = new Firebase(FURL + 'Boards/' + $stateParams.commentid);
  var commentSync = $firebaseObject(commentRoom);
  $scope.commentInfo = commentSync;

  $timeout(function() {
    $ionicScrollDelegate.$getByHandle("userMessageScroll").scrollBottom(true);
  }, 1000);

  $scope.msg = {};
  //msgsSync agregará los nuevos
  var msgsSync = $firebaseArray(commentRoom.child('commentMessages'));
  //commentMessages mostrará los mensajes
  $scope.commentMessages = msgsSync;

  var authData = commentRoom.getAuth();



  if(authData.provider == 'facebook'){
    var id = authData.uid;
    var displayName = authData.facebook.displayName;
    var imgProfile = authData.facebook.cachedUserProfile.picture.data.url;
  } else if (authData.provider == 'google'){
    var id = authData.uid;
    var displayName = authData.google.displayName;
    var imgProfile = authData.google.cachedUserProfile.picture;
  } else if (authData.provider == 'password'){
    var id = authData.uid;
    var displayName = authData.password.email;
    var imgProfile = $rootScope.user.img;
  } else {
    var id = authData.uid;
    var displayName = authData.twitter.displayName;
    var imgProfile = authData.twitter.cachedUserProfile.profile_image_url;
  }
  $scope.sendMessage = function($event) {

    if ($scope.msg.message.length == 0) return;

    msgsSync.$add({
      creatorid: id,
      commentedby: displayName,
      message: $scope.msg.message,
      userimg: imgProfile,
      commenteddate: Date.now()     
    });

    commentRoom.child('/count').transaction(function(current_count) {
      return (current_count || 0) + 1;
    });

    $scope.msg.message = '';
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.backInbox = function (){
    $state.go('app.activity');
  };

  $scope.onMessageHold = function(e, itemIndex, message) {
      console.log('onMessageHold');
      console.log('message: ' + JSON.stringify(message, null, 2));
      $ionicActionSheet.show({
        buttons: [{
          text: 'Copiar texto'
        }, {
          text: 'Quitar mensaje'
        }],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              cordova.plugins.clipboard.copy(message.text);

              break;
            case 1: // Delete
              $scope.commentMessages.splice(itemIndex, 1);
              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;
          }
          
          return true;
        }
      });
    };

})
.controller('commentGaleria', function(FURL, $state, $scope, $rootScope, $firebaseArray, $firebaseObject, 
  $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate,
  $ionicPopover, $ionicActionSheet, $cordovaClipboard) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });


    ionicMaterialInk.displayEffect();


  //var ref = new Firebase(FURL);
  //var comment = ref.child('Boards/' + $stateParams.commentid);

  var commentRoom = new Firebase(FURL + 'Afiches/' + $stateParams.commentid);
  var commentSync = $firebaseObject(commentRoom);
  $scope.commentInfo = commentSync;

  $timeout(function() {
    $ionicScrollDelegate.$getByHandle("userMessageScroll").scrollBottom(true);
  }, 1000);

  $scope.msg = {};
  //msgsSync agregará los nuevos
  var msgsSync = $firebaseArray(commentRoom.child('commentMessages'));
  //commentMessages mostrará los mensajes
  $scope.commentMessages = msgsSync;

  var authData = commentRoom.getAuth();



  if(authData.provider == 'facebook'){
    var id = authData.uid;
    var displayName = authData.facebook.displayName;
    var imgProfile = authData.facebook.cachedUserProfile.picture.data.url;
  } else if (authData.provider == 'google'){
    var id = authData.uid;
    var displayName = authData.google.displayName;
    var imgProfile = authData.google.cachedUserProfile.picture;
  } else if (authData.provider == 'password'){
    var id = authData.uid;
    var displayName = authData.password.email;
    var imgProfile = $rootScope.user.img;
  } else {
    var id = authData.uid;
    var displayName = authData.twitter.displayName;
    var imgProfile = authData.twitter.cachedUserProfile.profile_image_url;
  }
  $scope.sendMessage = function($event) {

    if ($scope.msg.message.length == 0) return;

    msgsSync.$add({
      creatorid: id,
      commentedby: displayName,
      message: $scope.msg.message,
      userimg: imgProfile,
      commenteddate: Date.now()     
    });

    commentRoom.child('/count').transaction(function(current_count) {
      return (current_count || 0) + 1;
    });

    $scope.msg.message = '';
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.backInbox = function (){
    $state.go('app.gallery');
  };

  $scope.onMessageHold = function(e, itemIndex, message) {
      console.log('onMessageHold');
      console.log('message: ' + JSON.stringify(message, null, 2));
      $ionicActionSheet.show({
        buttons: [{
          text: 'Quitar mensaje'
        }],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Delete
              $scope.commentMessages.splice(itemIndex, 1);
              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;
          }
          
          return true;
        }
      });
    };

});
