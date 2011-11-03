(function () {
  "use strict";
  beforeEach(function () {
    this.addMatchers({
      toBeWithin: function(args) {
        return (Math.abs(args.expected - this.actual) < args.range);
      }
    });
  });
}());
