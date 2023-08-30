declare module "multer" {
    import { Request } from "express";
  
    export interface File extends Express.Multer.File {}
  
    export interface Multer {
      single(fieldname: string): any;
      array(fieldname: string, maxCount?: number): any;
      fields(fields: Array<{ name: string }>): any;
      none(): any;
    }
  
    export function memoryStorage(): any;
  
    export function diskStorage(options: any): any;
  
    export function multer(options?: any): Multer;
  }