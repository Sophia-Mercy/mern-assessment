const { v4: uuidv4 } = require('uuid');
const roomModel = require('../models/roomModel');
const { validateRoom } = require('../utils/validators');

const getAllRooms = (req, res) => {
  let filteredRooms = [...roomModel.getAll()];
  const { type, status, minPrice, maxPrice, floor, page = 1, limit = 10 } = req.query;

  if (type) filteredRooms = filteredRooms.filter(r => r.type.toLowerCase() === type.toLowerCase());
  if (status) filteredRooms = filteredRooms.filter(r => r.status.toLowerCase() === status.toLowerCase());
  if (floor) filteredRooms = filteredRooms.filter(r => r.floor == floor);
  if (minPrice) filteredRooms = filteredRooms.filter(r => r.pricePerNight >= parseFloat(minPrice));
  if (maxPrice) filteredRooms = filteredRooms.filter(r => r.pricePerNight <= parseFloat(maxPrice));

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;

  res.json({
    total: filteredRooms.length,
    page: pageNum,
    limit: limitNum,
    data: filteredRooms.slice(startIndex, startIndex + limitNum)
  });
};


const getRoomById = (req, res) => {
  const room = roomModel.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
};


const createRoom = (req, res) => {
  const error = validateRoom(req.body);
  if (error) return res.status(400).json({ error });

  const rooms = roomModel.getAll();
  if (rooms.some(r => r.roomNumber === req.body.roomNumber)) {
    return res.status(409).json({ error: `Room number ${req.body.roomNumber} already exists` });
  }

  const newRoom = {
    id: uuidv4(),
    roomNumber: req.body.roomNumber,
    type: req.body.type,
    pricePerNight: parseFloat(req.body.pricePerNight),
    capacity: parseInt(req.body.capacity),
    amenities: req.body.amenities || [],
    status: req.body.status || 'available',
    floor: req.body.floor? parseInt(req.body.floor) : 1,
    createdAt: new Date().toISOString()
  };

  rooms.push(newRoom);
  res.status(201).json(newRoom);
};


const updateRoom = (req, res) => {
  const rooms = roomModel.getAll();
  const index = rooms.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Room not found' });

  const error = validateRoom(req.body, true);
  if (error) return res.status(400).json({ error });

  rooms[index] = {...rooms[index],...req.body, id: rooms[index].id, updatedAt: new Date().toISOString() };
  res.json(rooms[index]);
};


const deleteRoom = (req, res) => {
  let rooms = roomModel.getAll();
  const initialLength = rooms.length;
  rooms = rooms.filter(r => r.id!== req.params.id);
  roomModel.setAll(rooms);

  if (rooms.length === initialLength) return res.status(404).json({ error: 'Room not found' });
  res.status(204).send();
};


const updateRoomStatus = (req, res) => {
  const room = roomModel.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const { status } = req.body;
  if (!status ||!['available', 'booked', 'maintenance'].includes(status)) {
    return res.status(400).json({ error: 'status must be available, booked, or maintenance' });
  }

  room.status = status;
  room.updatedAt = new Date().toISOString();
  res.json(room);
};

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, updateRoomStatus };