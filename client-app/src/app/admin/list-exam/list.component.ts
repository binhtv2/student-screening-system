import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Exam } from 'src/app/shared/models/exam';
import { ApiResponse } from '../../shared/models/api-response';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppStore } from 'src/app/redux/app.store';
import { Observable, Subscription } from 'rxjs';
import { AdminLoadExams } from 'src/app/redux/actions/actions';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-list-exam',
  templateUrl: './list.component.html',
})
export class ListExamComponent implements OnInit {
  exams: Observable<Array<Exam>>;
  sending: boolean = false;
  private subscription: Subscription;


  constructor(private store: Store<AppStore>, private router: Router, private adminService: AdminService, private formBuilder: FormBuilder) {
    this.exams = store.select(store => store.admin.exams);
  }

  ngOnInit() {
    this.adminService.loadExams().subscribe((resp: ApiResponse) => {
      if(resp.code === 1) {
        this.store.dispatch(new AdminLoadExams(resp.data));
      } else {
        //this.store.dispatch(new Error(err));
      }
    });

    this.subscription = this.exams.subscribe(exams => {
      console.log(exams);
    });
  }

  publishResult($event, examId) {
    this.adminService.publishExamResult(examId).subscribe((resp: ApiResponse) => {
      if(resp.code === 1) {
        $event.target.parentNode.innerHTML = '<span class="success">Sent</span>';
      } else {
        $event.target.parentNode.innerHTML = '<span class="error">Fail to sent</span>';
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
