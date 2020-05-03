import { Component, OnInit , Input, EventEmitter} from '@angular/core';
import { MiHttpService } from '../../servicios/mi-http/mi-http.service';

@Component({
  selector: 'app-listado-de-resultados',
  templateUrl: './listado-de-resultados.component.html',
  styleUrls: ['./listado-de-resultados.component.css']
})
export class ListadoDeResultadosComponent implements OnInit {
 @Input()

  listadoGeneral : any[] = [];
  listadoTateti;
  listadoAnagrama;
  listadoAritmetica;
  listadoPapel;
  listadoAhorcado;
  listadoAdivina;

  constructor(private service : MiHttpService) {
    this.getGeneral();
   }

  ngOnInit() {

  }

  getTateti()
  {
    this.service.getTateti().subscribe((datos) => {
      for(let item of datos)
      {
        this.listadoGeneral.push(item);
      }
    })
  }

  getAnagrama()
  {
    this.service.getAnagrama().subscribe((datos) => {
      for(let item of datos)
      {
        this.listadoGeneral.push(item);
      }
    })
  }

  getAritmetica()
  {
    this.service.getAgilidad().subscribe((datos) => {
      for(let item of datos)
      {
        this.listadoGeneral.push(item);
      }
    })
  }
  
  getPapel()
  {
    this.service.getPiedra().subscribe((datos) => {
      for(let item of datos)
      {
        this.listadoGeneral.push(item);
      }
    })
  }

  getAhorcado()
  {
    this.service.getAhorcado().subscribe((datos) => {
      for(let item of datos)
      {
        this.listadoGeneral.push(item);
      }
    })
  }

  getAdivina()
  {
    this.service.getAdivina().subscribe((datos) => {
      for(let item of datos)
      {
        this.listadoGeneral.push(item);
      }
    })
  }

  getGeneral()
  {
    this.getTateti();
    this.getAdivina();
    this.getAhorcado();
    this.getAnagrama();
    this.getAritmetica();
    this.getPapel();
  }

}
