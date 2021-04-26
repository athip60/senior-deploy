import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BILL_API = 'http://localhost:8080/api/bill/';
const BILL_GUEST_API = 'http://localhost:8080/api/bill-guest/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient) { }

  createBill(token, data): Observable<any> {
    return this.http.post(`${BILL_API}create`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAll(token): Observable<any> {
    return this.http.get(`${BILL_API}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAllByDataRoomId(token, data_room_id): Observable<any> {
    return this.http.get(`${BILL_API}findallbyDRID/${data_room_id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  updateBill(id, data, token): Observable<any> {
    return this.http.put(`${BILL_API}update/${id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  updateBillGuest(id, data, token): Observable<any> {
    return this.http.put(`${BILL_API}update-guest/${id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  deleteBill(id, token): Observable<any> {
    return this.http.delete(`${BILL_API}delete/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findGuest(id, token): Observable<any> {
    return this.http.get(`${BILL_GUEST_API}${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }
}
