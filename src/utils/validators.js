const validateRoom = (body, isUpdate = false) => {
  const { roomNumber, type, pricePerNight, capacity, status } = body;

  if (!isUpdate) {
    if (!roomNumber ||!type ||!pricePerNight ||!capacity) {
      return 'roomNumber, type, pricePerNight, capacity are required';
    }
  }

  if (type &&!['Single', 'Double', 'Suite', 'Deluxe'].includes(type)) {
    return 'type must be Single, Double, Suite, or Deluxe';
  }

  if (status &&!['available', 'booked', 'maintenance'].includes(status)) {
    return 'status must be available, booked, or maintenance';
  }

  if (pricePerNight && (isNaN(pricePerNight) || pricePerNight <= 0)) {
    return 'pricePerNight must be a positive number';
  }

  return null;
};

module.exports = { validateRoom };