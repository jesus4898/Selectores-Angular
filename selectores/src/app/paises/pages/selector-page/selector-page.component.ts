import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interfaces';

import { switchMap, tap} from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
    //para que aparezca cuando se seleccione el pais
    // frontera: [{value: '', disable: true}, Validators.required],
    

  })
  
  // llenar selectores

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = []
  //para que aparezca el nombre completo
  fronteras: PaisSmall[] = []


  //para mostrar los selectores segun se selecccionen
  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }

//para traer data de un servicio o de un API
  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambie la region

    // this.miFormulario.get('region')?.valueChanges.subscribe( region => {
    //   console.log(region)

    //   this.paisesService.getPaisesPorRegion(region).subscribe( paises => {
    //     console.log(paises)
    //     this.paises = paises;
    //   })
    
    // })

    //cambio de region
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( _  => {
        this.miFormulario.get('pais')?.reset('')
        this.cargando = true;
        //cada vez que la region cambia se resetea el pais seleccionado
            //el _ significa que no nos interesa lo que viene en la variable tap
            //para desabilitar
        // this.miFormulario.get('frontera')?.disable()
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion(region))
    )
    .subscribe( paises => {
      this.paises = paises;
      this.cargando = false;
      //aqui ya obtenemos la data
    })

    //cuando cambia el pais

    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( () => {
        //para pugar cuando se selecciona otro
        this.fronteras = []
        this.miFormulario.get('frontera')?.reset('')
        this.cargando = true;
        //para activar
        // this.miFormulario.get('frontera')?.enable()
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) ),
      switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders!))
    )
    //para seleccionar las fronteras
    // .subscribe( pais => {
      .subscribe( paises => {
      // console.log(pais)
      // console.log(paises)
      this.fronteras = paises
      // this.fronteras = pais?.borders || [];
    //aqui indicamos que si no existe entonces regresa un arrgelo vacio
      this.cargando = false
    })





  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
