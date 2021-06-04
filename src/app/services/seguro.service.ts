import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Observable } from 'rxjs';
import { Seguro } from '../components/models/seguro';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {

  private API_SEGUROS = 'http://localhost:9000/api/seguros';
  private db: Dexie;
  private table: Dexie.Table<Seguro, any> = null;

  constructor(private http: HttpClient,
              private onlineOfflineService: OnlineOfflineService) { 
                this.ouvirStatusConexao();
                this.iniciarIndexedDb();
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
  private async  salvarIndexedDb(seguro: Seguro){
    try {
      await this.table.add(seguro);
      const todosSeguros: Seguro[] =  await this.table.toArray();
      console.log('Seguro foi salvo no IndexedDb', todosSeguros);
      
    } catch (error) {
      console.log('Erro ao tentar incerir seguro no IndexedDb', error);
    }
  }

  private async enviarIndexedDbParaAPI(){
    const todosSeguros: Seguro[] =  await this.table.toArray();
    for (const seguro of todosSeguros){
      this.salvarAPI(seguro);
      await this.table.delete(seguro.id);
      console.log(`Seguro com id ${seguro.id} foi excluído com sucesso`);
    }
  }

  salvar(seguro: Seguro){
    if(this.onlineOfflineService.isOnline){
      this.salvarAPI(seguro);
    } else {
      this.salvarIndexedDb(seguro);
    }
  }

  listar(): Observable<Seguro[]>{
    return this.http.get<Seguro[]>(this.API_SEGUROS)
  }

  private ouvirStatusConexao(){
    this.onlineOfflineService.statusConexao
      .subscribe(online => {
        if(online){
          this.enviarIndexedDbParaAPI();
        } else{
          console.log('Estou offline')
        }
      });
  }

  private iniciarIndexedDb(){
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      seguro: 'id'
    });
    this.table = this.db.table('seguro');
  }
}
