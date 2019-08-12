import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {Observable} from 'rxjs/Observable';

import {AppGlobal} from '../app.global';
import {API_URL} from '../env';
import {Scope} from '../scope';

import {Course} from './course';
import {Section} from './section';

const headerJson = {
  'Content-Type' : 'application/json',
  'Accept' : 'application/json'
}

@Injectable({providedIn : 'root'}) export class CoursesApiService {

  // private headers = new HttpHeaders(headerJson);

  constructor(private http: HttpClient, private appGlobal: AppGlobal) {}
  options = {headers : {'Content-Type' : 'application/json'}};

  private static _handleError(err: HttpErrorResponse|any) {
    return throwError(err.message || 'Error: Unable to complete request.');
  };

  getCourses(scope: Scope): Observable<any> {
    return this.http
        .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                  "/get_courses",
              JSON.stringify(scope), this.options)
        .catch(CoursesApiService._handleError);
  };

  addCourse(course: Course): Observable<any> {
    return this.http.post(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                              "/add_course",
                          JSON.stringify(course));
  };

  deleteCourse(course: Course): Observable<any> {
    return this.http.post(this.appGlobal.baseAppUrl + this.appGlobal.basePort + 
				"/delete_course",
			JSON.stringify(course));
  };

  editCourse(course: Course): Observable<any> {
    return this.http.post(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                              "/edit_course",
                          JSON.stringify(course));
  };

  getCourse(course: Course): Observable<Course> {
    return this.http
        .post<Course>(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                          "/get_course",
                      JSON.stringify(course), this.options)
        .catch(CoursesApiService._handleError);
  };

  assignCourse(section: Section): Observable<any> {
    return this.http
        .post<Course>(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                          "/assign_course",
                      JSON.stringify(section), this.options)
        .catch(CoursesApiService._handleError);
  };

  getSectionsSpr(course: Course): Observable<any> {
    return this.http
        .post<Course>(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                          "/get_sections_spr",
                      JSON.stringify(course), this.options)
        .catch(CoursesApiService._handleError);
  };

  getSectionsSum1(course: Course): Observable<any> {
    return this.http
        .post<Course>(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                          "/get_sections_sum1",
                      JSON.stringify(course), this.options)
        .catch(CoursesApiService._handleError);
  };

  getSectionsSum2(course: Course): Observable<any> {
    return this.http
        .post<Course>(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                          "/get_sections_sum2",
                      JSON.stringify(course), this.options)
        .catch(CoursesApiService._handleError);
  };

  getSectionsFal(course: Course): Observable<any> {
    return this.http
        .post<Course>(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                          "/get_sections_fal",
                      JSON.stringify(course), this.options)
        .catch(CoursesApiService._handleError);
  };

  getAllSections(scope: Scope): Observable<any> {
    return this.http
        .post(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
                  "/get_all_sections",
              JSON.stringify(scope), this.options)
        .catch(CoursesApiService._handleError);
  };

  getPDF(scope: Scope): Observable<any> {
    return this.http
	.post(this.appGlobal.baseAppUrl + this.appGlobal.basePort +
		"/generate_pdf",
	      JSON.stringify(scope), this.options)
	.catch(CoursesApiService._handleError);
  };
}