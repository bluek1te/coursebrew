import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { API_URL } from '../env';
import { Instructor } from './instructor';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';
import { Scope } from '../scope';
import { Course } from '../courses/course';
import { AppGlobal } from '../app.global';


@Injectable({
  providedIn: 'root'
})


export class InstructorsApiService {

   constructor(private http: HttpClient, private appGlobal: AppGlobal) { }
   options = {headers: {'Content-Type': 'application/json'}};

   private static _handleError(err: HttpErrorResponse | any) {
      return throwError(err.message || 'Error: Unable to complete request.');
   }

   getInstructors(scope: Scope): Observable<any>{
      return this.http
         .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/get_instructors", JSON.stringify(scope), this.options)
	 .catch(InstructorsApiService._handleError);
   }
   
   getFilteredInstructors(course: Course): Observable<any>{
      return this.http
         .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/filter_instructors", JSON.stringify(course), this.options)
	 .catch(InstructorsApiService._handleError);
   }

   addInstructor(instructor: Instructor): Observable<any>{
      return this.http
         .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/add_instructor", JSON.stringify(instructor)) 
   }

   editInstructor(instructor: Instructor): Observable<any>{
      return this.http
         .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/edit_instructor", JSON.stringify(instructor)) 
   }

   getInstructor(instructor: Instructor): Observable<Instructor>{
      return this.http
         .post<Instructor>(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/get_instructor", JSON.stringify(instructor), this.options)
	 .catch(InstructorsApiService._handleError);
   }

   deleteInstructor(instructor: Instructor): Observable<Instructor>{
      return this.http
         .post<Instructor>(this.appGlobal.baseAppUrl + this.appGlobal.basePort + "/delete_instructor", JSON.stringify(instructor), this.options)
	 .catch(InstructorsApiService._handleError);
   }


}