 import { Request, Response, NextFunction } from "express";
 
type ExpressRouteFunc = (req: Request, res: Response, next?: NextFunction) => void | Promise<void>;

 export function generic_function(injection: injection_type): ExpressRouteFunc {
   return async function(req: Request, res: Response) {
   ....................
    logic
    ....................
   }
 }
