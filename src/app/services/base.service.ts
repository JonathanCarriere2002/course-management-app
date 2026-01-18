import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected  readonly url;
  constructor() {
    this.url = environment.api;
  }
}
