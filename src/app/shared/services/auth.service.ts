import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: data.username,
      password: data.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      name: user.name,
      surname: user.surname,
      tel: user.tel,
    }, httpOptions);
  }

  updateUser(data, id, token): Observable<any> {
    return this.http.put(`${AUTH_API}update/${id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAll(token): Observable<any> {
    return this.http.get(AUTH_API, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAllDesc(token): Observable<any> {
    return this.http.get(`${AUTH_API}getAll/order`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAllWithOutUserLogin(token): Observable<any> {
    return this.http.get(`${AUTH_API}getAll/withoutlogin`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findById(id, token): Observable<any> {
    return this.http.get(`${AUTH_API}${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findGuestAll(token): Observable<any> {
    return this.http.get(`${AUTH_API}guests/all`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAllGuest(token, number_room): Observable<any> {
    return this.http.get(`${AUTH_API}guest/${number_room}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  deleteUser(id, token): Observable<any> {
    return this.http.delete(`${AUTH_API}delete/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }
}
