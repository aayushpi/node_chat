var mongoose = require('mongoose')
,		RoomSchema = mongoose.Schema({
				title: String
		})

,		RoomsModel = mongoose.model('room', RoomSchema);

module.exports = RoomsModel;

