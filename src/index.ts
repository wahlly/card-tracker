import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const port: number = Number(process.env.PORT);


app.get('/', (req: Request, res: Response) => {
    res.send('API Is Healthy!!');
});
//connect to the initialised mongodb docker instance
mongoose
	.connect(String(process.env.MONGODB_URL))
	.then(() => console.log('mongodb is connected'))
	.catch(err => console.log(err));

app.listen(port, (): void => {
    console.log(`server is running on ${port}` )
})