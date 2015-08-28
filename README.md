# ng-places-autocomplete
A fancy and simple diective for places autocomplete and quickly preview the place in a map window. Now support google places api and baidu places api.

<img  src="https://raw.github.com/jacklam718/ng-places-autocomplete/gh-pages/screenshots/demo1.png" width="450px" height="350px" />

# Demo
<a href="http://jacklam718.github.io/ng-places-autocomplete" target="_blank">
  DEMO
</a>

# Install
#### Bower:
```bash
bower install --save ng-fancy-places-autocomplete
```

# Usage
Include the required libraries. <br>
This package is required jQuery please include jQuery on your project. <br>

#### Google places api:
```html
<script src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
```

#### Baidu places api:
```html
<script src="http://api.map.baidu.com/api?v=2.0&ak=YOUR API KEY"></script>
```

#### Import this library on your project:
```html
<script src="build/ng-places-autocomplete.min.js"></script>
<link rel="stylesheet" href="build/ng-places-autocomplete.min.css">
```

#### Declare a dependency on your angular app:
```javascript
var ngApp = angular.module('ngApp', ['ng-places-autocomplete']);
```

#### Add the directive to textbox, now enable places autocomplete with a map popup preview option:
```html
<input type="text" ng-places-autocomplete ng-model="location" map-popup>
```

#### Or you can only enable the places autocmplete:
```html
<input type="text" ng-places-autocomplete ng-model="location">
```

#### Options:
map-popup &nbsp;&nbsp; - map popup preview window <br>
city &nbsp;&nbsp; - choose a specific city  &nbsp;&nbsp; # now only for baidu <br>
country &nbsp;&nbsp; - choose a country &nbsp;&nbsp; # now only for google <br>
lang &nbsp;&nbsp; - choose language &nbsp;&nbsp; # now only for google <br>

# TODO:
test case
