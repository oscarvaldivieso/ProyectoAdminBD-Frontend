import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { ListComponent } from './list/list.component';
import { TableviewComponent } from './tableview/tableview.component';



const routes: Routes = [
  {
    path: "list",
    component: ListComponent
  },
  {
    path: 'registros/:bd/:tabla/:motor',
    component: TableviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesRoutingModule { }
