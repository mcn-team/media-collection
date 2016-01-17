'use strict';

(function() {
    // Books Controller Spec
    describe('Books Controller Tests', function() {
        // Initialize global variables
        var BooksController,
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

            // Initialize the Books controller.
            BooksController = $controller('BooksController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Book object fetched from XHR', inject(function(Books) {
            // Create sample Book using the Books service
            var sampleBook = new Books({
                name: 'New Book'
            });

            // Create a sample Books array that includes the new Book
            var sampleBooks = [sampleBook];

            // Set GET response
            $httpBackend.expectGET('books').respond(sampleBooks);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.books).toEqualData(sampleBooks);
        }));

        it('$scope.findOne() should create an array with one Book object fetched from XHR using a bookId URL parameter', inject(function(Books) {
            // Define a sample Book object
            var sampleBook = new Books({
                name: 'New Book'
            });

            // Set the URL parameter
            $stateParams.bookId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/books\/([0-9a-fA-F]{24})$/).respond(sampleBook);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.book).toEqualData(sampleBook);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Books) {
            // Create a sample Book object
            var sampleBookPostData = new Books({
                name: 'New Book'
            });

            // Create a sample Book response
            var sampleBookResponse = new Books({
                _id: '525cf20451979dea2c000001',
                name: 'New Book'
            });

            // Fixture mock form input values
            scope.name = 'New Book';

            // Set POST response
            $httpBackend.expectPOST('books', sampleBookPostData).respond(sampleBookResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Book was created
            expect($location.path()).toBe('/books/' + sampleBookResponse._id);
        }));

        it('$scope.update() should update a valid Book', inject(function(Books) {
            // Define a sample Book put data
            var sampleBookPutData = new Books({
                _id: '525cf20451979dea2c000001',
                name: 'New Book'
            });

            // Mock Book in scope
            scope.book = sampleBookPutData;

            // Set PUT response
            $httpBackend.expectPUT(/books\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/books/' + sampleBookPutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid bookId and remove the Book from the scope', inject(function(Books) {
            // Create new Book object
            var sampleBook = new Books({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Books array and include the Book
            scope.books = [sampleBook];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/books\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleBook);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.books.length).toBe(0);
        }));
    });
}());