import { Injectable, Injector } from '@angular/core';
import { Seguro } from '../components/models/Seguro';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService extends BaseService<Seguro>{

  constructor(protected injector: Injector) { 
    super(injector, 'seguros', 'http://localhost:9000/api/seguros');
  }

 
}
