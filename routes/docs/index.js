const express = require('express');
const router = express.Router();

const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

router.get('/', (req, res) => res.redirect('/docs/swagger-ui?url=/docs/api-spec.json'));
router.use('/swagger-ui', express.static(pathToSwaggerUi));
router.get('/api-spec.json', (req, res) => res.json(require('./api-spec.json')));

module.exports = router;