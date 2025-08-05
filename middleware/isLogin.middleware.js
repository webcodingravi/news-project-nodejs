import jwt from "jsonwebtoken"

const isLoggedIn=async (req, res, next) => {
    try {
        const token=req.cookies.token;
        if (!token)
            return res.redirect('/admin/');
        const tokenData=jwt.verify(token, process.env.JWT_SECRET)

        req.id=tokenData.id;
        req.role=tokenData.role;
        req.fullname=tokenData.fullname
        next();
    }
    catch (err) {
        res.status(401).send('Unauthorized: Invalid token');
    }
}

export default isLoggedIn