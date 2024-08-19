import { isAdmin, isLoggedIn } from "./middlewares/user.middleware";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { AuthRouter } from "./routes/auth.routes";
import { UserRouter } from "./routes/user.routes";
import { ProductRouter } from "./routes/product.routes";
import { CategoryRouter } from "./routes/category.routes";
import { CustomerRouter } from "./routes/customer.routes";
import { SaleRouter } from "./routes/sale.routes";
import { OrderRouter } from "./routes/order.routes";
import { PaymentPlanRouter } from "./routes/paymentplan.routes";

const app: Application = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// console.log(`We are in : ${process.env.NODE_ENV}`);

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const BASE_URL = "/api/v1";

app.use("/auth/v1", AuthRouter);
app.use(`${BASE_URL}/user`, isLoggedIn, isAdmin, UserRouter);
app.use(`${BASE_URL}/customer`, isLoggedIn, CustomerRouter);
app.use(`${BASE_URL}/category`, isLoggedIn, CategoryRouter);
app.use(`${BASE_URL}/product`, isLoggedIn, ProductRouter);
app.use(`${BASE_URL}/order`, isLoggedIn, OrderRouter);
app.use(`${BASE_URL}/sale`, isLoggedIn, SaleRouter);
app.use(`${BASE_URL}/payment-plan`, isLoggedIn, PaymentPlanRouter);


export default app;
