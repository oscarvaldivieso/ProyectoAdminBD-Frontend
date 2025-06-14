import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Options } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from 'ngx-slider-v2';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  http = inject(HttpClient);
  

  //Arreglos que usaremos para almacenar los datos de las bases de datos y tablas
  BasesDatos: string[] = []; //Arreglo que usaremos para traer lo del endpoint
  TablasBD: string[] = [];


  ngOnInit(){
    this.listarBasesDeDatos();
  }

  listarBasesDeDatos(): void{
    const loader = document.getElementById('elmLoader');
  
    this.http.get<string[]>('https://localhost:7241/databases-list').subscribe({
      next: (data) => {
        loader?.classList.add('d-none');
        this.BasesDatos = data;
      },
      error: (error) => {
        console.error('Error al obtener las bases de datos:', error);
      }
    });
  }


  listarTablasDeBD(nombreBD: string) {
    const url = `https://localhost:7241/list-tables?databaseName=${encodeURIComponent(nombreBD)}`;
    this.http.get<string[]>(url).subscribe({
      next: (data) => {
        this.TablasBD = data;
        console.log('Tablas de la BD', nombreBD, ':', data);
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron obtener las tablas de la base de datos.', 'error');
        console.error('Error al obtener las tablas:', error);
      }
    });
  }
}
