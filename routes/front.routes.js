import { Router } from "express";
import { index, articleByCategories, singleArticle, search, author, addComment } from "../controller/site.controller.js";

const frontRouter = Router();

frontRouter.get("/", index);
frontRouter.get('/category/:name', articleByCategories);
frontRouter.get('/single/:id', singleArticle);
frontRouter.get('/search', search);
frontRouter.get('/author/:name', author);
frontRouter.post('/single/:id', addComment)

export default frontRouter;