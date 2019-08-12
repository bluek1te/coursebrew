import { Component, OnInit } from '@angular/core';
import { Course } from '../courses/course';
import { Subscription } from 'rxjs/Subscription';
import { CoursesApiService } from '../courses/courses-api.service';
import { InstructorsApiService } from '../instructors/instructors-api.service';
import { Instructor } from '../instructors/instructor';
import { Section } from '../courses/section';
import { Scope } from '../scope';
import {
 Years
} from '../years';
import {
 ScopeService
} from '../scope.service';
import { LoginService } from '../login/login.service';
import { ServerMessage } from '../ServerMessage';
import { Router } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courseListSubs: Subscription; 
  filteredCourseList: Course[];
  instructorListSubs: Subscription;
  scopeSubs: Subscription;
  sectionSub: Subscription; 
  sectionList: Section[];
    scope: Scope = {
	username: " ",
	year: "2019"
  };
    yearsSub: Subscription;
  yearsList: Years = { years: " " };
  yearString: String;
  messageSub: Subscription;
  message: String;
  searchedCourse: string;
  includes: number;
  public show = true;
 
  constructor(private router: Router, private coursesApi: CoursesApiService, private instructorsApi: InstructorsApiService, private scopeSource: ScopeService, private loginService: LoginService) { }

  courseList: Course[];
  instructorsList: Instructor[];

  ngOnInit() {
    console.log("hi")
    this.yearString = " ";
    this.scopeSource.currentScope.subscribe(scope => this.scope = scope);
    this.scopeSubs = this.loginService.check_login_cache()
					.subscribe(res => {
						this.scope = res;
					},
					console.error, 
					()=> this.dataInit()
					);

      }

      getInstructorSections(id) {
        var assignments = [];
	this.sectionList.forEach((element) => {
		if(element.instructor_id == id)
			assignments.push(element.course_id);
	});
	return assignments;
    };

    getCourseSections(id, sem) {
        var assignments = [];
	this.sectionList.forEach((element) => {
		if(element.course_name == id && element.sem == sem)
			assignments.push(element);
	});
	return assignments;
    };
 
  updateCourse(event: any){
    this.searchedCourse = event.target.value;
    console.log(this.searchedCourse)
    this.searchCourses()
  }

  searchCourses() {
    this.filteredCourseList = []
    this.courseList.forEach((element) => {
		if(element.name.toUpperCase().includes(this.searchedCourse.toUpperCase())){
		   this.filteredCourseList.push(element);
                }
              
	});

  }
  
  addYear() {
	var buffer = parseInt(this.scope.year) + 1;
        this.scope.year = buffer.toString();
        this.scopeSource.changeScope(this.scope);
        console.log(this.scope.year);
        this.yearString = this.scope.year + ' - ' + (parseInt(this.scope.year)+1).toString();
	this.dataRefresh();
  }

  subYear() {
        var buffer = parseInt(this.scope.year) - 1;
        this.scope.year = buffer.toString();
        this.scopeSource.changeScope(this.scope);
        console.log(this.scope.year);
        this.yearString = this.scope.year + ' - ' + (parseInt(this.scope.year)-1).toString();
	this.dataRefresh();
  }

  deleteYear() {
	this.messageSub = this.scopeSource
	.deleteYear(this.scope)
	.subscribe(res=>{
		this.message = res;
	}, 
	console.error
	)

  }

  checkYear() {
	if(this.yearsList.years.includes(this.scope.year))
		return false;
	else
		return true;
  }

  checkYearAndAdd() {
	if(this.checkYear()==false){
		this.addYear()
		console.log("adding Year")
	}
  }

  addYearCopy() {
        console.log("sending scope")
        console.log(this.scope.year)
	this.messageSub = this.scopeSource
	.addYearCopy(this.scope)
	.subscribe(res=>{
		this.message = res;
	}, 
	console.error, ()=>this.dataRefresh()
	);
  }

    redirectLogin(){
	 if(this.scope.token == " " || this.scope.token == undefined){
		this.router.navigate(['/login'])
 	 }
	 else{
		this.scopeSource.changeScope(this.scope);
                this.scope.year = this.scope.default_year;
		console.log(this.scope.token);
	 }

	 
  }

  dataInit(){
        if(this.scope.token == " " || this.scope.token == undefined)
	    this.router.navigate(['/login'])
	this.scope.year = this.scope.default_year;
        this.dataRefresh();
  }

  dataRefresh(){
    this.scopeSource.changeScope(this.scope);
    this.yearString = this.scope.year + ' - ' + (parseInt(this.scope.year)+1).toString();
    this.courseListSubs = this.coursesApi
        .getCourses(this.scope)
        .subscribe(res => {
            this.courseList = res;
        },
        console.error
     );

     this.instructorListSubs = this.instructorsApi
        .getInstructors(this.scope)
        .subscribe(res => {
            this.instructorsList = res;
        },
        console.error
     );
     

      this.sectionSub = this.coursesApi
        .getAllSections(this.scope)
        .subscribe(res => {
            this.sectionList = res;
        },
        console.error,
        () => this.filteredCourseList = this.courseList
       );

	this.yearsSub = this.scopeSource
	.getYears(this.scope)
	.subscribe(res=>{
		this.yearsList = res;
	}, 
	console.error
	)
  }

}