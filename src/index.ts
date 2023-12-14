import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';
import { createCardController, getCardStatusController } from './controller/card.controller';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const port: number = Number(process.env.PORT);

app.get('/', async(req: Request, res: Response) => {
      console.log(`${__dirname}`)
      console.log(process.cwd())
    res.send('API Is Healthy!');
});
app.post('/generate_new_card', createCardController)
app.get('/get_card_status', getCardStatusController)

//connect to the initialised mongodb docker instance
mongoose
	.connect(String(process.env.MONGODB_URL))
	.then(() => console.log('mongodb is connected'))
	.catch(err => console.log(err));

app.listen(port, (): void => {
    console.log(`server is running on ${port}` )
})