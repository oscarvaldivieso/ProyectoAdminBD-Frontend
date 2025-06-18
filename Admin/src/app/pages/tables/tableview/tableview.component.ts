import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tableview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tableview.component.html',
  styleUrl: './tableview.component.scss'
})
export class TableviewComponent implements OnInit {
  nombreTabla = '';
  nombreBD = '';
  motor = '';
  registros: any[] = [];
  columnas: string[] = [];
  insertForm: FormGroup;
  insertSql: string = '';
  insertResult: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder) {
    this.insertForm = this.fb.group({
      sql: ['']
    });
  }

  ngOnInit() {
    this.nombreBD = this.route.snapshot.paramMap.get('bd') || '';
    this.nombreTabla = this.route.snapshot.paramMap.get('tabla') || '';
    this.motor = this.route.snapshot.paramMap.get('motor') || '';
    this.cargarRegistros();
  }

  cargarRegistros() {
    const motorNum = this.motor === 'mysql' ? 1 : this.motor === 'sqlserver' ? 0 : Number(this.motor);
    const body = {
      databaseName: this.nombreBD,
      tableName: this.nombreTabla,
      motor: motorNum
    };
    this.http.post<any[]>(
      'https://localhost:7241/consultar',
      body
    ).subscribe({
      next: (data) => {
        this.registros = data;
        this.columnas = data.length ? Object.keys(data[0]) : [];
      },
      error: (err) => {
        this.registros = [];
        this.columnas = [];
      }
    });
  }

  insertarRegistro() {
    const motorNum = this.motor === 'mysql' ? 1 : 0;
    const body = {
      sql: this.insertForm.value.sql,
      databaseName: this.nombreBD,
      motor: motorNum
    };
    console.log('Payload enviado al insertar:', body);
    this.http.post('https://localhost:7241/insertar', body, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.insertResult = 'Registro insertado correctamente';
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Registro insertado correctamente',
          timer: 1800,
          showConfirmButton: false
        });
        this.cargarRegistros();
      },
      error: (err) => {
        this.insertResult = 'Error al insertar: ' + (err.error || err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.insertResult,
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}
