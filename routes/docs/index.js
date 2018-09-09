const express = require('express');
const path = require('path');

const router = express.Router();

const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

router.get('/', (req, res) => res.redirect('/api/docs/swagger-ui?url=/api/docs/api-spec.yaml'));
router.use('/swagger-ui', express.static(pathToSwaggerUi));
router.use('/api-spec.yaml', express.static(path.join(__dirname, '/api-spec.yaml')));

module.exports = router;
