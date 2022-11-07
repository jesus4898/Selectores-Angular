import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
//en js todos los objetos pasan por referencias y puede que por accidente se modifiquen
//para prevenir se usan privador
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private baseUrl: string = 'https://restcountries.com/v2'


  get regiones( ): string[] { 
    return [ ...this._regiones ]
  }
//se imprime asi para que sea una copia y se pueda modificar y no afecte a la original
  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {

    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`

    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo( codigo: string): Observable<Pais | null>{

    //en caso de recibir un string vacio o no valido

    if(!codigo) {
      // return {}
      //retornamos un objeto
      //para retornar un observable
      return of(null)
      //regresamos un onservable que emita null
    }

    const url = `${this.baseUrl}/alpha/${codigo}`
    return this.http.get<Pais>( url )

  }

//para q aparezca el nombre completo
  getPaisesPorCodigoSmall( codigo: string ): Observable<PaisSmall> {


    const url = `${this.baseUrl}/alpha/${codigo}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall>( url )
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {

    if( !borders) {
      return of( [] )
    }

    const peticiones: Observable<PaisSmall>[] = []
    //esto significa que es un arreglo de peticiones que se inicializa vacio

    borders.forEach( codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push( peticion );
    } )

    //para disparar las peticiones de manera simultanea

    return combineLatest( peticiones )
  }

}
