import express from "express"
import "dotenv/config"
import cors from "cors";
const app = express();
app.use(cors({
    origin: "*"
}));


app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`listening at port ${PORT}`);
});


