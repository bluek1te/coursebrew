import 'rxjs/add/operator/map';

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {Instructor} from '../instructors/instructor';
import {InstructorsApiService} from '../instructors/instructors-api.service';
import {LoginService} from '../login/login.service';
import {Scope} from '../scope';
import {ScopeService} from '../scope.service';
import {Warning} from '../warning';
import {WarningsApiService} from '../warnings-api.service';

import {Course} from './course';
import {CoursesApiService} from './courses-api.service';
import {Section} from './section';

@Component({
  selector : 'app-courses-show',
  templateUrl : './courses-show.component.html',
  styleUrls : [ './courses-show.component.css' ]
})
export class CoursesShowComponent implements OnInit {
  loadedCourseSub: Subscription;
  instructorsListSubs: Subscription;
  instructorsList: Instructor[] = [];
  instructorsFilteredListSubs: Subscription;
  instructorsFilteredList: Instructor[];
  courseListSubs: Subscription;
  courseList: Course[];
  sectionSubSpr: Subscription;
  sectionSubSum1: Subscription;
  sectionSubSum2: Subscription;
  sectionSubFal: Subscription;
  sectionSub: Subscription;
  sectionListSpr: Section[];
  sectionListSum1: Section[];
  sectionListSum2: Section[];
  sectionListFal: Section[];
  warningsListSubs: Subscription;
  warningsList: Warning[];
  sectionList: Section[];
  sectionID: String;
  scopeSubs: Subscription;
  scope: Scope = {username : " ", year: "2019"};
  yearString1: String;
  yearString2: String;

  loadedCourse: Course = {name : " ", course_id: " ", year: "2019"}

  constructor(
      private coursesApi: CoursesApiService, private router: Router,
      private route: ActivatedRoute, private warningsApi: WarningsApiService,
      private instructorsApi: InstructorsApiService,
      private scopeSource: ScopeService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.scopeSource.currentScope.subscribe(scope => this.scope = scope);
    if (this.scope.username == " ") {
      this.scopeSubs = this.loginService.check_login_cache().subscribe(
          res => { this.scope = res; }, console.error, () => this.dataInit());

    } else {
      this.dataRefresh();
    }
  }

  dataInit() {
    if (this.scope.token == " " || this.scope.token == undefined) {
      this.router.navigate([ '/login' ]) 
    }
      this.scope.year = this.scope.default_year;
      this.yearString1 = this.scope.year;
      this.yearString2 = (parseInt(this.scope.year) + 1).toString();
    this.dataRefresh();
  };
  dataRefresh() {
    this.loadedCourse.token = this.scope.token;
    this.loadedCourse.year = this.scope.year;
    this.route.params
        .subscribe(params => { this.loadedCourse.course_id = params['id']; })

        this.loadedCourseSub =
        this.coursesApi.getCourse(this.loadedCourse)
            .subscribe(
                res => { this.loadedCourse = res; }, console.error,
                () => this.instructorsFilteredListSubs =
                    this.instructorsApi
                        .getFilteredInstructors(this.loadedCourse)
                        .subscribe(
                            res => { this.instructorsFilteredList = res; },
                            console.error,
                            () => console.log(this.loadedCourse.name))

            );

    this.sectionSubSpr =
        this.coursesApi.getSectionsSpr(this.loadedCourse)
            .subscribe(res => { this.sectionListSpr = res; }, console.error);

    this.sectionSubSum1 =
        this.coursesApi.getSectionsSum1(this.loadedCourse)
            .subscribe(res => { this.sectionListSum1 = res; }, console.error);

    this.sectionSubSum2 =
        this.coursesApi.getSectionsSum2(this.loadedCourse)
            .subscribe(res => { this.sectionListSum2 = res; }, console.error);

    this.sectionSubFal =
        this.coursesApi.getSectionsFal(this.loadedCourse)
            .subscribe(res => { this.sectionListFal = res; }, console.error);

    this.instructorsListSubs =
        this.instructorsApi.getInstructors(this.scope)
            .subscribe(res => { this.instructorsList = res; }, console.error);

    this.warningsListSubs =
        this.warningsApi.getWarnings(this.scope)
            .subscribe(res => { this.warningsList = res; }, console.error);

    this.courseListSubs =
        this.coursesApi.getCourses(this.scope)
            .subscribe(res => { this.courseList = res; }, console.error, ()=> this.sectionsInit());

    // kiana add this to courses.component

  };

  sectionsInit() {
	this.sectionSub =
        this.coursesApi.getAllSections(this.scope)
            .subscribe(res => { this.sectionList = res; }, console.error, () => this.countInit());

  };

