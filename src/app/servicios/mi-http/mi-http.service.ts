import { log } from 'util';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, from } from 'rxjs';

@Injectable()
export class MiHttpService {

  constructor( public http: HttpClient , private firestore : AngularFirestore) { }

  public httpGetP ( url: string)
  {
    return this.http
    .get( url )
    .toPromise()
    .then( this.extractData )
    .catch( this.handleError );
  }

  public httpPostP( url: string, objeto: any )
  {
    return this.http
    .get( url )
    .subscribe( data => {
      console.log( data );
      return data;
    });
  }

  public httpGetO ( url: string): Observable<Object>
  {
    return this.http.get(url).pipe(map((res) => res));
  }


  private extractData ( res: Response )
  {
    return res.json() || {};
  }

  private handleError ( error: Response | any )
  {
    return error;
  }
  
  getTateti()
  {
    return this.firestore.collection("tateti").valueChanges();
  }

  getAnagrama()
  {
    return this.firestore.collection("anagrama").valueChanges();
  }

  getPiedra()
  {
    return this.firestore.collection("piedra-papel-tijera").valueChanges();
  }

  getAgilidad()
  {
    return this.firestore.collection("agilidad").valueChanges();
  }

  getAhorcado()
  {
    return this.firestore.collection("ahorcado").valueChanges();
  }

  getAdivina()
  {
    return this.firestore.collection("adivina").valueChanges();
  }

  getUsuarios()
  {
    return this.firestore.collection("usuarios").valueChanges();
  }

}
