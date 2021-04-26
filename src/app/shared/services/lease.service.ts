import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const LEASE_API = 'http://localhost:8080/api/lease/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LeaseService {

  constructor(private http: HttpClient) { }

  createLease(token, data): Observable<any> {
    return this.http.post(`${LEASE_API}create`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAll(token): Observable<any> {
    return this.http.get(LEASE_API, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAllSuccess(token): Observable<any> {
    return this.http.get(`${LEASE_API}success`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  updateLease(token, data, id): Observable<any> {
    return this.http.put(`${LEASE_API}update/${id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  deleteLease(token, id): Observable<any> {
    return this.http.delete(`${LEASE_API}delete/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findDataLeaseByRid(token, rid): Observable<any> {
    return this.http.get(`${LEASE_API}${rid}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  uploadPhotoLease1(token, data, id): Observable<any> {
    return this.http.put(`${LEASE_API}upload/img1/${id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  uploadPhotoLease2(token, data, id): Observable<any> {
    return this.http.put(`${LEASE_API}upload/img2/${id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  uploadPhotoLease3(token, data, id): Observable<any> {
    return this.http.put(`${LEASE_API}upload/img3/${id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }
}
