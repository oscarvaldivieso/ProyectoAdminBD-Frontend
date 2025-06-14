
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { SharedModule } from 'src/app/shared/shared.module';
//Wizard
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { TablesRoutingModule } from './tables-routing.module';
import { ModalsComponent } from '../ui/modals/modals.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ListComponent} from './list/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    ListComponent,
    CommonModule,
    TablesRoutingModule,
    SharedModule,
    CdkStepperModule,
    NgStepperModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TablesModule { }
