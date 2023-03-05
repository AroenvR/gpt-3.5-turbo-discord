const express = require('express');
const cors = require('cors');
const app = express();
import { constants } from "../util/constants";

// https://www.youtube.com/watch?v=-MTSQjw5DrM&t=242s

app.options('*', cors());
app.use(express.json());
app.listen(constants.PORT, () => console.log(`App running on: http://localhost:${constants.PORT}/`));

export default app;