import express from 'express';
import {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';

const router = express.Router();

// POST /api/clients - Add new client
router.post('/', addClient);

// GET /api/clients - Fetch all clients
router.get('/', getAllClients);

// GET /api/clients/:id - Get single client by ID
router.get('/:id', getClientById);

// PUT /api/clients/:id - Update client
router.put('/:id', updateClient);

// DELETE /api/clients/:id - Delete client
router.delete('/:id', deleteClient);

export default router;
