import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seguro } from '../components/models/seguro';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {

  private API_SEGUROS = 'http://localhost:9000/api/seguros';

  constructor(private http: HttpClient,
              private onlineOfflineService: OnlineOfflineService) { 
                this.ouvirStatusConexao();
              }

  private salvarAPI(seguro: Seguro){
    this.http.post(this.API_SEGUROS, seguro)
    .subscribe(()=>{
      alert('Seguro foi cadastrado com sucesso'),
      error=>{
        console.log("Erro ao cadastrar seguro");
      }
    })
  }
  salvar(seguro: Seguro){
    if(this.onlineOfflineService.isOnline){
      this.salvarAPI(seguro);
    } else {
      console.log('Salvar seguro no banco local');
    }
  }

  listar(): Observable<Seguro[]>{
    return this.http.get<Seguro[]>(this.API_SEGUROS)
  }

  private ouvirStatusConexao(){
    this.onlineOfflineService.statusConexao
      .subscribe(online => {
        if(online){
          console.log('Enviando os dados do meu banco local para a API');
        } else{
          console.log('Estou offline')
        }
        
      })
  }
}
