import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { JuegoAgilidad } from '../../clases/juego-agilidad'
import {Subscription} from "rxjs";
import { timer } from "rxjs";
import * as $ from 'jquery';

@Component({
  selector: 'app-agilidad-aritmetica',
  templateUrl: './agilidad-aritmetica.component.html',
  styleUrls: ['./agilidad-aritmetica.component.css']
})
export class AgilidadAritmeticaComponent implements OnInit {
   @Output() 

  resultadoIngresado : number;
  numeroUno : number;
  numeroDos : number;
  operador : string;
  operadoradores : string[] = ["-", "+", "%", "*"];
  enviarJuego :EventEmitter<any>= new EventEmitter<any>();
  nuevoJuego : JuegoAgilidad;
  ocultarVerificar: boolean;
  Tiempo: number;
  repetidor:any;

  private subscription: Subscription;

  ngOnInit() {
  }
   constructor() {
     this.juegoParado();
  }

  NuevoJuego() {

      this.generarCalculo();
      this.ocultarVerificar=false;
      this.repetidor = setInterval(()=>{ 
      
      this.Tiempo--;
      console.log("llego", this.Tiempo);
      if(this.Tiempo==0 ) {
        clearInterval(this.repetidor);
        this.verificar();
        this.ocultarVerificar=true;
        this.Tiempo=10;
      }
      }, 900);
  }

  verificar()
  {
    this.ocultarVerificar=false;
    clearInterval(this.repetidor);

    if(this.realizarCalculo())
    {
      this.mostrarMensaje(true);
    }
    else
    {
      this.mostrarMensaje(false)
    }
  }  

  generarCalculo()
  {
    let i =  Math.floor(Math.random() * (this.operadoradores.length - 0) + 0);
    this.operador = this.operadoradores[i];
    this.numeroUno = Math.floor(Math.random() * (100 - 1) + 1);
    this.numeroDos = Math.floor(Math.random() * (100 - 1) + 1);

    $("#numeroUno").val(this.numeroUno);
    $("#numeroDos").val(this.numeroDos);
    $("#operador").val(this.operador);
  } 

  realizarCalculo() : boolean
  {
    let retorno = false
    let resultado;

    switch(this.operador)
    {
      case "%":

        resultado = (this.numeroUno % this.numeroDos);
        if(resultado == this.resultadoIngresado)
        {
          retorno = true;
        }
        break;

      case "*":

        resultado = (this.numeroUno * this.numeroDos);
        if(resultado == this.resultadoIngresado)
        {
          retorno = true;
        }
        break;

      case "+":

        resultado = (this.numeroUno + this.numeroDos);
        if(resultado == this.resultadoIngresado)
        {
          retorno = true;
        }
        break;

      case "-":

        resultado = (this.numeroUno - this.numeroDos);
        if(resultado == this.resultadoIngresado)
        {
          retorno = true;
        }
        break;
  
    }

    return retorno;
  }

  mostrarMensaje(gano : boolean)
  {
    if(gano)
    {
      document.getElementById("mensajeAritmetica").style.background = "rgb(40, 216, 63)"
      $("#mensajeAritmetica").text("¡ADIVINASTE,GENIO!");
    }
    else
    {
      document.getElementById("mensajeAritmetica").style.background = "rgb(204, 40, 40)"
      $("#mensajeAritmetica").text("¡ERROR!, NO SOS TAN INTELIGENTE");
    }

    this.fadeIn();
  }

  fadeIn()
  {
    $("#mensajeAritmetica").fadeIn();
    setTimeout(() => {
      $("#mensajeAritmetica").fadeOut();
      this.reiniciarVariables();
      this.juegoParado();
    },1500);
  }

  reiniciarVariables()
  {
    $("#numeroUno").val("");
    $("#numeroDos").val("");
    $("#operador").val("");
    this.resultadoIngresado = null;
  }

  juegoParado()
  {
    this.ocultarVerificar=true;
    this.Tiempo=10; 
  }

}
