import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { InstructorsApiService } from './instructors-api.service';
import { Instructor } from './instructor';
import { Scope } from '../scope';
import {
 ScopeService
} from '../scope.service';
import {
 LoginService
} from '../login/login.service';
import { Router } from "@angular/router";



@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.css']
})
export class InstructorsComponent implements OnInit, OnDestroy {
  title = 'instructors';
  instructorsListSubs: Subscription;
  instructorsList: Instructor[];
  scope: Scope = {
	username: " ",
	year: " "
  };
  scopeSubs: Subscription;
  yearString: String; 


  
  constructor(private router: Router,private instructorsApi: InstructorsApiService, private scopeSource: ScopeService, private loginService: LoginService) {

  }

  ngOnInit() {
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
            this.yearString = this.scope.year + " - " + (parseInt(this.scope.year) + 1);
            this.dataRefresh();
        };


  dataRefresh() {

     this.instructorsListSubs = this.instructorsApi
        .getInstructors(this.scope)
        .subscribe(res => {
            this.instructorsList = res;
        },
        console.error
     );
     console.log(this.instructorsList)
  }
  ngOnDestroy() {
     this.instructorsListSubs.unsubscribe();
  }
  

}
