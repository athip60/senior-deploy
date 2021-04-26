import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const INCOME_API = 'http://localhost:8080/api/income/';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private http: HttpClient) { }

  findAllIncome(token): Observable<any> {
    return this.http.get(`${INCOME_API}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  sumIncome(token): Observable<any> {
    return this.http.get(`${INCOME_API}sum`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  createIncome(token, data): Observable<any> {
    return this.http.post(`${INCOME_API}create`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  updateIncome(token, data): Observable<any> {
    return this.http.put(`${INCOME_API}update/${data.id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  deleteIncome(token, id): Observable<any> {
    return this.http.delete(`${INCOME_API}delete/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }
}
