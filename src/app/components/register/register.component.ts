import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { user } from './users';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
registerForm: FormGroup; 
registrationError:string = ''
Users :user[]=[];

constructor(private fb: FormBuilder, private userService: UserService, private router: Router ){
  this.registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(63)]],
    password: ['', [Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)]],
    phone: ['', [Validators.required, Validators.pattern((/^(\+977\d{10}|\d{10})$/))]],
    address: ['', Validators.required],
    postalCode: ['', Validators.required],
    role: ['user', Validators.required]
  })
}
onSubmit(){
  if (this.registerForm.valid) {
    const newUser: user = this.registerForm.value;

    this.userService.checkEmail(this.registerForm.get('email')?.value).subscribe(
      (emailResults) => {
        if(emailResults.length>0){
          this.registrationError='Email already exists'
        }else{
          this.userService.checkPhone(newUser.phone).subscribe(
            (phoneResults)=>{
              if(phoneResults.length>0){
                this.registrationError='Phone no already used'
              }else{
                this.userService.addUser(newUser).subscribe(
                  (response) =>{
                    console.log('User added');
                    this.Users.push(response);
                    this.registrationError=''
                    this.registerForm.reset()
            
                this.Users.push(newUser);
               this.router.navigateByUrl('/login')
            
              },
              (error) => {
                console.error('Error adding user:', error);
                this.registrationError = 'An error occurred. Please try again.';
              }
            );
          }
        },
        (error) => {
          console.error('Error checking phone:', error);
          this.registrationError = 'An error occurred while checking phone number.';
        }
      );
    }
  },
  (error) => {
    console.error('Error checking email:', error);
    this.registrationError = 'An error occurred while checking email.';
  }
);
}
}
}
            

  