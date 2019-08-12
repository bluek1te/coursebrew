import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Instructor } from './instructor';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { Course } from '../courses/course';

import { InstructorsApiService } from './instructors-api.service';
import { CoursesApiService } from '../courses/courses-api.service';
import { ScopeService } from '../scope.service';
import { LoginService } from '../login/login.service';

import { Scope } from '../scope';

@Component({
    moduleId: 'module.id',
    selector: 'instructor-show',
    templateUrl: 'instructor-show.component.html',
    styleUrls: ['./instructor-show.component.css']

})

export class InstructorShowComponent implements OnInit {
    dataSub: Subscription;
    scopeSubs: Subscription;
    data: Instructor = {
        name: " ",
    };
    loadedInstructor: Instructor = {
        name: " ",
        net_id: " ",
        available_courses: [],
        preps: " ",
        year: " "
    };
    courseListSubs: Subscription;
    courseList: Course[];
    yearString: String;
    scope: Scope;
    track: String;
    instructorCourseList: String[];
    available_courses_display: String[];


    constructor(
        private instructorsApi: InstructorsApiService,
        private coursesApi: CoursesApiService,
        private router: Router,
        private route: ActivatedRoute,
        private scopeSource: ScopeService,
        private loginService: LoginService
    ) { }

    ngOnInit() {
        this.available_courses_display = [];
        this.scopeSource.currentScope.subscribe(scope => this.scope = scope);
        if (this.scope.username == " ") {
            this.scopeSubs = this.loginService.check_login_cache()
                .subscribe(res => {
                    this.scope = res;
                },
                    console.error,
                    () => this.dataInit()
                );

        }
	else {
		this.dataRefresh();
	}
   }

        dataInit() {
            if (this.scope.token == " " || this.scope.token == undefined)
                this.router.navigate(['/login'])
            this.scope.year = this.scope.default_year;
            this.dataRefresh();
        };

        dataRefresh() {
            this.loadedInstructor.year = this.scope.year;
            this.yearString = this.scope.year;

            this.route.params.subscribe(
                params => {
                    this.loadedInstructor.net_id = params['id'];
                },
            );
            this.loadedInstructor.token = this.scope.token;
            this.dataSub = this.instructorsApi
                .getInstructor(this.loadedInstructor)
                .subscribe(res => {
                    this.data = res;
                },
                    console.error,
                    () => this.courseListSubs = this.coursesApi
                        .getCourses(this.scope)
                        .subscribe(res => {
                            this.courseList = res;
                        },
                            console.error,
                            () => this.getTrack(this.data.wl_courses)
                        )
                );
        }

        getTrack(creds) {
	    this.loadedInstructor = this.data;
            switch (creds) {
                case '2.0':
                    this.track = 'tenured';
                    break;
                case '2':
                    this.track = 'tenured';
                    break;
                case '4':
                    this.track = 'non-tenured';
                    break;
                case '4.0':
                    this.track = 'non-tenured';
                    break;
                case '3.0':
                    this.track = 'adjunct';
                    break;
                case '3':
                    this.track = 'adjunct';
                    break;

            };
            this.initAvailableCourses()

        }


        course_added: "placeholder";

        onChange(newValue) {
            this.course_added = newValue;
            this.yearString = this.data.year + ' - ' + (parseInt(this.data.year) + 1).toString();
        }

        updateName(event: any){
            this.loadedInstructor.name = event.target.value;
        }


        updateNetId(event: any){
            this.loadedInstructor.net_id = event.target.value
        }

        updateTrack(event: any){
            switch (event.target.value) {
                case 'Tenured':
                    this.loadedInstructor.wl_credits = '2';
                case 'Non-tenured':
                    this.loadedInstructor.wl_credits = '4';
                case 'Adjunct':
                    this.loadedInstructor.wl_credits = '3';
            }
        }

        idToString(name: String){
            var buffer = "0";
            this.courseList.forEach((element) => {
                if (name == element.name)
                    buffer = element.course_id
            })
            return buffer;
        }

        removeAvailableCourse(course: String) {
            this.available_courses_display.forEach((element, index, object) => {
                if (course == element) {
                    object.splice(index, 1);
                }
            })
            this.loadedInstructor.available_courses.forEach((element, index, object) => {
                if (this.idToString(course) == element) {
                    object.splice(index, 1);
                }
            })
            console.log(this.loadedInstructor.available_courses);

        }


        initAvailableCourses() {
            var buffer = this.data.available_courses.toString();
            console.log(buffer)
            this.loadedInstructor.available_courses = buffer.split(" ");
            this.courseList.forEach((element) => {
                if (this.loadedInstructor.available_courses.includes(element.course_id)) {
                    this.available_courses_display.push(element.name);
                }
            })
        };

        updateAvailableCourses(){
            if (!this.loadedInstructor.available_courses.includes(this.course_added)) {
                this.available_courses_display.push(this.course_added);
                this.courseList.forEach((element) => {
                    if (element.name == this.course_added) {
                        this.loadedInstructor.available_courses.push(element.course_id);
                    }
                });

            }
            console.log(this.loadedInstructor.available_courses);
	    console.log(this.loadedInstructor.name);
        };

        deleteInstructor() {
		this.instructorsApi.deleteInstructor(this.loadedInstructor)
			.subscribe(
				()=> this.router.navigate(['/home']),
				error => alert(error.message)
			);

        };

        submitInstructor() {
            switch (this.track) {
                case 'tenured':
                    this.loadedInstructor.wl_courses = '2';
                    this.loadedInstructor.wl_credits = '6';
                    break;
                case 'non-tenured':
                    this.loadedInstructor.wl_courses = '4';
                    this.loadedInstructor.wl_credits = '12';
                    break;
                case 'adjunct':
                    this.loadedInstructor.wl_courses = '3';
                    this.loadedInstructor.wl_credits = '9';
                    break;

            };

            this.instructorsApi.editInstructor(this.loadedInstructor)
                .subscribe(
                );
        };

    }
