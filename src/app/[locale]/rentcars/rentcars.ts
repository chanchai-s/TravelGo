import { Request, Response } from "express";
import { uploadMedia, getMediaFeed, toggleMediaLike, getMediaComments, addMediaComment } from "./controllers/media.controllers";

const mediaRoutes = express.Router();

mediaRoutes.post("/upload", authCheck, upload.single("file"), uploadMedia);
mediaRoutes.get("/feed", getMediaFeed);
mediaRoutes.post("/:id/like", authCheck, toggleMediaLike);
mediaRoutes.get("/:id/comments", getMediaComments);
mediaRoutes.post("/:id/comments", authCheck, addMediaComment);
mediaRoutes.get("/:id", getMediaFeed);

export default mediaRoutes;