import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { Projectrouter } from "../modules/project/project.routes";



const route = Router();
const modules = [
  { path: "/auth", route: authRoute},
  {path:"/project",route:Projectrouter},

];

modules.forEach((module) => {
  route.use(module.path, module.route);
});

export default route;