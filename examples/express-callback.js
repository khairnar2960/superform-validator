const express = require('express');
const expressValidator = require('superform-validator/express');

const app = express();
app.use(expressValidator.plugin);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/submit', async (req, res) => {
    const validation = await req.validateBody({
        mobile: 'require|integer|mobile|cast::integer',
        email: 'require|email|maxLength(128)|cast::lower|trim'
    });

    if (validation.valid) {
        res.json({
            message: 'Validation Passed',
            data: validation.validated
        });
    } else {
        res.status(400).json({
            message: 'Validation Failed',
            errors: validation.errors
        });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
