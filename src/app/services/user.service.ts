import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from '../components/register/users';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000'
  private user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private http: HttpClient) { }

    // Check if email exists
    checkEmail(email: string): Observable<user[]> {
      return this.http.get<user[]>(`${this.apiUrl}/users?email=${email}`);
    }
  
    // Check if phone exists
    checkPhone(phone: string): Observable<user[]> {
      return this.http.get<user[]>(`${this.apiUrl}/users?phone=${phone}`);
    }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/users', user);
  }

  addRegisteredUser(user: any): Observable<any>{
    return this.http.post<any>(this.apiUrl+'/registered_users', user)
  }
  getUsers():Observable<any>{
    return this.http.get<any>('http://localhost:3000/users')
  }

  getRegisteredUsers():Observable<any>{
    return this.http.get<any>('http://localhost:3000/registered_users')
  }

  isSuperAdmin(): boolean{
    return this.user.role==='superadmin';
  }
  
// Fetch users only if the logged-in user is a superadmin
getSuperAdminUsers(): Observable<any> {
  if (this.isSuperAdmin()) {
    return this.http.get<any>(`${this.apiUrl}/users-table`);
  } else {
    return new Observable(); // Or handle error here if not superadmin
  }
}

setCurrentUser(user: any) {
  this.user = user;
  localStorage.setItem('user', JSON.stringify(user));
}

deleteUser(userId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/users/${userId}`);
}

updateUser(userId: string, updateUser: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/users/${userId}`, updateUser);
}

updateRegisteredUser(userId: number, updatedUser: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/registered_users/${userId}`, updatedUser);
}

deleteRegisteredUser(userId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/registered_users/${userId}`);
}

}

