const express = require('express');
const { validateBody } = require('superform-validator/express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bodyMiddleware = validateBody({
    mobile: 'require|integer|mobile|cast::integer',
    email: 'require|email|maxLength(128)|cast::lower|trim'
});

app.post('/submit', [bodyMiddleware], (req, res) => {
    res.json({
        message: 'Validation Passed',
        data: req.validated
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
