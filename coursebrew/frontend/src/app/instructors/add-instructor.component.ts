import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { InstructorsApiService } from './instructors-api.service';
import { Instructor } from './instructor';
import { Router } from "@angular/router";
import { ServerMessage } from '../ServerMessage';
import { Scope } from "../scope";
import { ScopeService } from "../scope.service";
import { Course } from '../courses/course';
import { CoursesApiService } from '../courses/courses-api.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'add-instructor',
  templateUrl: './add-instructor.component.html',
  styleUrls: ['./add-instructor.component.css']
})

export class AddInstructorComponent implements OnInit {
  courseList: Course[];
  scopeSubs: Subscription;
  courseListSubs: Subscription;
  available_courses_display: String[];

  newInstructor: Instructor = { 
    name: "TestInputName1",
    net_id: "TestInputNetID1",
    preps: "2",
    wl_credits: "5",
    wl_courses: "3",
    available_courses: [],
    preferred_courses: ["TestInputCourse5"],
    year: "2018",
  };

  scope: Scope;
  
  course_added: "";
  serverMessage: ServerMessage = {
     message: " ",
  };
  serverMessageSub: Subscription;

  constructor(private instructorsApi: InstructorsApiService, 
              private coursesApi: CoursesApiService, 
              private router: Router, 
              private scopeSource: ScopeService,
              private loginService: LoginService) { };

  onChange(event: any) {
   console.log(event.target.value);
   this.course_added = event.target.value;
  }

  updateName(event: any){
    this.newInstructor.name = event.target.value
  }

  updateNetId(event: any){
    this.newInstructor.net_id = event.target.value
  }

  onChangeTrack(event: any){
    switch(event.target.value){
    	case 'tenured':
		this.newInstructor.wl_courses = '2';
		break;
	case 'non-tenured':
		this.newInstructor.wl_courses = '4';
		break;
	case 'adjunct':
		this.newInstructor.wl_courses = '3';
		break;
    }
  }


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
  this.newInstructor.token = this.scope.token;
  this.newInstructor.owner = this.scope.username;

  this.courseListSubs = this.coursesApi
      .getCourses(this.scope)
      .subscribe(res => {
          this.courseList = res;
      },
      console.error
  );
  };
  updateAvailableCourses(){
     if(!this.newInstructor.available_courses.includes(this.course_added)){
        this.available_courses_display.push(this.course_added);
        this.courseList.forEach((element) => {
		if(element.name == this.course_added){
			this.newInstructor.available_courses.push(element.course_id);
		}
	});

     }
     console.log(this.newInstructor.available_courses);
  };
  
  submitInstructor() {
     this.newInstructor.wl_credits =  (parseInt(this.newInstructor.wl_courses) * 3).toString()
     this.newInstructor.year = this.scope.year;
     this.serverMessageSub = this.instructorsApi.addInstructor(this.newInstructor)
     .subscribe(res => { this.serverMessage = res;
	},
       error => alert(error.message)
     );
  };

}
