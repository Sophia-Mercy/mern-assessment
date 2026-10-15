// In-memory fake database - No DB required
let rooms = [];

module.exports = {
  getAll: () => rooms,
  setAll: (newRooms) => { rooms = newRooms },
  findById: (id) => rooms.find(r => r.id === id || r.roomNumber === id)
};