  countInit() {
    this.courseList.forEach((element) => {
      element.current_assign = 0;
      element.max_assign = 0;
	    this.sectionList.forEach((element_two) => {
			if(element_two.course_id == element.course_id) {
    		 		 element.max_assign++
			}
			if((element_two.course_id == element.course_id) && (element_two.instructor_id != "Unassigned")){
				element.current_assign++
			}
   		 });
  
    });

        this.instructorsList.forEach((element) => {
      element.current_wl_credits_fal = 0.0;
	element.current_wl_credits_spr = 0.0;
            this.sectionList.forEach((element_two) => {
			if((element_two.instructor_id == element.net_id) && (element_two.sem == "Fal")) {
				if(element_two.is_lab == "True") {
					element.current_wl_credits_fal += 1.5;
				}
				else{
					element.current_wl_credits_fal += 3.0;
				}
			}
			if((element_two.instructor_id == element.net_id) && (element_two.sem == "Spr")) {
				if(element_two.is_lab == "True") {
					element.current_wl_credits_spr += 1.5;
				}
				else{
					element.current_wl_credits_spr += 3.0;
				}
			}
		});

    });

  }

  setIDFal(event: any) {
    this.sectionListFal.forEach((element) => {
      if (element.id == event.target.id) {
        element.instructor_id = event.target.value;
        element.instructor_name = this.getInstructorName(event.target.value);
        console.log(element.instructor_name);
      }
      
      if (element.id == "unassign" || element.id == "choose instructor"){
        element.instructor_id = "Unassigned";
        element.instructor_name = "Unassigned";
      }
    });
  };

  setIDSum1(event: any) {
    this.sectionListSum1.forEach((element) => {
      if (element.id == event.target.id) {
        element.instructor_id = event.target.value;
        element.instructor_name = this.getInstructorName(event.target.value);

        console.log(this.getInstructorName(event.target.value));
      }

      if (element.id == "unassign" || element.id == "choose instructor"){
        element.instructor_id = "Unassigned";
        element.instructor_name = "Unassigned";
      }
    });
  };

  setIDSum2(event: any, name) {
    this.sectionListSum2.forEach((element) => {
      if (element.id == event.target.id) {
        element.instructor_id = event.target.value;
        element.instructor_name = this.getInstructorName(event.target.value);

        console.log("Target set");
      }

      if (element.id == "unassign" || element.id == "choose instructor"){
        element.instructor_id = "Unassigned";
        element.instructor_name = "Unassigned";
      }
    });
  };

  setIDSpr(event: any) {
    this.sectionListSpr.forEach((element) => {
      if (element.id == event.target.id) {
        element.instructor_id = event.target.value;
        element.instructor_name = this.getInstructorName(event.target.value);

        console.log("Target set");
      }

      if (element.id == "unassign" || element.id == "choose instructor"){
        element.instructor_id = "Unassigned";
        element.instructor_name = "Unassigned";
      }
    });
  };

  submitSections() {
    this.sectionListFal.forEach((element) => {
      
        this.coursesApi.assignCourse(element).subscribe(
            () => this.ngOnInit(), error => alert(error.message));
      
    });
    this.sectionListSum1.forEach((element) => {
      if (element.instructor_id != "Unassigned") {
        this.coursesApi.assignCourse(element).subscribe(
            () => this.ngOnInit(), error => alert(error.message));
      }
    });
    this.sectionListSum2.forEach((element) => {
      if (element.instructor_id != "Unassigned") {
        this.coursesApi.assignCourse(element).subscribe(
            () => this.ngOnInit(), error => alert(error.message));
      }
    });

    this.sectionListSpr.forEach((element) => {
      if (element.instructor_id != "Unassigned") {
        this.coursesApi.assignCourse(element).subscribe(
            () => this.ngOnInit(), error => alert(error.message));
      }
    });
  };

  getInstructorName(id) {
    var nameToReturn = "choose instructor";
    this.instructorsList.forEach((element) => {
      if (element.net_id == id)
        nameToReturn = element.name;
    });
    return nameToReturn;
  };

  // kiana add this to courses.component
  getInstructorSections(id) {
    var assignments = [];
    this.sectionList.forEach((element) => {
      if (element.instructor_id == id)
        assignments.push(element.course_id);
    });
    return assignments;
  };

  getStatus(instructor) {
    var i = 0;
    this.sectionList.forEach((element) => {
      if (element.instructor_id == instructor.net_id)
        i++;
    });
    if (i * 3 > instructor.wl_credits)
      document.getElementById(instructor.name).style.backgroundColor =
          "#ff0000";
    else if (i * 3 != instructor.wl_credits) {
      console.log("hi");
      document.getElementById(instructor.name).style.backgroundColor =
          "#ffff00";
    } else
      document.getElementById(instructor.name).style.backgroundColor =
          "#00ff00";
  };

  searchWarnings(warning: Warning, sem) {
    if (warning.message.includes(sem))
      return true;
    else
      return false;
  }
}