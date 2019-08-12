import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { API_URL } from '../env';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeveloperService {

  constructor(private http: HttpClient) { }
  options = {headers: {'Content-Type': 'application/json'}};

  getFromCsv(): Observable<any> {
	return this.http
	.get<any>("http://198.58.116.113:5000/pull_from_csv")
  }

}
