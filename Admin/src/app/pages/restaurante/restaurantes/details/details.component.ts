import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    SlickCarouselModule,
    SharedModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent implements OnInit{

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  restaurante: any;
  servicios: any[] = [];
  imagenes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}



  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Restaurante', active: true },
      { label: 'Detalles de restaurante', active: true }
    ];

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`https://localhost:7091/BuscarRestaurante?id=${id}`)
      .subscribe(response => {
        this.restaurante = response.restaurante;
        this.servicios = response.servicios;
        this.imagenes = response.imagenes;
      });
  }

  slidesConfig = {
    // Configuration options for the ngx-slick-carousel
    slidesToShow: 1,
    slidesToScroll: 1
  }

  

}
