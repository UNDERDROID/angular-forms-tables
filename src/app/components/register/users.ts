import { EmailValidator } from "@angular/forms";

export interface user{
    firstName:string,
    lastName: string,
    email: EmailValidator,
    password: string,
    phone:string,
    address: string,
    postalCode: string
}