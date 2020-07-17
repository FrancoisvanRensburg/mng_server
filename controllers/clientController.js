const Company = require('../models/Company');
const Client = require('../models/Client');

// Create a client
exports.createClient = async (req, res) => {
  const { name, contactperson, email, description, contnumber } = req.body;

  const clientFields = {};
  if (name) clientFields.name = name;
  if (contactperson) clientFields.contactperson = contactperson;
  if (email) clientFields.email = email;
  if (description) clientFields.description = description;
  if (contnumber) clientFields.contnumber = contnumber;
  clientFields.company = req.data.comp;

  try {
    const client = new Client(clientFields);
    const vendor = await Company.findOne({ _id: req.data.comp });

    vendor.clients.unshift(client._id);

    client.save();
    vendor.save();

    res.json(client);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.updateClient = async (req, res) => {
  const { name, description, contactperson, contemail, contnumber } = req.body;

  const clientFields = {};
  if (name) clientFields.name = name;
  if (description) clientFields.description = description;
  if (contactperson) clientFields.contactperson = contactperson;
  if (contemail) clientFields.contemail = contemail;
  if (contnumber) clientFields.contnumber = contnumber;

  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.clientId },
      { $set: clientFields },
      { new: true }
    );
    client.save();

    res.json(client);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Get all clients for a company
exports.getAllClients = async (req, res) => {
  try {
    const client = await Client.find({ company: req.data.comp }).populate(
      'projects'
    );

    res.json(client);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Get client by id
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.clientId });

    res.json(client);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
