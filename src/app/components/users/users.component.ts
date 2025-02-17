import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
users: any []=[]
registeredUsers: any []=[]
selectedUser: any = null;

// columns = [
//   {name: 'First Name', prop: 'firstName'}
// ]

updateForm: FormGroup

constructor(private userService: UserService, private router: Router, private fb: FormBuilder){
  // Initialize the form
  this.updateForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    postalCode: ['', [Validators.required]]
  })
}

ngOnInit(): void{

  if (!this.userService.isSuperAdmin()) {
    this.router.navigate(['/home']);
  }

this.loadUsers();

this.userService.getRegisteredUsers().subscribe((data)=>{
  this.registeredUsers=data;
})
}
selectUser(user: any): void{
  this.selectedUser=user;
}

addUserToRegisteredUsers(): void{
  if(this.selectedUser){
    const isAlreadyRegistered = this.registeredUsers.some(
      (user) => user.id === this.selectedUser.id
    )

    if(!isAlreadyRegistered){
      this.userService.addRegisteredUser(this.selectedUser).subscribe((newUser)=>{
        this.registeredUsers.push(this.selectedUser);
        alert(`${this.selectedUser.firstName} has been added to registered user`)})
      
    }else{
      alert('User is already registered')
    }
  }else{
    alert('Please select a user')
  }
}

loadUsers() :void{
  this.userService.getUsers().subscribe(response => {
    this.users = response;
  });
}

deleteUser(userId: number): void {
  if (confirm("Are you sure you want to delete this user?")) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers(); // Reload the users after deletion
    });
  }
}

// Open the modal and pre-fill the form with user data
openUpdateModal(user: any): void {
  this.selectedUser = user;
  this.updateForm.patchValue({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    postalCode: user.postalCode
  });
  // Show the modal
  const modalElement = document.getElementById('updateUserModal');

// Check if the modal element exists
if (modalElement) {
  const modal = new window.bootstrap.Modal(modalElement);
  modal.show();
} else {
  console.error('Modal element not found');
}
}

// Update user
updateUser(): void {
  if (this.updateForm.invalid) {
    return;
  }

  const updatedUser = { ...this.selectedUser, ...this.updateForm.value };

  this.userService.updateUser(updatedUser.id, updatedUser).subscribe(
    () => {
      this.loadUsers(); // Reload the user list after updating
      const modalElement = document.getElementById('updateUserModal');
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.hide(); // Hide the modal after update
      } else {
        console.error('Modal element not found');
      }
    },
    (error) => {
      console.error('Error updating user:', error);
    }
  );
}


logout(){
  localStorage.removeItem('user');
  this.router.navigateByUrl('/login');
}
}
