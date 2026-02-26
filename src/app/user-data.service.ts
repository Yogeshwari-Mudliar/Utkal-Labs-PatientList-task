import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http:HttpClient) { }

  getUserData(){
    return this.http.get('https://jsonplaceholder.typicode.com/users')
  }
}
