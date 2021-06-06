import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { OnlineOfflineService } from './online-offline.service';
import { Observable } from 'rxjs';

export abstract class BaseService<T extends { id: string; }> {

  protected db: Dexie;
  table: Dexie.Table<T, any> = null;

  private http: HttpClient;
  private onlineOfflineService: OnlineOfflineService

  constructor(protected injector: Injector,
    protected nomeTabela: string,
    protected urlApi: string) {
    this.http = this.injector.get(HttpClient);
    this.onlineOfflineService = this.injector.get(OnlineOfflineService);
    this.ouvirStatusConexao();
    this.iniciarIndexedDb();
  }

  private iniciarIndexedDb() {
    this.db = new Dexie('db-tabelas');
    this.db.version(1).stores({
      [this.nomeTabela]: 'id'
    });
    this.table = this.db.table(this.nomeTabela);
  }

  private salvarAPI(tabela: T) {
    this.http.post(this.urlApi, tabela)
      .subscribe(() => {
        alert('tabela foi cadastrado com sucesso'),
          error => {
            console.log("Erro ao cadastrar tabela");
          }
      });
  }
  private async salvarIndexedDb(tabela: T) {
    try {
      await this.table.add(tabela);
      const todostabelas: T[] = await this.table.toArray();
      console.log('tabela foi salvo no IndexedDb', todostabelas);

    } catch (error) {
      console.log('Erro ao tentar incerir tabela no IndexedDb', error);
    }
  }

  private async enviarIndexedDbParaAPI(){
    const todostabelas: T[] = await this.table.toArray();
  
    for (const tabela of todostabelas) {
      this.salvarAPI(tabela);
      await this.table.delete(tabela.id);
      console.log(`tabela com id ${tabela.id} foi excluído com sucesso`);
    }
  }

  salvar(tabela: T) {
    if (this.onlineOfflineService.isOnline) {
      this.salvarAPI(tabela);
    } else {
      this.salvarIndexedDb(tabela);
    }
  }

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.urlApi)
  }

  private ouvirStatusConexao() {
    this.onlineOfflineService.statusConexao
      .subscribe(online => {
        if (online) {
          this.enviarIndexedDbParaAPI();
        } else {
          console.log('Estou offline')
        }
      });
  }


}
