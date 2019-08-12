import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { API_URL } from '../env';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';
import { AppGlobal } from '../app.global';
import { Scope } from '../scope';


@Injectable({
  providedIn: 'root'
})


export class LoginService { 

   constructor(private http: HttpClient, private appGlobal: AppGlobal) { }
   options = {headers: {'Content-Type': 'application/json'}};

   private static _handleError(err: HttpErrorResponse | any) {
      return throwError(err.message || 'Error: Unable to complete request.');
   }

   login(scope: Scope): Observable<any>{
      console.log(scope)
      return this.http
         .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/login", JSON.stringify(scope), this.options)
	 .catch(LoginService._handleError);
   }

   check_login_cache(): Observable<any>{
	return this.http
		.get(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/check_login_cache")
		.catch(LoginService._handleError);
   }

   logout(): Observable<any>{
	return this.http
		.get(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/logout")
		.catch(LoginService._handleError);
   }


}