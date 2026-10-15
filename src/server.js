const app = require('./app');

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Hotel Room Inventory API running on http://localhost:${PORT}`);
});