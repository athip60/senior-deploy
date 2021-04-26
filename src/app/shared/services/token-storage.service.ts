import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  // บันทึก token ลง sessionStorage
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  // รับ token ของคนที่ login อยู่จาก sessionStorage
  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  // บันทึกข้อมูล user และ token ลง sessionStorage
  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // รับ user ของคนที่ login อยู่จาก sessionStorage
  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }
}
