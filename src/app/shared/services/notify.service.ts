import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const NOTIFY_API = 'http://localhost:8080/api/notify/';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private http: HttpClient) { }

  findNoti(token, id): Observable<any> {
    return this.http.get(`${NOTIFY_API}${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  createNoti(token, data): Observable<any> {
    return this.http.post(`${NOTIFY_API}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  updateNoti(token, id): Observable<any> {
    return this.http.put(`${NOTIFY_API}${id}`,{status: 'readed'}, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

}
