import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BLOG_API = 'http://localhost:8080/api/blog/';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  findAll(token): Observable<any> {
    return this.http.get(`${BLOG_API}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  findAllForGuest(token, id): Observable<any> {
    return this.http.get(`${BLOG_API}${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  // post function

  createPost(token, data): Observable<any> {
    return this.http.post(`${BLOG_API}create`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }


  updatePost(token, data): Observable<any> {
    return this.http.put(`${BLOG_API}update-post/${data.id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  deletePost(token, id): Observable<any> {
    return this.http.delete(`${BLOG_API}delete-post/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  // comment function

  viewComment(token, id): Observable<any> {
    return this.http.get(`${BLOG_API}comment/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  createComment(token, data): Observable<any> {
    return this.http.post(`${BLOG_API}create-comment`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  updateComment(token, data): Observable<any> {
    return this.http.put(`${BLOG_API}update-comment/${data.id}`, data, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  deleteComment(token, id): Observable<any> {
    return this.http.delete(`${BLOG_API}delete-comment/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

  deleteCommentAll(token, id): Observable<any> {
    return this.http.delete(`${BLOG_API}delete-comment-all/${id}`, { headers: { 'x-access-token': JSON.parse(JSON.stringify(token)) } });
  }

}

