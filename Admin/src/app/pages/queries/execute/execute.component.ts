import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-execute',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './execute.component.html',
  styleUrl: './execute.component.scss'
})
export class ExecuteComponent implements OnInit {
  motoresBD = [
    { nombre: 'SQL Server', valor: 0 },
    { nombre: 'MySQL', valor: 1 }
  ];
  motorSeleccionado = 0;
  basesDatos: string[] = [];
  databaseSeleccionada = '';
  sql = '';
  resultados: any[] = [];
  columnas: string[] = [];
  error: string | null = null;
  mensaje: string | null = null;
  filasAfectadas: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarBasesDatos();
  }

  onMotorChange() {
    this.databaseSeleccionada = '';
    this.motorSeleccionado = Number(this.motorSeleccionado); // Forzar a número
    this.cargarBasesDatos();
  }

  cargarBasesDatos() {
    this.basesDatos = [];
    this.http.get<string[]>(`https://localhost:7241/databases-list?motor=${this.motorSeleccionado}`).subscribe({
      next: (data) => this.basesDatos = data,
      error: () => this.basesDatos = []
    });
  }

  ejecutarQuery() {
    this.error = null;
    this.mensaje = null;
    this.filasAfectadas = null;
    this.resultados = [];
    this.columnas = [];
    if (!this.sql.trim() || !this.databaseSeleccionada) return;
    // Detecta si la consulta es un SELECT (ignorando espacios y mayúsculas)
    const isSelect = /^\s*select\b/i.test(this.sql);
    // Reemplaza saltos de línea y tabulaciones por espacios simples
    const sqlSinSaltos = this.sql.replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    const body = {
      databaseName: this.databaseSeleccionada,
      sql: sqlSinSaltos,
      motor: Number(this.motorSeleccionado), // Forzar a número
      returnResults: isSelect
    };
    console.log('Body enviado a /sql-libre:', body);
    this.http.post<any>(
      'https://localhost:7241/script',
      body
    ).subscribe({
      next: (resp) => {
        if (isSelect) {
          if (Array.isArray(resp) && resp.length > 0) {
            this.resultados = resp;
            this.columnas = Object.keys(resp[0]);
          } else if (Array.isArray(resp) && resp.length === 0) {
            this.resultados = [];
          } else if (resp && resp.result) {
            this.resultados = resp.result;
            this.columnas = this.resultados.length > 0 ? Object.keys(this.resultados[0]) : [];
          } else {
            this.resultados = [];
          }
        } else {
          // No es SELECT, mostrar mensaje y filas afectadas
          this.mensaje = resp?.mensaje || 'Query ejecutada.';
          this.filasAfectadas = resp?.filasAfectadas ?? null;
        }
      },
      error: (err) => {
        this.error = err?.error || 'Error al ejecutar la consulta.';
      }
    });
  }
}
