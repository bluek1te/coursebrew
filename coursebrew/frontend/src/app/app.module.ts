import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { InstructorsApiService } from './instructors/instructors-api.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { HelloComponent } from './hello/hello.component';
import { InstructorShowComponent } from './instructors/instructor-show.component';
import { AddInstructorComponent } from './instructors/add-instructor.component';
import { AddCourseComponent } from './courses/add-course.component';
import { CoursesShowComponent } from './courses/courses-show.component';
import { FormsModule } from '@angular/forms';
import { DeveloperComponent } from './developer/developer.component';
import { EditCourseComponent } from './courses/edit-course.component';
import { LoginComponent } from './login/login.component';
import { AppGlobal } from './app.global';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    InstructorsComponent,
    CoursesComponent,
    HomeComponent,
    HelloComponent,
    InstructorShowComponent,
    AddInstructorComponent,
    AddCourseComponent,
    CoursesShowComponent,
    DeveloperComponent,
    EditCourseComponent,
    LoginComponent,
    AdminComponent,
  ],
  imports: [
  BrowserModule,
  NgbModule,
  AppRoutingModule,
  HttpClientModule,
  FormsModule,
  ],
  providers: [
  InstructorsApiService,
  AppGlobal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
