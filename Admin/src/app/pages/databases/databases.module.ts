
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { SharedModule } from 'src/app/shared/shared.module';
//Wizard
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { DatabasesRoutingModule } from './databases-routing.module';
import { ModalsComponent } from '../ui/modals/modals.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ListComponent} from './list/list.component';

@NgModule({
  declarations: [
  ],
  imports: [
    ListComponent,
    CommonModule,
    DatabasesRoutingModule,
    SharedModule,
    CdkStepperModule,
    NgStepperModule,
    ModalModule.forRoot()
  ]
})
export class DatabasesModule { }
