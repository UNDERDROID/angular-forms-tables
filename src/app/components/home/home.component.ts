import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ngOnInit(){
    this.userService.isSuperAdmin()
  }
constructor(public userService: UserService, private router: Router){}
logout():void{
  localStorage.removeItem('user')
  this.router.navigateByUrl('/login')
}
}
