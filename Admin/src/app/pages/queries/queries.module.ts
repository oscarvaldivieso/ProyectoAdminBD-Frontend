
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { SharedModule } from 'src/app/shared/shared.module';
//Wizard
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { ModalsComponent } from '../ui/modals/modals.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ExecuteComponent } from './execute/execute.component';
import { QueriesRoutingModule } from './queries-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    ExecuteComponent,
    CommonModule,
    QueriesRoutingModule,
    SharedModule,
    CdkStepperModule,
    NgStepperModule,
    ModalModule.forRoot()
  ]
})
export class QueriesModule { }
