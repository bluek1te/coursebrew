import { Injectable } from '@angular/core';
import { Scope } from './scope';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';
import { AppGlobal } from './app.global';


@Injectable({
  providedIn: 'root'
})
export class ScopeService {
  private scopeSource: BehaviorSubject<Scope> = new BehaviorSubject<Scope>({
       username: " ",
       year: " ",
       token: " "
  });
  
  currentScope: Observable<Scope> = this.scopeSource.asObservable();
  
  constructor(private http: HttpClient, private appGlobal: AppGlobal) { }

  changeScope(scope: Scope) {
    console.log("changing scope");
    this.scopeSource.next(scope);
    console.log(scope.username)
    console.log(scope.token)
    console.log(scope.year)
  };

  getYears(scope: Scope):Observable<any> {
      return this.http
      .post<any>(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/get_years", JSON.stringify(scope));
  };

  addYearCopy(scope: Scope):Observable<any> {
      return this.http
      .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/add_year_copy", JSON.stringify(scope));
  };

  deleteYear(scope: Scope):Observable<any> {
      return this.http
      .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/delete_year", JSON.stringify(scope));
  };


}
