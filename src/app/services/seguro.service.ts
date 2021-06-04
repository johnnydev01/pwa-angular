import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Seguro } from '../components/models/seguro';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {

  private API_SEGUROS = 'http://localhost:9000/api/seguros';

  constructor(private http: HttpClient) { }

  cadastrar(seguro: Seguro){
    this.http.post(this.API_SEGUROS, seguro)
      .subscribe(()=>{
        alert('Seguro foi cadastrado com sucesso'),
        error=>{
          console.log("Erro ao cadastrar seguro");
        }
      })
  }
}
