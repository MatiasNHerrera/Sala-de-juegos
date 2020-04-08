import { log } from 'util';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable, from } from 'rxjs';

@Injectable()
export class MiHttpService {

  constructor( public http: HttpClient ) { }

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
}
