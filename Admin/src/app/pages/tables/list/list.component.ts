import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common'; //Funciones de angular
import { RouterModule, Router } from '@angular/router';
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
  // Corrijo el nombre de la variable y agrego el método para el cambio de motor en el listado de tablas
  motorTablasSeleccionado: string = 'sqlserver';
  motoresTablas = [
    { nombre: 'SQL Server', valor: 'sqlserver', imagen: 'assets/images/sqlserver.png' },
    { nombre: 'MySQL', valor: 'mysql', imagen: 'assets/images/mysql.png' }
  ];
  motorBDSeleccionado: string = 'sqlserver'; // 0 para SQL Server, 1 para MySQL
  motoresBD = [
    { nombre: 'SQL Server', valor: '0', imagen: 'assets/images/sqlserver.png' },
    { nombre: 'MySQL', valor: '1', imagen: 'assets/images/mysql.png' }
  ];

  // Tipos de datos para SQL Server y MySQL
  tiposDatosSQLServer: string[] = [
    'INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'BIT', 'DECIMAL', 'NUMERIC', 'MONEY', 'SMALLMONEY',
    'FLOAT', 'REAL', 'DATE', 'TIME', 'DATETIME', 'DATETIME2', 'SMALLDATETIME', 'CHAR', 'NCHAR',
    'VARCHAR', 'NVARCHAR', 'TEXT', 'NTEXT', 'BINARY', 'VARBINARY', 'IMAGE', 'UNIQUEIDENTIFIER',
    'XML', 'GEOGRAPHY', 'GEOMETRY', 'HIERARCHYID'
  ];
  tiposDatosMySQL: string[] = [
    'INT', 'INTEGER', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'BIGINT', 'DECIMAL', 'NUMERIC', 'FLOAT',
    'DOUBLE', 'BIT', 'CHAR', 'VARCHAR', 'BINARY', 'VARBINARY', 'TINYBLOB', 'BLOB', 'MEDIUMBLOB',
    'LONGBLOB', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'ENUM', 'SET', 'DATE', 'TIME',
    'DATETIME', 'TIMESTAMP', 'YEAR', 'JSON'
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.crearTablaForm = this.fb.group({
      tableName: ['', Validators.required],
      columns: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          dataType: ['', Validators.required],
          length: [''], // <-- Agregado para binding reactivo
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
      length: [''], // <-- Asegura que cada columna nueva tenga el campo length
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

  listarBasesDeDatos(motorParam?: string): void {
    const loader = document.getElementById('elmLoader');
    const motor = motorParam || this.motorBDSeleccionado;
    const url = `https://localhost:7241/databases-list?motor=${motor}`;
    this.http.get<string[]>(url).subscribe({
      next: (data) => {
        loader?.classList.add('d-none');
        this.BasesDatos = data;
      },
      error: (error) => {
        console.error('Error al obtener las bases de datos:', error);
      }
    });
  }

  // Conversión entre motor de bases de datos (0/1) y motor de tablas (sqlserver/mysql)
  motorBDToTablas(motorBD: string): string {
    return motorBD === '0' ? 'sqlserver' : 'mysql';
  }

  motorTablasToBD(motorTablas: string): string {
    return motorTablas === 'sqlserver' ? '0' : '1';
  }

  onMotorBDChange() {
    this.listarBasesDeDatos();
    this.selectedBD = '';
    this.TablasBD = [];
    this.motorTablasSeleccionado = this.motorBDToTablas(this.motorBDSeleccionado); // Sincroniza motores
  }

  onMotorTablasChange() {
    this.BasesDatos = [];
    this.selectedBD = '';
    setTimeout(() => {
      this.listarBasesDeDatos(this.motorTablasToBD(this.motorTablasSeleccionado));
    }, 0);
  }

  listarTablasDeBD(nombreBD: string) {
    const url = `https://localhost:7241/list-tables?databaseName=${encodeURIComponent(nombreBD)}&motor=${this.motorTablasSeleccionado}`;
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
    // selectedBD ya debe estar correctamente seteado desde el dropdown principal
    this.modalRef = this.modalService.show(template);
  }

  crearTabla() {
    if (this.crearTablaForm.invalid) {
      this.crearTablaForm.markAllAsTouched();
      return;
    }
    if (!this.selectedBD) {
      Swal.fire('Error', 'Debes seleccionar una base de datos antes de crear la tabla.', 'error');
      return;
    }
    // Siempre incluir todos los campos en cada columna
    // Al enviar, concatena la longitud si corresponde
    const formValue = JSON.parse(JSON.stringify(this.crearTablaForm.value));
    formValue.columns = formValue.columns.map((col: any) => {
      // Si el tipo requiere longitud y hay longitud, concatena
      if (this.requiereLongitud(col.dataType) && col.length && !/\(.*\)/.test(col.dataType)) {
        col.dataType = `${col.dataType}(${col.length})`;
      }
      if (col.isPrimaryKey === undefined) col.isPrimaryKey = false;
      if (col.isNullable === undefined) col.isNullable = false;
      delete col.length;
      return col;
    });
    const url = `https://localhost:7241/create-table/${encodeURIComponent(this.selectedBD)}?motor=${this.motorTablasSeleccionado}`;
    console.log('JSON enviado a create-table:', JSON.stringify(formValue, null, 2));
    this.http.post(url, formValue, { responseType: 'text' as 'json' }).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Tabla creada correctamente.', 'success');
        this.modalRef?.hide();
        this.listarTablasDeBD(this.selectedBD);
      },
      error: (error) => {
        if (error.status === 200) {
          Swal.fire('Éxito', 'Tabla creada correctamente.', 'success');
          this.modalRef?.hide();
          this.listarTablasDeBD(this.selectedBD);
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

  eliminarTabla(nombreBD: string, nombreTabla: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la tabla "${nombreTabla}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://localhost:7241/delete-table?databaseName=${encodeURIComponent(nombreBD)}&nombreTabla=${encodeURIComponent(nombreTabla)}`;
        this.http.delete(url, { responseType: 'text' as 'json' }).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La tabla ha sido eliminada correctamente.', 'success');
            this.listarTablasDeBD(nombreBD);
          },
          error: (error) => {
            if (error.status === 200) {
              Swal.fire('Eliminado', 'La tabla ha sido eliminada correctamente.', 'success');
              this.listarTablasDeBD(nombreBD);
            } else {
              Swal.fire('Error', 'No se pudo eliminar la tabla.', 'error');
              console.error('Error al eliminar la tabla:', error);
            }
          }
        });
      }
    });
  }

  onSelectBD(nombre: string) {
    this.selectedBD = nombre;
    this.listarTablasDeBD(nombre);
  }

  // Maneja el cambio de base de datos en el modal para asegurar que selectedBD tenga el valor correcto
  onSelectBDModal(event: any) {
    this.selectedBD = event.target.value;
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

  // Devuelve true si el tipo de dato requiere longitud (ej: VARCHAR, NVARCHAR, CHAR, etc.)
  requiereLongitud(tipo: string): boolean {
    if (!tipo) return false;
    const tiposConLongitud = [
      'VARCHAR', 'NVARCHAR', 'CHAR', 'NCHAR', 'VARBINARY', 'BINARY',
      'VARCHAR2', 'NVARCHAR2', 'TINYTEXT', 'TINYBLOB', 'VARBINARY', 'VARBINARY'
    ];
    // Solo requiere longitud si el tipo es exactamente alguno de la lista
    return tiposConLongitud.includes(tipo.toUpperCase());
  }

  // Obtiene la longitud de un formGroup columna de forma robusta
  getColLength(col: any): any {
    return col.get('length')?.value || col.value.length || '';
  }

  verRegistrosTabla(nombreTabla: string) {
    // Navega a la ruta de registros de la tabla seleccionada
    this.router.navigate(['/tables/registros', this.selectedBD, nombreTabla, this.motorTablasSeleccionado]);
  }
}
