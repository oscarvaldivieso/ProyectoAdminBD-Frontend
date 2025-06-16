import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common'; //Funciones de angular
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

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
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  http = inject(HttpClient);
  

  //Arreglos que usaremos para almacenar los datos de las bases de datos y tablas
  BasesDatos: string[] = []; //Arreglo que usaremos para traer lo del endpoint
  TablasBD: string[] = [];

  crearTablaForm: FormGroup;
  editarTablaForm: FormGroup;
  modalRef?: BsModalRef;
  selectedBD: string = '';
  tablaAEditar: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    this.crearTablaForm = this.fb.group({
      tableName: ['', Validators.required],
      columns: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          dataType: ['', Validators.required],
          isPrimaryKey: [false],
          isNullable: [false] // Asegura valor booleano por defecto
        })
      ])
    });
    this.editarTablaForm = this.fb.group({
      tableName: ['', Validators.required],
      alterations: this.fb.array([
        this.fb.group({
          operation: ['ALTER', Validators.required],
          columnName: ['', Validators.required],
          dataType: ['', Validators.required],
          isNullable: [false]
        })
      ])
    });
  }

  get columns() {
    return this.crearTablaForm.get('columns') as FormArray;
  }

  get alterations() {
    return this.editarTablaForm.get('alterations') as FormArray;
  }

  addColumn() {
    this.columns.push(this.fb.group({
      name: ['', Validators.required],
      dataType: ['', Validators.required],
      isPrimaryKey: [false],
      isNullable: [false] // Asegura valor booleano por defecto
    }));
  }

  removeColumn(index: number) {
    if (this.columns.length > 1) {
      this.columns.removeAt(index);
    }
  }

  addAlteration() {
    this.alterations.push(this.fb.group({
      operation: ['ALTER', Validators.required],
      columnName: ['', Validators.required],
      dataType: ['', Validators.required],
      isNullable: [false]
    }));
  }

  removeAlteration(index: number) {
    if (this.alterations.length > 1) {
      this.alterations.removeAt(index);
    }
  }

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

  openCrearTablaModal(template: TemplateRef<any>) {
    this.crearTablaForm.reset();
    // Deja solo una columna por defecto
    while (this.columns.length > 1) {
      this.columns.removeAt(0);
    }
    // Asegura que la columna por defecto tenga isNullable en false
    this.columns.at(0).patchValue({
      isNullable: false,
      isPrimaryKey: false
    });
    this.modalRef = this.modalService.show(template);
  }

  crearTabla(nombreBD: string) {
    if (this.crearTablaForm.invalid) {
      this.crearTablaForm.markAllAsTouched();
      return;
    }
    const url = `https://localhost:7241/create-table/${encodeURIComponent(nombreBD)}`;
    console.log('JSON enviado a create-table:', JSON.stringify(this.crearTablaForm.value, null, 2));
    this.http.post(url, this.crearTablaForm.value, { responseType: 'text' as 'json' }).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Tabla creada correctamente.', 'success');
        this.modalRef?.hide();
        this.listarTablasDeBD(nombreBD);
      },
      error: (error) => {
        if (error.status === 200) {
          Swal.fire('Éxito', 'Tabla creada correctamente.', 'success');
          this.modalRef?.hide();
          this.listarTablasDeBD(nombreBD);
        } else {
          Swal.fire('Error', 'No se pudo crear la tabla.', 'error');
          console.error('Error al crear la tabla:', error);
        }
      }
    });
  }

  openEditarTablaModal(template: TemplateRef<any>, tabla: string) {
    this.tablaAEditar = { tableName: tabla };
    this.editarTablaForm.reset();
    this.editarTablaForm.patchValue({ tableName: tabla });
    // Deja solo una alteración por defecto
    while (this.alterations.length > 1) {
      this.alterations.removeAt(0);
    }
    this.modalRef = this.modalService.show(template);
  }

  editarTabla(nombreBD: string) {
    if (this.editarTablaForm.invalid) {
      this.editarTablaForm.markAllAsTouched();
      return;
    }
    const url = `https://localhost:7241/alter-table/${encodeURIComponent(nombreBD)}`;
    this.http.post(url, this.editarTablaForm.value, { responseType: 'text' as 'json' }).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Tabla alterada correctamente.', 'success');
        this.modalRef?.hide();
        this.listarTablasDeBD(nombreBD);
      },
      error: (error) => {
        if (error.status === 200) {
          Swal.fire('Éxito', 'Tabla alterada correctamente.', 'success');
          this.modalRef?.hide();
          this.listarTablasDeBD(nombreBD);
        } else {
          Swal.fire('Error', 'No se pudo alterar la tabla.', 'error');
          console.error('Error al alterar la tabla:', error);
        }
      }
    });
  }

  onSelectBD(nombre: string) {
    this.selectedBD = nombre;
    this.listarTablasDeBD(nombre);
  }

  onPKChange(index: number) {
    const col = this.columns.at(index);
    if (col.get('isPrimaryKey')?.value) {
      col.get('isNullable')?.setValue(false);
      col.get('isNullable')?.disable();
    } else {
      col.get('isNullable')?.enable();
    }
  }
}
