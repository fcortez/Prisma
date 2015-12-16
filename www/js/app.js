// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova','starter.auth','starter.controllers', 'starter.directives',
    'starter.factory','ionic-material', 'ionMdInput', 'angularMoment', 'ngColorThis', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.constant('FURL', 'https://prisma2.firebaseio.com/')
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity"class="button button-fab button-fab-top-right expanded button-energized-900 spin"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.add', {
        url: '/add',
        views: {
            'menuContent': {
                templateUrl: 'templates/addActivity.html',
                controller: 'addCtrl'
            }
        }
    })

    .state('app.comment', {
        url: '/comment/:commentid',
        views: {
            'menuContent': {
                templateUrl: 'templates/comentarios.html',
                controller: 'commentCtrl'
            }
        }
    })

    .state('app.commentGaleria', {
        url: '/comment/:commentid',
        views: {
            'menuContent': {
                templateUrl: 'templates/comentarioGaleria.html',
                controller: 'commentGaleria'
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-image"></i></button>', 
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }

        }
    })

    .state('login', {
        url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'

    })

    .state('app.importante', {
        url: '/importante',
        views: {
            'menuContent': {
                templateUrl: 'templates/importante.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity"class="button button-fab button-fab-top-right expanded button-energized-900 spin"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.reunion', {
        url: '/reunion',
        views: {
            'menuContent': {
                templateUrl: 'templates/reunion.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity"class="button button-fab button-fab-top-right expanded button-energized-900 spin"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })


    .state('app.recordatorio', {
        url: '/recordatorio',
        views: {
            'menuContent': {
                templateUrl: 'templates/recordatorio.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity"class="button button-fab button-fab-top-right expanded button-energized-900 spin"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});
