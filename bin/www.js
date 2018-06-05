const app = require('../index');

app.listen(app.get('PORT'), () => console.log(`Listening at ${app.get('PORT')}`));