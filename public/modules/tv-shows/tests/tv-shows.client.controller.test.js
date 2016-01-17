'use strict';

(function() {
    // Tv shows Controller Spec
    describe('Tv shows Controller Tests', function() {
        // Initialize global variables
        var TvShowsController,
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

            // Initialize the Tv shows controller.
            TvShowsController = $controller('TvShowsController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Tv show object fetched from XHR', inject(function(TvShows) {
            // Create sample Tv show using the Tv shows service
            var sampleTvShow = new TvShows({
                name: 'New Tv show'
            });

            // Create a sample Tv shows array that includes the new Tv show
            var sampleTvShows = [sampleTvShow];

            // Set GET response
            $httpBackend.expectGET('tv-shows').respond(sampleTvShows);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.tvShows).toEqualData(sampleTvShows);
        }));

        it('$scope.findOne() should create an array with one Tv show object fetched from XHR using a tvShowId URL parameter', inject(function(TvShows) {
            // Define a sample Tv show object
            var sampleTvShow = new TvShows({
                name: 'New Tv show'
            });

            // Set the URL parameter
            $stateParams.tvShowId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/tv-shows\/([0-9a-fA-F]{24})$/).respond(sampleTvShow);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.tvShow).toEqualData(sampleTvShow);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(TvShows) {
            // Create a sample Tv show object
            var sampleTvShowPostData = new TvShows({
                name: 'New Tv show'
            });

            // Create a sample Tv show response
            var sampleTvShowResponse = new TvShows({
                _id: '525cf20451979dea2c000001',
                name: 'New Tv show'
            });

            // Fixture mock form input values
            scope.name = 'New Tv show';

            // Set POST response
            $httpBackend.expectPOST('tv-shows', sampleTvShowPostData).respond(sampleTvShowResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Tv show was created
            expect($location.path()).toBe('/tv-shows/' + sampleTvShowResponse._id);
        }));

        it('$scope.update() should update a valid Tv show', inject(function(TvShows) {
            // Define a sample Tv show put data
            var sampleTvShowPutData = new TvShows({
                _id: '525cf20451979dea2c000001',
                name: 'New Tv show'
            });

            // Mock Tv show in scope
            scope.tvShow = sampleTvShowPutData;

            // Set PUT response
            $httpBackend.expectPUT(/tv-shows\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/tv-shows/' + sampleTvShowPutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid tvShowId and remove the Tv show from the scope', inject(function(TvShows) {
            // Create new Tv show object
            var sampleTvShow = new TvShows({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Tv shows array and include the Tv show
            scope.tvShows = [sampleTvShow];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/tv-shows\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleTvShow);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.tvShows.length).toBe(0);
        }));
    });
}());