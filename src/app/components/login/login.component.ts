import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm!: FormGroup; 
registeredUserList: Array<any> = [];

constructor(private fb: FormBuilder, private userServvice: UserService, private router: Router){
  this.loginForm = this.fb.group({

    email: ['', [Validators.required, Validators.email, Validators.maxLength(63)]],
    password: ['', [Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)]],
  })
}

ngOnInit(){
localStorage.removeItem('user')
  this.userServvice.getRegisteredUsers().subscribe(res =>{
 this.registeredUserList = res
 
})
}

login(){
if(this.loginForm.valid){
  let email = this.loginForm?.get('email')?.value
  try {
    if(!email){
      alert("Something Went Wrong");
      return;
    }
    let loggedInUser = this.registeredUserList.find(user => user.email == email)

    if(loggedInUser){
      let hasCorrectPassword = loggedInUser.password == this.loginForm.get('password')?.value
      if(hasCorrectPassword){
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        this.userServvice.setCurrentUser(loggedInUser);
        this.router.navigateByUrl('/home')
        console.log(loggedInUser)
      }else{
        alert("Something Went Wrong");
        return;
      }

    }else{
      alert("Incorrect Email or Password");
      return;
    }

  } catch (error) {
    alert("Login failed")
  }

  }
}

logout(){
  localStorage.removeItem('user')
  this.router.navigateByUrl('/login')
}
}

