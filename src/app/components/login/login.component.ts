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
localStorage.removeItem('userId')
  this.userServvice.getRegisteredUsers().subscribe({
    next: (res) =>{
 this.registeredUserList = res;
 console.log('Registered users:', this.registeredUserList);
    },
    error: (err) => {
      console.error('Error fetching registered users:', err);
      alert('Failed to fetch registered users.');
    }
})
}

login(){
if(this.loginForm.valid){
  console.log('Form is valid');
  const email = this.loginForm?.get('email')?.value
  const password = this.loginForm?.get('password')?.value
  try {
    if(!email || !password){
      alert("Something Went Wrong");
      return;
    }
    const loggedInUser = this.registeredUserList.find(user => user.email == email)

    if(loggedInUser){
      const hasCorrectPassword = loggedInUser.password === password;
      if(hasCorrectPassword){
        localStorage.setItem('user', JSON.stringify({ id: loggedInUser.id, role: loggedInUser.role }));
        console.log('correct pw')
        this.userServvice.setCurrentUser(loggedInUser);
        this.router.navigateByUrl('/home');
        console.log(loggedInUser);
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

  }else{
    console.log("Form is invalid");
  }
}

logout(){
  localStorage.removeItem('user')
  this.router.navigateByUrl('/login')
}
}

