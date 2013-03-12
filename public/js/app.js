(function () {
  
  window.Application = can.Construct({
    //statics
    Models: {},
    Controllers: {},
    boot: function(data) {
      
      new window.Application.Controllers.Chat('#main', data);
    }
  }, {
    // instances  
  });

})()
