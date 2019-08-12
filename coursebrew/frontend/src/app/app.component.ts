import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ScopeService } from './scope.service';
import { Scope } from './scope';
import { LoginService } from './login/login.service';
import { Subscription } from 'rxjs/Subscription';
import { CoursesApiService } from './courses/courses-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  scope: Scope = {
	username: " ",
	year: " ",
        token: " "
  };
  scopeSubs: Subscription;
  title = 'Coursebrew';
  constructor(private router: Router, private scopeSource: ScopeService, private loginService: LoginService, private coursesApiService: CoursesApiService) { };
  ngOnInit() {
 	 this.scopeSource.currentScope.subscribe(scope => this.scope = scope);
	 if (this.scope.username == " ") {
            this.scopeSubs = this.loginService.check_login_cache()
                .subscribe(res => {
                    this.scope = res;
                },
                    console.error,
                    () => this.updateScope()
                );
         }

   }

  updateScope() {
	this.scope.year = this.scope.default_year;
	this.scopeSource.changeScope(this.scope)
  }


  redirectLogin(){
	 if(this.scope.token == " " || this.scope.token == undefined){
		this.router.navigate(['/login'])
 	 }
	 
  }

  checkLogin() {
	 if(this.scope.token == " " || this.scope.token == undefined){
		return false;
 	 }
	 else{
		return true;
	 }
  }

  logout() {
         this.scopeSubs = this.loginService.logout()
					.subscribe(res => {
						this.scope = res;
					},
					console.error, 
					()=> this.redirectLogout()
					);


  }

  redirectLogout(){
	this.scopeSource.changeScope(this.scope);
	this.router.navigate(['/login'])
  }
}


