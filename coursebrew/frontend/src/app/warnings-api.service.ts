import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { API_URL } from './env';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';
import { Scope } from './scope';
import { AppGlobal } from './app.global';



@Injectable({
  providedIn: 'root'
})
export class WarningsApiService {

   constructor(private http: HttpClient, private appGlobal: AppGlobal) { }
   options = {headers: {'Content-Type': 'application/json'}};

   getWarnings(scope: Scope): Observable<any>{
      return this.http
         .post<any>(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/get_warnings", JSON.stringify(scope), this.options)
   }

   getLog(scope: Scope): Observable<any> {
      return this.http
         .post<any>(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/get_log", JSON.stringify(scope), this.options)
   }


}
