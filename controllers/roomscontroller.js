var RoomsModel = require('../models/roomsmodel')
,   RoomsController = {

  index: function (req, res) {
   
    RoomsModel.find({}, function (err, rooms) {
      if (err) return res.json(500, {error: "internal"});
      res.json(200, rooms);
    });
  },
  show: function (req, res) {
    RoomsModel.findById(req.params.id, function (err, room) {
      if (err) return res.json(500, {error: "internal"});
      res.json(200, room);
    });
  },
  create: function (req, res) {
    RoomsModel.create(req.body, function (err, room) {
      if (err) return res.json(500, {error: "internal"});
      res.json(201, room);
    });
  },
  update: function (req, res) {},
  delete: function (req, res) {}

};

module.exports = RoomsController;

