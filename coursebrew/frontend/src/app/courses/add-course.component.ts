/* This file holds the client side working code for the add-component function */

import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from 'rxjs/Subscription';

import {LoginService} from "../login/login.service";
import {Scope} from "../scope";
import {ScopeService} from "../scope.service";

import {Course} from './course';
import {CoursesApiService} from './courses-api.service';

@Component({
  selector : 'app-add-course',
  templateUrl : './add-course.component.html',
  styleUrls : [ './add-course.component.css' ]
  })

export class AddCourseComponent implements OnInit {
  newCourse: Course = {
    name : "TestCourse",
    course_id: "TestID",
    freq_spr: "0",
    freq_sum1: "0",
    freq_sum2: "0",
    freq_fal: "0",
    freq_spr_l: "0",
    freq_sum1_l: "0",
    freq_sum2_l: "0",
    freq_fal_l: "0",
  }
  scopeSubs: Subscription;
  scope: Scope;
  
  //These update functions change the client side objects as the user makes changes to the text fields

  updateName(event: any) { this.newCourse.name = event.target.value; }

  updateCourseId(event: any) {
    var e = document.getElementById("prefix") as HTMLSelectElement;
    var value = e.options[e.selectedIndex].value;
    var text = e.options[e.selectedIndex].text;

    this.newCourse.course_id = text + event.target.value;
  }

  updateFreqSpr(event: any) { this.newCourse.freq_spr = event.target.value; }

  updateFreqSum1(event: any) { this.newCourse.freq_sum1 = event.target.value; }

  updateFreqSum2(event: any) { this.newCourse.freq_sum2 = event.target.value; }

  updateFreqFal(event: any) { this.newCourse.freq_fal = event.target.value; }

  updateFreqSpr_l(event: any) {
    this.newCourse.freq_spr_l = event.target.value;
  }

  updateFreqSum1_l(event: any) {
    this.newCourse.freq_sum1_l = event.target.value;
  }

  updateFreqSum2_l(event: any) {
    this.newCourse.freq_sum2_l = event.target.value;
  }

  updateFreqFal_l(event: any) {
    this.newCourse.freq_fal_l = event.target.value;
  }

  //The submitCourse() function submits the client side objects to the flask server to update the database
  submitCourse() {
    if (this.newCourse.freq_spr == "")
      this.newCourse.freq_spr = "0"
      if (this.newCourse.freq_sum1 == "") this.newCourse.freq_sum1 = "0"
      if (this.newCourse.freq_sum2 == "") this.newCourse.freq_sum2 = "0"
      if (this.newCourse.freq_fal == "") this.newCourse.freq_fal = "0"
      if (this.newCourse.freq_spr_l == "") this.newCourse.freq_spr_l = "0"
      if (this.newCourse.freq_sum1_l == "") this.newCourse.freq_sum1_l = "0"
      if (this.newCourse.freq_sum2_l == "") this.newCourse.freq_sum2_l = "0"
      if (this.newCourse.freq_fal_l == "") this.newCourse.freq_fal_l = "0"

      if (false) {
        var e =
            document.getElementById("chooseCoordinator") as HTMLSelectElement;
        var value = e.options[e.selectedIndex].value;
        var text = e.options[e.selectedIndex].text;

        this.newCourse.owner = text;
      }

      console.log(this.newCourse.freq_fal)
    this.newCourse.owner = this.scope.username;
    this.newCourse.year = this.scope.year;
    this.newCourse.token = this.scope.token;

    this.coursesApi.addCourse(this.newCourse)
        .subscribe(() => this.router.navigate([ '/add-course' ]),
                   error => alert(error.message));
  };

  constructor(private coursesApi: CoursesApiService, private router: Router,
              private scopeSource: ScopeService,
              private loginService: LoginService) {}

	      
//This function runs on initialization of the component
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

  dataRefresh() { this.newCourse.token = this.scope.token; };
}
