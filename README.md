# ng-fancy-places-autocomplete
A simple diective for places autocomplete and quickly preview the place in a map. Now support google places api and baidu places api.

# Demo
<a href="https://github.com/jacklma718/ng-fancy-places-autocomplete/index.html" target="_blank">
  DEMO
</a>

# Usage
include the required libraries <br>
this package is required jQuery please include jQuery on your project <br>

google places api:
```html
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
```

baidu places api
```html
<script src="http://api.map.baidu.com/api?v=2.0&ak=YOUR API KEY"></script>
```

```javascript
Declare a dependency on your angular app
var ngApp = angular.module('ngApp', ['ng-fancy-places-autocomplete']);
```

Add the directive to textbox, now enable places autocomplete with a map popup preview option
```html
<input type="text" ng-fancy-places-autocomplete ng-model="location" map-popup>
```

or you can only enable the places autocmplete
```html
<input type="text" ng-fancy-places-autocomplete ng-model="location">
```

#### Options:
map-popup &nbsp;&nbsp; - map popup preview window <br>
city &nbsp;&nbsp; - choose a specific city  &nbsp;&nbsp; # now only for baidu


# TODO
test case
