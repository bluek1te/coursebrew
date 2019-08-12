import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { HelloComponent } from './hello/hello.component';
import { InstructorShowComponent } from './instructors/instructor-show.component';
import { AddInstructorComponent } from './instructors/add-instructor.component';
import { AddCourseComponent } from './courses/add-course.component';
import { CoursesShowComponent } from './courses/courses-show.component';
import { DeveloperComponent } from './developer/developer.component';
import { EditCourseComponent } from './courses/edit-course.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'instructors', component: InstructorsComponent}, 
    //children: 
    //[{ path: ':id', component: InstructorShowComponent}] },
  { path: 'instructors/:id', component: InstructorShowComponent },
  { path: 'courses', component: CoursesComponent},
  { path: 'courses/:id', component: CoursesShowComponent} ,
  { path: 'hello', component: HelloComponent },
  { path: 'add-instructor', component: AddInstructorComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'developer', component: DeveloperComponent },
  { path: 'courses/:id/edit-course/:id', component: EditCourseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent }
  
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
