import Client from '../models/Client.js';

// Add new client
export const addClient = async (req, res) => {
  try {
    const { fullName, idOrPassport, phone, address, licenseNumber } = req.body;

    // Validate required fields
    if (!fullName || !idOrPassport || !phone || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, idOrPassport, phone, and licenseNumber are required'
      });
    }

    // Check for existing client with same ID, phone, or license
    const existingClient = await Client.findOne({
      $or: [
        { idOrPassport: idOrPassport.toUpperCase() },
        { phone: phone.trim() },
        { licenseNumber: licenseNumber.toUpperCase() }
      ]
    });

    if (existingClient) {
      let message = 'Client already exists with ';
      if (existingClient.idOrPassport === idOrPassport.toUpperCase()) {
        message += 'this ID/Passport number';
      } else if (existingClient.phone === phone.trim()) {
        message += 'this phone number';
      } else if (existingClient.licenseNumber === licenseNumber.toUpperCase()) {
        message += 'this license number';
      }
      
      return res.status(400).json({
        success: false,
        message
      });
    }

    const client = await Client.create({
      fullName: fullName.trim(),
      idOrPassport: idOrPassport.toUpperCase(),
      phone: phone.trim(),
      address: address ? address.trim() : undefined,
      licenseNumber: licenseNumber.toUpperCase()
    });

    return res.status(201).json({
      success: true,
      message: 'Client added successfully',
      data: {
        _id: client._id,
        fullName: client.fullName,
        idOrPassport: client.idOrPassport,
        phone: client.phone,
        address: client.address,
        licenseNumber: client.licenseNumber
      }
    });

  } catch (error) {
    console.error('Error adding client:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to add client. Please try again.'
    });
  }
};

// Fetch all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({})
      .select('_id fullName idOrPassport phone address licenseNumber createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch clients. Please try again.'
    });
  }
};

// Get single client by ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id).lean();

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: client
    });

  } catch (error) {
    console.error('Error fetching client:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch client. Please try again.'
    });
  }
};
