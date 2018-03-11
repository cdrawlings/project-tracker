'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);


// define our app and dependencies (remember to include firebase!)
var app = angular.module("App", ["firebase", "ngRoute", 'ui.sortable', "xeditable", "ngCookies", "Home", "Authentication"]);


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/template/public/intro.html',
        controller: 'projectCtrl'
    })
        .when('/Home', {
            templateUrl: '/template/public/intro.html',
            controller: 'projectCtrl'
        })
        .when('/Graphics_form', {
            templateUrl: '/template/public/f_graphics.html',
            controller: 'projectCtrl'
        })
        .when('/PowerPoint_form', {
            templateUrl: '/template/public/f_power.html',
            controller: 'projectCtrl'
        })
        .when('/Event_form', {
            templateUrl: '/template/public/f_event.html',
            controller: 'projectCtrl'
        })
        .when('/Naming_form', {
            templateUrl: '/template/public/f_naming.html',
            controller: 'projectCtrl'
        })
        .when('/Graphics_queue', {
            templateUrl: '/template/public/q_graphic.html',
            controller: 'projectCtrl'
        })
        .when('/PowerPoint_queue', {
            templateUrl: '/template/public/q_power.html',
            controller: 'projectCtrl'
        })
        .when('/Event_queue', {
            templateUrl: '/template/public/q_event.html',
            controller: 'projectCtrl'
        })
        .when('/Naming_queue', {
            templateUrl: '/template/public/q_naming.html',
            controller: 'projectCtrl'
        })
        .when('/Graphics_admin', {
            templateUrl: '/template/admin/a_graphic.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/PowerPoint_admin', {
            templateUrl: '/template/admin/a_power.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Event_admin', {
            templateUrl: '/template/admin/a_event.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Naming_admin', {
            templateUrl: '/template/admin/a_naming.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Graphics_archived', {
            templateUrl: '/template/admin/arc_graphic.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/PowerPoint_archived', {
            templateUrl: '/template/admin/arc_power.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Event_archived', {
            templateUrl: '/template/admin/arc_event.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Naming_archived', {
            templateUrl: '/template/admin/arc_naming.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Submit', {
            templateUrl: '/template/public/submit.html',
            controller: 'projectCtrl'
        })
        .when('/Admin', {
            templateUrl: '/template/admin/admin.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Archive', {
            templateUrl: '/template/admin/archived.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Queue', {
            templateUrl: '/template/public/queue.html',
            controller: 'projectCtrl'
        })
        .when('/Login', {
            templateUrl: '/template/authentication/login.html',
            controller: 'LoginController'
        })

        .when('/Thankyou_naming', {
            templateUrl: '/template/public/t_naming.html',
            controller: 'projectCtrl'
        })
        .when('/Thankyou_events', {
            templateUrl: '/template/public/t_events.html',
            controller: 'projectCtrl'
        })
        .when('/Thankyou_graphics', {
            templateUrl: '/template/public/t_graphics.html',
            controller: 'projectCtrl'
        })
        .when('/Thankyou_power', {
            templateUrl: '/template/public/t_power.html',
            controller: 'projectCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

//Active Nav bar
app.directive('bsActiveLink', ['$location', function ($location) {
    return {
        restrict: 'A', //use as attribute
        replace: false,
        link: function (scope, elem) {
            //after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                var hrefs = ['/#' + $location.path(),
                    '#' + $location.path(), //html5: false
                    $location.path()]; //html5: true
                angular.forEach(elem.find('a'), function (a) {
                    a = angular.element(a);
                    if (-1 !== hrefs.indexOf(a.attr('href'))) {
                        a.parent().addClass('active');
                    } else {
                        a.parent().removeClass('active');
                    }

                });
            });
        }
    }
}]);

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});


//authorization
app.run(['$rootScope', '$location', '$cookieStore', '$http', '$route',
    function ($rootScope, $location, $cookieStore, $http, $route) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if trying to access
            // a secure page and not logged in
            var nextRoute = $route.routes[$location.path()];
            if (nextRoute.secure && !$rootScope.globals.currentUser) {
                $location.path('/Login');
            }


        });
    }]);


// this factory returns a synchronized array Graphic design projects
app.factory("jobProjects", ["$firebaseArray", "$firebaseStorage",
    function ($firebaseArray, $firebaseStorage) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("Graphics");

        // this uses AngularFire to create the synchronized array

        return $firebaseArray(ref);

    }


]);


// this factory returns a synchronized array PowerPoint Project
app.factory("jobPower", ["$firebaseArray",
    function ($firebaseArray) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("powerPoint");

        // this uses AngularFire to create the synchronized array
        return $firebaseArray(ref);
    }
]);


// this factory returns a synchronized array for Event projects
app.factory("jobNaming", ["$firebaseArray",
    function ($firebaseArray) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("Naming");

        // this uses AngularFire to create the synchronized array
        return $firebaseArray(ref);
    }
]);


// this factory returns a synchronized array for Event projects
app.factory("jobEvents", ["$firebaseArray",
    function ($firebaseArray) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("Events");

        // this uses AngularFire to create the synchronized array
        return $firebaseArray(ref);
    }
]);


