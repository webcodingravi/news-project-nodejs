import express from "express"
import dotEnv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import path from "path";
import { fileURLToPath } from 'url';
import expressEjsLayouts from "express-ejs-layouts";
import frontRouter from "./routes/front.routes.js";
import adminRouter from "./routes/admin.routes.js";
import minifyHTML from "express-minify-html-terser";
import compression from "compression";

const app=express();
dotEnv.config();

// Database
mongoose.connect(process.env.DB)
    .then(() => console.log("Database Successfully Conected!"))
    .catch((err) => console.log("Failed Database Conected!", err.message))

const PORT=process.env.PORT

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(expressEjsLayouts)
app.set('layout', 'layout')

app.use(compression())

app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

// View Engine
app.set('view engine', 'ejs');


app.use('/admin', (req, res, next) => {
    res.locals.layout='admin/layout'
    next();
})
app.use("/admin", adminRouter);

app.use("/", frontRouter);


app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))