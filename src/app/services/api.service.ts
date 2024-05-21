
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError, catchError, map, Observable } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Repository, ApiResponse } from '../models/repository.model'; 

// interface Repository { 
//   id: number;
//   name: string;
//   html_url: string;
//   stargazers_count: number;
//   // Add other repository properties as needed
// }

// interface ApiResponse {
//   repositories: Repository[];
//   nextPageUrl: string | null;
// }

const GIT_API_URL = 'https://api.github.com/users'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  getUser(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
  }



  // implement getRepos method by referring to the documentation. Add proper types for the return type and params
  getRepos(username: string, perPage: number = 10, page?: number): Observable<ApiResponse> {
    let params = new HttpParams().set('per_page', perPage.toString());
    if (page) {
      params = params.set('page', page.toString());
    }

    const url = `${GIT_API_URL}/${username}/repos`;
    const headers = new HttpHeaders().set('Accept', 'application/vnd.github.mercy-preview+json');

    return this.httpClient.get<Repository[]>(url, { headers, params, observe: 'response' })
      .pipe(
        map((response: HttpResponse<Repository[]>) => {
          const linkHeader = response.headers.get('link');
          let nextPageUrl: string | null = null;
          if (linkHeader) {
            const linkParts = linkHeader.split(',');
            for (const part of linkParts) {
              const relMatch = part.match(/rel="next"/);
              if (relMatch) {
                nextPageUrl = part.substring(part.indexOf('<') + 1, part.indexOf('>')).trim();
                break;
              }
            }
          }
          return { repositories: response.body ?? [], nextPageUrl };
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}












