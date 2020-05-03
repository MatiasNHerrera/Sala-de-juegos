import { Component, OnInit } from '@angular/core';
import { MiHttpService } from '../../servicios/mi-http/mi-http.service';
@Component({
  selector: 'app-jugadores-listado',
  templateUrl: './jugadores-listado.component.html',
  styleUrls: ['./jugadores-listado.component.css']
})
export class JugadoresListadoComponent implements OnInit {

  ganadores: boolean = false;
  perdedores : boolean;
  listadoGeneral:any[];
  
    constructor(private service : MiHttpService) {
      this.service.getUsuarios().subscribe((datos)=>{
        this.listadoGeneral = datos;
      })
      
    }
    


  ngOnInit() {
  }


  TraerTodos(){
    this.ganadores = false;
    this.perdedores = false;
  }
  TraerGanadores(){
    this.ganadores = false;
    this.perdedores = true;
  }
  TraerPerdedores(){
    this.perdedores = false;
    this.ganadores = true;
  }

}
