'use strict';

(function() {
    // Movies Controller Spec
    describe('Movies Controller Tests', function() {
        // Initialize global variables
        var VideosController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Movies controller.
            VideosController = $controller('VideosController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Movie object fetched from XHR', inject(function(Movies) {
            // Create sample Movie using the Movies service
            var sampleVideo = new Movies({
                name: 'New Movie'
            });

            // Create a sample Movies array that includes the new Movie
            var sampleVideos = [sampleVideo];

            // Set GET response
            $httpBackend.expectGET('movies').respond(sampleVideos);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.movies).toEqualData(sampleVideos);
        }));

        it('$scope.findOne() should create an array with one Movie object fetched from XHR using a videoId URL parameter', inject(function(Movies) {
            // Define a sample Movie object
            var sampleVideo = new Movies({
                name: 'New Movie'
            });

            // Set the URL parameter
            $stateParams.videoId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/movies\/([0-9a-fA-F]{24})$/).respond(sampleVideo);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.movie).toEqualData(sampleVideo);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Movies) {
            // Create a sample Movie object
            var sampleVideoPostData = new Movies({
                name: 'New Movie'
            });

            // Create a sample Movie response
            var sampleVideoResponse = new Movies({
                _id: '525cf20451979dea2c000001',
                name: 'New Movie'
            });

            // Fixture mock form input values
            scope.name = 'New Movie';

            // Set POST response
            $httpBackend.expectPOST('movies', sampleVideoPostData).respond(sampleVideoResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Movie was created
            expect($location.path()).toBe('/movies/' + sampleVideoResponse._id);
        }));

        it('$scope.update() should update a valid Movie', inject(function(Movies) {
            // Define a sample Movie put data
            var sampleVideoPutData = new Movies({
                _id: '525cf20451979dea2c000001',
                name: 'New Movie'
            });

            // Mock Movie in scope
            scope.movie = sampleVideoPutData;

            // Set PUT response
            $httpBackend.expectPUT(/movies\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/movies/' + sampleVideoPutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid videoId and remove the Movie from the scope', inject(function(Movies) {
            // Create new Movie object
            var sampleVideo = new Movies({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Movies array and include the Movie
            scope.movies = [sampleVideo];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/movies\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleVideo);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.movies.length).toBe(0);
        }));
    });
}());
