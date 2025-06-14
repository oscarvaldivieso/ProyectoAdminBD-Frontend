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
    CommonModule,
    RouterModule,
    NgxSliderModule,
    BsDropdownModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{

  modalRef?: BsModalRef;

  constructor(
    // ...existing code...
    private modalService: BsModalService
  ) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
    

  nuevoNombreBD: string = '';

  http = inject(HttpClient);

  BasesDatos: string[] = []; //Arreglo que usaremos para traer lo del endpoint
  

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

  

  showFilter() {
    const filterStyle = (document.getElementById("propertyFilters") as HTMLElement).style.display;
    if (filterStyle == 'none') {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'block'
    } else {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'none'
    }
  }

  verDetalles(db: string) {
    // Aquí puedes navegar a la vista de tablas o mostrar un modal con las tablas de la base de datos
    // Por ejemplo, podrías usar el router para navegar:
    // this.router.navigate(['/ruta-a-tablas', db]);
    console.log('Ver detalles de la base de datos:', db);
  }

  crearBaseDeDatos() {
    if (!this.nuevoNombreBD.trim()) {
      Swal.fire('Error', 'El nombre de la base de datos no puede estar vacío.', 'error');
      return;
    }
    const url = `https://localhost:7241/${this.nuevoNombreBD}`;
    this.http.post(url, {}, { responseType: 'text' as 'json' }).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Base de datos creada correctamente.', 'success');
        this.nuevoNombreBD = '';
        const modal = document.getElementById('modalAgregarBD');
        if (modal) {
          (window as any).bootstrap?.Modal.getOrCreateInstance(modal).hide();
        }
        this.listarBasesDeDatos();
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo crear la base de datos.', 'error');
        console.error('Error al crear la base de datos:', error);
      }
    });
  }

  
}
