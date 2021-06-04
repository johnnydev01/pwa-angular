import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaCarroService } from 'src/app/services/marca-carro.service';
import { SeguroService } from 'src/app/services/seguro.service';
import { MarcaCarro } from '../models/MarcaCarro';
import { Seguro } from '../models/seguro';
@Component({
  selector: 'app-cadastro-seguro',
  templateUrl: './cadastro-seguro.component.html',
  styleUrls: ['./cadastro-seguro.component.css']
})
export class CadastroSeguroComponent implements OnInit {

  constructor(private marcaCarroService: MarcaCarroService,
              private seguroService: SeguroService) { }

   public seguro = new Seguro();
   marcasCarro$: Observable<MarcaCarro[]>;

  ngOnInit(): void {
    this.marcasCarro$ = this.marcaCarroService.getMarcas();
  }

  enviarNotificacao(){return this.seguro}

  cadastrar(){
    this.seguro.id = this.seguro.placaCarro;
    this.seguroService.salvar(this.seguro);
  }


}
