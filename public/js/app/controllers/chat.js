(function (RoomModel, Templates){
var Chat = can.Control({
  init: function (element, options) {
  console.log('Chat controller iniitalized ', arguments);
  },

  "#outgoing keyup": function(textarea) {
    console.log(event);
    if (!event.shiftKey && event.which==13){
      var content = textarea.val();
      this.socket.emit('message',{room:this.room._id, message:content, from:this.options.user.displayName});
      this.element.find('#incoming').append('<p style="color: green">' + this.options.user.displayName + ' says ' + content + '</p>');
      textarea.val('');
    }
  },

  "form submit": function (form, event) {
    event.preventDefault();
    var title = $(form).children('input[type="text"]').val();
    var Room = new RoomModel({title: title});
    Room.save(function (room) {
      console.log(room);
      // can.route.attr({ room_id: room._id });
      window.location.hash = '#!' + room._id;
    });
  },

  "route": function () {
    var self = this;
    RoomModel.findAll({}, function( rooms ){
      self.element.html(Templates["pages/partial.rooms.jade"]({rooms:rooms}));
    });
  },

  ":room_id route":function (data) {
    var self = this;
    RoomModel.findOne({id: data.room_id}, function(room) {
      self.room = room;
      console.log(room);
      self.element.html(Templates["pages/partial.room.jade"]);
      // socket.leave();
      self.socket = io.connect(window.location.origin);
      self.socket.emit('join', {room: data.room_id, from:self.options.user.displayName});
      self.socket.on('message', function(data) {
        self.element.find('#incoming').append( '<p style="font-weight: bold">' + data.message + '</p>');
      });
   });
  }
});
  window.Application.Controllers.Chat = Chat;
})(window.Application.Models.Room, window.Application.Templates);

