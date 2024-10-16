/**
 * Common response handler
 *
 */
const RESPONSE = {
  Success: (response, data = { message: "OK Response" }) => {
    return response.status(200).json({ data, status: 200 });
  },

  Created: (response, data = { message: "Sucessfully created resource" }) => {
    return response.status(201).json({ data, status: 201 });
  },

  BadRequest: (response, error = { message: "Bad request" }) => {
    return response.status(400).json({ error, status: 400 });
  },

  Unauthorized: (response, error = { message: "Unauthorized" }) => {
    return response.status(401).json({ error, status: 401 });
  },

  ServerError: (response, error = { message: "Server error" }) => {
    return response.status(500).json({ error, status: 500 });
  },
};

module.exports = RESPONSE;
