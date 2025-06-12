
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { SharedModule } from 'src/app/shared/shared.module';
//Wizard
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { DatabasesRoutingModule } from './databases-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DatabasesRoutingModule,
    SharedModule,
    CdkStepperModule,
    NgStepperModule
  ]
})
export class DatabasesModule { }
