import express from 'express';
import cors from 'cors';
import messages from './routes/messages';

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: '*',
        allowedHeaders: '*',
        exposedHeaders: ['Mcp-Session-Id'],
    })
);
app.use('/messages', messages);

app.listen(3001, () => {
    console.log(`Example app listening on port 3001`);
});
