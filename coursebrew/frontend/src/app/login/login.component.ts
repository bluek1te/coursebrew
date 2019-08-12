import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from './login.service'; 
import { Scope } from '../scope';
import { ScopeService } from '../scope.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  scope: Scope = {username:" ", test_password:" "};
  loginBuffer: Scope;
  loginSubs: Subscription;

  constructor(private loginService: LoginService, private scopeSource: ScopeService, private router: Router) { }

  ngOnInit() {
    this.scopeSource.currentScope.subscribe(scope => this.scope = scope);
  }

  updateUsername(event: any){
    this.scope.username = event.target.value
  }

  updatePassword(event: any){
    this.scope.test_password = event.target.value
  }

  submitLogin(){
	this.loginSubs = this.loginService.login(this.scope)
					.subscribe(res => {
						this.loginBuffer = res;
					},
					console.error,
					() => this.updateSource()
					);
  } 
  
  updateSource() {
	this.scope = this.loginBuffer;
        this.scope.year = this.scope.default_year;
	this.scopeSource.changeScope(this.scope);
	console.log(this.scope.token);
	if(this.scope.username != " "){
		this.router.navigate(['/home'])
	}
  }

}
