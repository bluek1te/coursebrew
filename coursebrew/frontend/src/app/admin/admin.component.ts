import { Component, OnInit } from '@angular/core';
import { WarningsApiService } from '../warnings-api.service';
import { Scope } from '../scope';
import { ScopeService } from '../scope.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Log } from './Log';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  scope: Scope
  log: Log
  logSubs: Subscription

  constructor(private router: Router, 
	private scopeSource: ScopeService, 
	private warningsApi: WarningsApiService) { }

  ngOnInit() {
	this.scopeSource.currentScope.subscribe(scope => this.scope = scope);
	this.dataInit()
  }
  
  dataInit() {
    if (this.scope.token == " " || this.scope.token == undefined) {
      this.router.navigate([ '/login' ]) 
    }
      this.scope.year = this.scope.default_year;
    this.dataRefresh();
  }

  dataRefresh() {
    this.logSubs = this.warningsApi
                .getLog(this.scope)
                .subscribe(res => {
                    this.log = res;
                },
		console.error)

  }
}
