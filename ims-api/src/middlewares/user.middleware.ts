import { UserRole } from "../entities/user/constants.user";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface LoggedUser {
  username: string,
  email: string,
  phone: string,
  id: number,
  role: number,
}

declare global {
  namespace Express {

      interface Request {
          currentUser? : LoggedUser;
      }
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try{
      const user = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (!user) {
      // return res.status(401).json({
      //   message: "Unauthorized",
      // });
      console.log( user, "this is middleware user-log");
      return res.redirect(301, "http://127.0.0.1:5500/ims-webapp/pages/login.html");
    }
    if (user.role == UserRole.ADMIN) {
      req.currentUser = user;
      next();
      //log!
    } else {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }
    } catch (err) {

      // return res.status(401).json({
      //   message: "Unauthorized",
      // });
      console.log( err, "this is middleware err-log");
      return res.redirect("http://127.0.0.1:5500/ims-webapp/pages/login.html");

    }
    
  }
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (user) {
      req.currentUser = user;
      next();
    } else {
      return res.status(403).json({
        message: "Please login to perform this action",
      });
    }
  }
};




