const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "FAO API Documentation",
      version: "1.0.0",
      description: "This is the api documentation of FAO.",
    },
    servers: [
      {
        url: "http://localhost:4000/api", // Local development server
        description: "Local server",
      },
      {
        url: "https://api.nenafoodsecurity.org/api", // Production server
        description: "Production server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
