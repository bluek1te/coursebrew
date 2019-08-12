import {Component, OnInit} from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {Instructor} from '../instructors/instructor';
import {InstructorsApiService} from '../instructors/instructors-api.service';
import {LoginService} from '../login/login.service';
import {Scope} from '../scope';
import {ScopeService} from '../scope.service';
import {Warning} from '../warning';
import {WarningsApiService} from '../warnings-api.service';
import {Years} from '../years';

import {Course} from './course';
import {CoursesApiService} from './courses-api.service';
import {Section} from './section';

@Component({
  selector : 'app-courses',
  templateUrl : './courses.component.html',
  styleUrls : [ './courses.component.css' ]
})

export class CoursesComponent implements OnInit {
  courseListSubs: Subscription;
  instructorsListSubs: Subscription;
  sectionSub: Subscription;
  sectionList: Section[];
  warningsListSubs: Subscription;
  warningsList: Warning[];
  yearsSub: Subscription;
  yearsList: Years;
  
  scope: Scope = {username : " ", year: "2019"};
  scopeSubs: Subscription;
  yearString: String;
  constructor(private coursesApi: CoursesApiService,
              private instructorsApi: InstructorsApiService,
              private warningsApi: WarningsApiService,
              private scopeSource: ScopeService,
              private loginService: LoginService, private router: Router,
              private sanitizer: DomSanitizer) {}
  
  courseList: Course[];
  instructorsList: Instructor[];
  currentCountList: {};

  ngOnInit() {
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
    this.dataRefresh();
  };

  dataRefresh() {
    this.yearString =
        this.scope.year + ' - ' + (parseInt(this.scope.year) + 1).toString();

    this.courseListSubs =
        this.coursesApi.getCourses(this.scope)
            .subscribe(res => { this.courseList = res; }, console.error, () => this.sectionsInit());

    this.yearsSub =
        this.scopeSource.getYears(this.scope)
            .subscribe(res => { this.yearsList = res; }, console.error);

    this.warningsListSubs =
        this.warningsApi.getWarnings(this.scope)
            .subscribe(res => { this.warningsList = res; }, console.error);

    this.instructorsListSubs =
        this.instructorsApi.getInstructors(this.scope)
            .subscribe(res => { this.instructorsList = res; }, console.error);

  }

  sectionsInit() {
    this.sectionSub =
        this.coursesApi.getAllSections(this.scope)
            .subscribe(res => { this.sectionList = res; }, console.error, ()=> this.countInit());
  }

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
					element.current_wl_credits_fal += 1.0;
				}
				else{
					element.current_wl_credits_fal += 3.0;
				}
			}
			if((element_two.instructor_id == element.net_id) && (element_two.sem == "Spr")) {
				if(element_two.is_lab == "True") {
					element.current_wl_credits_spr += 1.0;
				}
				else{
					element.current_wl_credits_spr += 3.0;
				}
			}
		});

    });


  }

  getInstructorSections(id) {
    var assignments = [];
    this.sectionList.forEach((element) => {
      if (element.instructor_id == id)
        assignments.push(element.course_id);
    });
    return assignments;
  };

  searchWarnings(warning: Warning, sem) {
    if (warning.message.includes(sem))
      return true;
    else
      return false;
  }

  statusToColorConverter(status) {
    if (status == 2)
      return
    // return this.sanitizer.bypassSecurityTrustStyle("background-color:
    // #D3D3D3")
  }
}
