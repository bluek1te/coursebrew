import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {LoginService} from '../login/login.service';
import {Scope} from '../scope';
import {ScopeService} from "../scope.service";

import {Course} from './course';
import {CoursesApiService} from './courses-api.service';

@Component({
  selector : 'app-edit-course',
  templateUrl : './edit-course.component.html',
  styleUrls : [ './edit-course.component.css' ]
})

export class EditCourseComponent implements OnInit {
  scopeSubs: Subscription;
  scope: Scope;
  dataSub: Subscription;
  data: Course = {name : " ", course_id: " "};
  loadedCourse: Course = {
    name : " ",
    course_id: " ",
    freq_sum1: "4",
    freq_spr: "1",
    freq_fal: "2",
    year: "2019",
  };

  constructor(private coursesApi: CoursesApiService, private router: Router,
              private route: ActivatedRoute, private scopeSource: ScopeService,
              private loginService: LoginService) {};

  updateName(event: any) { this.loadedCourse.name = event.target.value; }

  updateCourseId(event: any) {
    var e = document.getElementById("prefix") as HTMLSelectElement;
    var value = e.options[e.selectedIndex].value;
    var text = e.options[e.selectedIndex].text;

    this.loadedCourse.course_id = text + event.target.value;
  }

  updateFreqSpr(event: any) { this.loadedCourse.freq_spr = event.target.value; }

  updateFreqSum1(event: any) {
    this.loadedCourse.freq_sum1 = event.target.value;
  }

  updateFreqSum2(event: any) {
    this.loadedCourse.freq_sum2 = event.target.value;
  }

  updateFreqFal(event: any) { this.loadedCourse.freq_fal = event.target.value; }

  updateFreqSpr_l(event: any) {
    this.loadedCourse.freq_spr_l = event.target.value;
  }

  updateFreqSum1_l(event: any) {
    this.loadedCourse.freq_sum1_l = event.target.value;
  }

  updateFreqSum2_l(event: any) {
    this.loadedCourse.freq_sum2_l = event.target.value;
  }

  updateFreqFal_l(event: any) {
    this.loadedCourse.freq_fal_l = event.target.value;
  }

  submitCourse() {

    // var e = document.getElementById("chooseCoordinator") as
    // HTMLSelectElement; var value = e.options[e.selectedIndex].value; var text
    // = e.options[e.selectedIndex].text;

    this.loadedCourse.owner = this.scope.username;
    this.loadedCourse.token = this.scope.token;

    this.coursesApi.editCourse(this.loadedCourse)
        .subscribe(() => this.router.navigate([ '/edit-course' ]),
                   error => alert(error.message));
  };

  deleteCourse() {
	this.coursesApi.deleteCourse(this.loadedCourse)
	.subscribe(() => this.router.navigate(['/courses']),
		error => alert(error.message));
  };

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
      	  this.router.navigate([ '/login' ]);
    }
    this.scope.year = this.scope.default_year;
    this.dataRefresh();
  };
  dataRefresh() {
    this.route.params.subscribe(
        params => { this.loadedCourse.course_id = params['id']; });
    this.loadedCourse.token = this.scope.token;
    this.dataSub =
        this.coursesApi.getCourse(this.loadedCourse).subscribe(res => {
          this.data = res, this.loadedCourse = this.data;
        }, console.error);
  };
}