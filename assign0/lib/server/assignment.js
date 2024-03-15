import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs/promises";

export default (app) => {
  app.set("json spaces", 2);
  app.use(cors());
  app.use(bodyParser.json());
  app.post("/", async (req, res) => {
    console.log("Got answers:", req.body);
    await fs.writeFile("answers.json", JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  });
};