app.controller("projectCtrl", ["$scope", "jobProjects", "jobPower", "jobEvents", "jobNaming", "$route", "$rootScope", "$location", "$filter",
    // we pass our new jobProjects factory into the controller
    function ($scope, jobProjects, jobPower, jobEvents, jobNaming, $route, $rootScope, $location, $filter) {

        // we add jobProjects array to the scope to be used in our ng-repeat
        $scope.todos = jobProjects;
        $scope.power = jobPower;
        $scope.events = jobEvents;
        $scope.naming = jobNaming;




/// Graphic design jobs functions


        $scope.addProject = function () {

            var storage = firebase.storage();
            var storageRef = storage.ref("Graphic_job");
            var filesRef = storageRef.child('files');




            var filesSelected = document.getElementById("nameImg").files;
            if (filesSelected.length > 0) {
                var file = filesSelected[0];

                console.log("Let's upload a file!");
                console.log(file);

                if (file.size >= 20000000){
                    alert("file should be less than 20MB")
                    return false
                }

                var task = storageRef.child(file.name).put(file);

                task.on('state_changed', function (snapshot) {

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // unsuccessful uploads
                }, function () {
                    //successful uploads on complete

                    var downloadURL = task.snapshot.downloadURL;
                    console.log(downloadURL);

                    $scope.graphicSave(downloadURL);
                });


            }
            else $scope.graphicSave("empty");
        };

         $scope.today = $filter('date')(new Date(), 'MM/dd/yy');

        // a method to create new todos; called by ng-submit
        // calling $add on a synchronized array is like Array.push(),
        // except that it saves the changes to our database!

        $scope.graphicSave = function (downloadURL) {
            $scope.todos.$add({
                job: $scope.newJob,
                client: $scope.newClient,
                brief: $scope.newBrief,
                due_date: $scope.newDate,
                job_format: $scope.jobFormat,
                job_type: $scope.jobType,
                attachment: downloadURL,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                status: 'pending',
                comment: 'No comment',
                completed: false,
                submitted: $scope.today
            });

            window.location = "#/Thankyou_graphics";

            console.log(downloadURL)

            // reset the todo input
            $scope.todos = "";
        };

        // update data functions

        //save updated date
        $scope.saveEdit = function (data, item, field) {

            item[field] = data;

            $scope.todos.$save(item);
            console.log(data, item);
        };


        $scope.startTodo = function (index, item) {

            // UPDATE STATUS TO IN PROGRESS AND SAVE

            item.status = 'working';
            this.todos[index].status = "working";
            this.todos.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };

         $scope.unarchive = function (index, item) {

            // UPDATE STATUS TO IN PROGRESS AND SAVE

            item.status = 'working';
            this.todos[index].status = "working";
            item.completed = false;
            this.todos[index].completed = false;
            this.todos.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };



        // MARK TODO AS COMPLETE METHOD
        $scope.completeTodo = function (index, item) {



            // UPDATE STATUS TO COMPLETE AND SAVE
            item.status = 'archived';
            this.todos[index].status = "archived";
            item.completed = true;
            this.todos[index].completed = true;


            this.todos.$save(item);
            console.log(todo);

            window.location.reload();

        };

        // REMOVE TODO ITEM METHOD
        $scope.removeTodo = function (index, item) {


            // FIREBASE: REMOVE ITEM FROM LIST
            $scope.todos.$remove(item);


            window.location.reload();


        };


// Tracks the number of active Grapic jobs and seperates pending working
        $scope.$watch('todos', function () {
            var total = 0;
            var remaining = 0;
            $scope.todos.forEach(function (todo) {
                total++;
                if (todo.completed === false) {
                    remaining++;
                }
            });

            $scope.todosPending = $filter("filter")($scope.todos, {'status': 'pending'});
            $scope.todosWorking = $filter("filter")($scope.todos, {'status': 'working'});


            $scope.totalCount = total;
            $scope.remainingCount = remaining;
            $scope.allChecked = remaining === 0;
        }, true);

        //Sortable

        $scope.sortableOptions = {
            stop: function (event, ui) {
                $scope.todosWorking.forEach(function (todo) {
                    todo.priority = $scope.todosWorking.indexOf(todo);
                    $scope.todos.$save(todo);

                });
                $scope.todosPending.forEach(function (todo) {
                    todo.priority = $scope.todosPending.indexOf(todo);
                    $scope.todos.$save(todo);
                });
            }
        };


/// PowerPoint jobs functions

        $scope.addPower = function () {


            var storage = firebase.storage();
            var storageRef = storage.ref("PPT_jobs");
            var filesRef = storageRef.child('files');


            var filesSelected = document.getElementById("nameImg").files;
            if (filesSelected.length > 0) {
                var file = filesSelected[0];


                console.log("Let's upload a file!");
                console.log(file);


                if (file.size >= 20000000){
                    alert("file should be less than 20MB")
                    return false
                }

                var task = storageRef.child(file.name).put(file);

                //

                task.on('state_changed', function (snapshot) {

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // unsuccessful uploads
                }, function () {
                    //successful uploads on complete

                    var downloadPPT = task.snapshot.downloadURL;
                    console.log(downloadPPT);

                    $scope.powerSave(downloadPPT);
                });
            }

            else $scope.powerSave("empty");
        };

         $scope.today = $filter('date')(new Date(), 'MM/dd/yy');

        // a method to create new todos; called by ng-submit
        $scope.powerSave = function (downloadPPT) {
            // calling $add on a synchronized array is like Array.push(),
            // except that it saves the changes to our database!
            $scope.power.$add({
                job: $scope.powerJob,
                client: $scope.powerClient,
                brief: $scope.powerBrief,
                due_date: $scope.powerDate,
                attachment: downloadPPT,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                completed: false,
                status: 'pending',
                comment: 'No comment',
                submitted: $scope.today
            });

            window.location = "#/Thankyou_power";

            // reset the todo input
            $scope.powerp = "";
        };


// Tracks the number of active PowerPoint jobs and seperates pending working
        $scope.$watch('power', function () {
            var total = 0;
            var remaining = 0;
            $scope.power.forEach(function (powerI) {
                total++;
                if (powerI.completed === false) {
                    remaining++;
                }
            });


            $scope.powerPending = $filter("filter")($scope.power, {'status': 'pending'});
            $scope.powerWorking = $filter("filter")($scope.power, {'status': 'working'});


            $scope.totalCount = total;
            $scope.remainingPower = remaining;
            $scope.allChecked = remaining === 0;
        }, true);


    // Move to working from pending

         $scope.powerStartTodo = function (index, item) {
             item.status = 'working';
            this.power[index].status = "working";
            this.power.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };


          // Unarchive item
         $scope.powerUnarchive = function (index, item) {

            item.status = 'working';
            this.power[index].status = "working";
            item.completed = false;
            this.power[index].completed = false;
            this.power.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };



        // Archive item
        $scope.powerCompleteTodo = function (index, item) {

            item.status = 'archived';
            this.power[index].status = "archived";
            item.completed = true;
            this.power[index].completed = true;

            this.power.$save(item);
            console.log(todo);

            window.location.reload();

        };

        // Delete item
        $scope.powerRemoveTodo = function (index, item) {

            // FIREBASE: REMOVE ITEM FROM LIST
            $scope.power.$remove(item);

            window.location.reload();
        };


        //save updated date
        $scope.savePowerEdit = function (data, item, field) {

            item[field] = data;

            $scope.power.$save(item);
            console.log(data, item);
        };




//Sortable

        $scope.sortablePowerOptions = {
            stop: function (event, ui) {
                $scope.powerWorking.forEach(function (todo) {
                    todo.priority = $scope.powerWorking.indexOf(todo);
                    $scope.power.$save(todo);

                });
                $scope.powerPending.forEach(function (todo) {
                    todo.priority = $scope.powerPending.indexOf(todo);
                    $scope.power.$save(todo);
                });
            }
        }



/// Event jobs functions


        $scope.addEvent = function () {

            var storage = firebase.storage();
            var storageRef = storage.ref("Event_jobs");
            var filesRef = storageRef.child('files');


            var filesSelected = document.getElementById("nameImg").files;
            if (filesSelected.length > 0) {
                var file = filesSelected[0];


                console.log("Let's upload a file!");
                console.log(file);

                if (file.size >= 20000000){
                    alert("file should be less than 20MB")
                    return false
                }

                var task = storageRef.child(file.name).put(file);

                //

                task.on('state_changed', function (snapshot) {

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // unsuccessful uploads
                }, function () {
                    //successful uploads on complete

                    var downloadEVT = task.snapshot.downloadURL;
                    console.log(downloadEVT);

                    $scope.eventSave(downloadEVT);
                });
            }
            else $scope.eventSave("empty");
        };

         $scope.today = $filter('date')(new Date(), 'MM/dd/yy');

        // a method to create new todos; called by ng-submit
        $scope.eventSave = function (downloadEVT) {
            // calling $add on a synchronized array is like Array.push(),
            $scope.events.$add({
                job: $scope.eventJob,
                client: $scope.eventClient,
                brief: $scope.eventBrief,
                due_date: $scope.eventDate,
                attachment: downloadEVT,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                completed: false,
                status: 'pending',
                submitted: $scope.today,
                comment: 'No comment'
            });

            window.location = "#/Thankyou_events";

            // reset the todo input
            $scope.event = "";
        };


// Tracks the number of active Event jobs and seperates pending working
        $scope.$watch('events', function () {
            var total = 0;
            var remaining = 0;
            $scope.events.forEach(function (eventI) {
                total++;
                if (eventI.completed === false) {
                    remaining++;
                }
            });


            $scope.eventsPending = $filter("filter")($scope.events, {'status': 'pending'});
            $scope.eventsWorking = $filter("filter")($scope.events, {'status': 'working'});


            $scope.totalCount = total;
            $scope.remainingEvents = remaining;
            $scope.allChecked = remaining === 0;
        }, true);




    // Move to working from pending

         $scope.eventsStartTodo = function (index, item) {
             item.status = 'working';
            this.events[index].status = "working";
            this.events.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };


          // Unarchive item
         $scope.eventsUnarchive = function (index, item) {

            item.status = 'working';
            this.events[index].status = "working";
            item.completed = false;
            this.events[index].completed = false;
            this.events.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };



        // Archive item
        $scope.eventsCompleteTodo = function (index, item) {

            item.status = 'archived';
            this.events[index].status = "archived";
            item.completed = true;
            this.events[index].completed = true;

            this.events.$save(item);
            console.log(todo);

            window.location.reload();

        };

        // Delete item
        $scope.eventsRemoveTodo = function (index, item) {

            // FIREBASE: REMOVE ITEM FROM LIST
            $scope.events.$remove(item);

            window.location.reload();
        };


//Sortable

        $scope.sortableEventsOptions = {
            stop: function (event, ui) {
                $scope.eventsWorking.forEach(function (todo) {
                    todo.priority = $scope.eventsWorking.indexOf(todo);
                    $scope.events.$save(todo);

                });
                $scope.eventsPending.forEach(function (todo) {
                    todo.priority = $scope.eventsPending.indexOf(todo);
                    $scope.events.$save(todo);
                });
            }
        }



        //save updated date
        $scope.saveEventsEdit = function (data, item, field) {

            item[field] = data;

            $scope.events.$save(item);
            console.log(data, item);
        };




/// Naming jobs functions


        $scope.addNaming = function () {

            var storage = firebase.storage();
            var storageRef = storage.ref("Naming_jobs");
            var filesRef = storageRef.child('files');

            var filesSelected = document.getElementById("nameImg").files;
            if (filesSelected.length > 0) {
                var file = filesSelected[0];

                console.log("Let's upload a file!");
                console.log(file);

                if (file.size >= 20000000){
                    alert("file should be less than 20MB")
                    return false
                }




                var task = storageRef.child(file.name).put(file);

                //

                task.on('state_changed', function (snapshot) {

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // unsuccessful uploads
                }, function () {
                    //successful uploads on complete

                    var downloadNMG = task.snapshot.downloadURL;
                    console.log(downloadNMG);

                    $scope.save(downloadNMG);
                });
            }
            else $scope.save("empty");
        };

         $scope.today = $filter('date')(new Date(), 'MM/dd/yy');

        // a method to create new todos; called by ng-submit
        $scope.save = function (downloadNMG) {
            // calling $add on a synchronized array is like Array.push(),
            $scope.naming.$add({
                job: $scope.namingJob,
                client: $scope.namingClient,
                brief: $scope.namingBrief,
                due_date: $scope.namingDate,
                attachment: downloadNMG,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                completed: false,
                status: 'pending',
                submitted: $scope.today,
                comment: 'No comment'
            });

            window.location = "#/Thankyou_naming";

            // reset the todo input
            $scope.namingn = "";
        };// except that it saves the changes to our database!


// TTracks the number of active Naming jobs and seperates pending working
        $scope.$watch('naming', function () {
            var total = 0;
            var remaining = 0;
            $scope.naming.forEach(function (namingI) {
                total++;
                if (namingI.completed === false) {
                    remaining++;
                }
            });


            $scope.namingPending = $filter("filter")($scope.naming, {'status': 'pending'});
            $scope.namingWorking = $filter("filter")($scope.naming, {'status': 'working'});


            $scope.totalCount = total;
            $scope.remainingNaming = remaining;
            $scope.allChecked = remaining === 0;
        }, true);




    // Move to working from pending

         $scope.namingStartTodo = function (index, item) {
             item.status = 'working';
            this.naming[index].status = "working";
            this.naming.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };


          // Unarchive item
         $scope.namingUnarchive = function (index, item) {

            item.status = 'working';
            this.naming[index].status = "working";
            item.completed = false;
            this.naming[index].completed = false;
            this.naming.$save(item);
            console.log(item);
            console.log(status);

            window.location.reload();
        };



        // Archive item
        $scope.namingCompleteTodo = function (index, item) {

            item.status = 'archived';
            this.naming[index].status = "archived";
            item.completed = true;
            this.naming[index].completed = true;

            this.naming.$save(item);
            console.log(todo);

            window.location.reload();

        };

        // Delete item
        $scope.namingRemoveTodo = function (index, item) {

            // FIREBASE: REMOVE ITEM FROM LIST
            $scope.naming.$remove(item);

            window.location.reload();
        };





        // update data functions

        //save updated date
        $scope.saveNameEdit = function (data, item, field) {

            item[field] = data;

            $scope.naming.$save(item);
            console.log(data, item);


        };

/* possible repeat


        $scope.startNameTodo = function (index, item) {

            // UPDATE STATUS TO IN PROGRESS AND SAVE

            item.status = 'working';
            this.naming[index].status = "working";
            this.naming.$save(item);
            console.log(item);
            console.log(status);
            window.location.reload();
        };


        // MARK TODO AS COMPLETE METHOD
        $scope.completeNameTodo = function (index, item) {



            // UPDATE STATUS TO COMPLETE AND SAVE
            item.status = 'archived';
            this.naming[index].status = "archived";
            item.completed = true;
            this.naming[index].completed = true;


            this.naming.$save(item);
            console.log(todo);

        };

        // REMOVE TODO ITEM METHOD
        $scope.removeNameTodo = function (index, item) {


            // FIREBASE: REMOVE ITEM FROM LIST
            $scope.naming.$remove(item);
        };

*/
//Sortable

        $scope.sortableNamingOptions = {
            stop: function (event, ui) {
                $scope.namingWorking.forEach(function (todo) {
                    todo.priority = $scope.namingWorking.indexOf(todo);
                    $scope.naming.$save(todo);

                });
                $scope.namingPending.forEach(function (todo) {
                    todo.priority = $scope.namingPending.indexOf(todo);
                    $scope.naming.$save(todo);
                });
            }
        }



        //save updated date
        $scope.saveNamingEdit = function (data, item, field) {

            item[field] = data;

            $scope.naming.$save(item);
            console.log(data, item);
        };

    }
]);
