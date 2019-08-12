import { Component, OnInit } from '@angular/core';
import { DeveloperService } from './developer.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.css']
})
export class DeveloperComponent implements OnInit {
  returnSubs: Subscription;
  returnCode: any;

  constructor(
    private developerApi: DeveloperService
  ) {}

  ngOnInit() {
  }

  testButton() {
     this.returnSubs = this.developerApi
     .getFromCsv()
     .subscribe(res => { this.returnCode = res }, console.error
     );
  };


}
