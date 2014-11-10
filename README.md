# generator-arcular

> [Yeoman](http://yeoman.io) generator for AngularJS - created by [Arcus Solutions](http://arcussolutions.com).


## Installation

To install generator-arcular from npm, run:

```bash
$ npm install -g generator-arcular
```

Make a new directory

```bash
$ mkdir my-angular-project && cd $_
```

Initiate the generator

```bash
$ yo arcular [app-name]
```

## Usage

To build the project, use Grunt:

```bash
$ grunt
```

To setup a local preview:

```bash
$ grunt serve
```

## Environments

This generator uses [grunt-ng-constant](https://github.com/werk85/grunt-ng-constant) for setting up environment-specific 
constants in your AngularJS project. Edit the environments.json file to add new available environments to the project:

```json
{
    "production": {
        "constants": {
            "DEBUG_MODE": false
        }
    },
    ...
}
```

Environments can be selected during build time as well as preview time. Environment defaults to "production":

```bash
$ grunt --ENV="development"
```

## Sub-generators

* [angular](#app) (aka [angular:app](#app))
* [arcular:controller](#controller)
* [arcular:directive](#directive)
* [arcular:filter](#filter)
* [arcular:data-service](#data-service)
* [arcular:model](#model)
* [arcular:repository](#repository)
* [arcular:utility](#utility)

### App

Sets up a new AngularJS app, generating all the boilerplate you need to get started. The app generator also optionally 
installs Bootstrap and additional AngularJS modules, such as angular-resource (installed by default).

```bash
$ yo arcular
```

### Controller

Generates a controller in `app/scripts/controllers`.

```bash
$ yo arcular:controller user
```

Above example produces `app/scripts/controllers/UserCtrl.js`.

```js
angular.module('myApp').controller('UserCtrl', ['$scope', 
    function ($scope) {
        
    });
```

### Directive

Generates a controller in `app/scripts/directives`.

```bash
$ yo arcular:directive input
```

Above example produces `app/scripts/directives/InputDirective.js` and `app/views/directives/input/root.html`.

```js
angular.module('myApp').directive('input', ['$scope', 
    function ($scope) {
        
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/views/directives/input/root.html',
            link: function(scope, element, attrs) {
            
            }
        };
        
    });
```

```html
<div></div>
```


### Filter

Generates a filter in `app/scripts/filters`.

```bash
$ yo arcular:filter user
```

Above example produces `app/scripts/filters/UserFilter.js`.

```js
angular.module('myApp').filter('UserFilter', [ 
    function () {
        
    });
```


### Data Service

#### What are Data Services?

While data services aren't native to AngularJS, they are a much more common structure in application development. The 
purpose of data services is to manage requests for information and populate models appropriately before returning the 
results to the caller for use. Data services are an important layer in application abstraction that allows one to properly 
manage requests for information and compartmentalize population into local structures.

Data services in AngularJS are built using factories and leverage the `$q` provider for handling promises.

#### Usage

Generates a data service in `app/scripts/data-services`.

```bash
$ yo arcular:data-service google
```

Above example produces `app/scripts/data-services/GoogleDataService.js`.

```js
angular.module('myApp').factory('GoogleDataService', ['$q', '$http',
    function ($q, $http) {
        
        return {
            
            getCollection: function() {
                 var deferred = $q.defer();
 
                 $http({
                     method: 'GET',
                     url: '#'
                 }).then(function() {
                     deferred.resolve();
                 }, function() {
                     deferred.reject();
                 });
 
                 return deferred.promise;
             }
            
        };
        
    });
```

### Model

#### What are Models?

AngularJS leverages the contents of the `$scope` for the model to be associated with the views, but we prefer to create 
more formal guidelines for the structures of our data sets. Our models provide rigid constaints on the data available for 
use within our application and help with standardizing usage with the views.

Like data services, Models are built using factories and leverage a custom utility `ModelGenerator` for populating 
content via a constructor.

#### Usage

Generates a model in `app/scripts/models`.

```bash
$ yo arcular:model user
```

Above example produces `app/scripts/models/UserModel.js`.

```js
angular.module('arcusApp').factory('UserModel', ['ModelGenerator',
    function (ModelGenerator) {

        var UserModel = function(data) {
            if (angular.isDefined(data)) {
                ModelGenerator.generateFromData('UserModel', this, data);
            }
        };

        UserModel.prototype = {

            id: 0,

            getId: function() {
                return this.id;
            }

        };

        return UserModel;

    }]);
```


### Repository

#### What are Repositories?

Repositories are outlets for making requests to specific destinations. Applications today often leverage multiple APIs 
or data sets, and each API often has some differences in the way requests are made. Through the use of repositories, we 
are able to specify formats for requests to different services making it easy for our data services to ask for information. 
The best part is, if these services ever change we only need update the repositories to accomodate the changes.

Like data services and models, Repositories are built using factories and leverage the `$http` provider to make 
requests.

#### Usage

Generates a repository in `app/scripts/repositories`.

```bash
$ yo arcular:repository twitter
```

Above example produces `app/scripts/repositories/TwitterRepository.js`.

```js
angular.module('arcusApp').factory('TwitterRepository', ['$q', '$http',
    function ($q, $http) {

        return {



        };

    }]);
```

### Utility

#### What are Utilities?

Not everything falls into the category of model, repository, or data service. Sometimes we just want some front-end 
tools or abstract classes that help keep our code clean and more efficient. Utilities don't have a special format, but 
are simply where things go when they don't belong anywhere else.

#### Usage

Generates a utility in `app/scripts/utilities`.

```bash
$ yo arcular:utility alert
```

Above example produces `app/scripts/utilities/AlertUtility.js`.

```js
angular.module('arcusApp').factory('AlertUtility', [
    function () {

        return {



        };

    }]);
```
