import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SeguroService } from 'src/app/services/seguro.service';
import { Seguro } from '../models/seguro';

@Component({
  selector: 'app-listar-seguros',
  templateUrl: './listar-seguros.component.html',
  styleUrls: ['./listar-seguros.component.css']
})
export class ListarSegurosComponent implements OnInit {

  constructor(private seguroService: SeguroService) { }

  seguros$: Observable<Seguro[]>;

  ngOnInit() {
    this.seguros$ = this.seguroService.listar();
  }



}
