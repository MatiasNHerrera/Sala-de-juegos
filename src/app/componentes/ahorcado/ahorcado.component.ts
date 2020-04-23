import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit {

  letras = ["A", "B", "C", "D", "E", "F", "G", "H", 
  "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", 
  "S", "T", "U", "V", "W", "X", "Y", "Z"];

  palabras = ["zapato", "teclado", "lechuga", "otorrinolaringolo","poesia", "militar", "programacion"
             , "monarca", "nefasto", "particula", "molecula", "rapero", "opera", "monitor"
             , "localidad", "mentalmente", "titulo", "jirafa"];

  gano : boolean;
  palabraParaAdivinar : string;
  palabraAdivinadaHastaAhora: string = "";
  letrasErradas : string = "";
  numeroFallos: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.generarPalabra();
  }

  generarPalabra()
  {
    let random = Math.floor(Math.random() * (this.palabras.length - 0) + 0); 
    this.palabraParaAdivinar = this.palabras[random];
    for(let i = 0; i < this.palabraParaAdivinar.length; i++)
    {
      this.palabraAdivinadaHastaAhora += "_";
    }
  }

  hastaElMomento( letra : string)
  {
      if(this.acertoLetra(letra))
      {
        if(this.corroborarVictoria())
        {
          this.mostrarMensaje()
        }
      }
      else if(this.numeroFallos == 6)
      {
         this.mostrarMensaje();
      }
  }

  acertoLetra(letra : string) : boolean
  {
    let acerto = false;

    for(let i = 0; i < this.palabraParaAdivinar.length; i++)
    {
      if(this.palabraParaAdivinar[i] == letra.toLocaleLowerCase())
      {
          this.palabraAdivinadaHastaAhora = this.palabraAdivinadaHastaAhora.substr(0,i) + letra + 
          this.palabraAdivinadaHastaAhora.substr(i + 1);
          acerto = true;
      }
    }

    if(!acerto)
    {
        this.letrasErradas += letra;
        this.numeroFallos++;
        $("#errores").text(this.letrasErradas);
    }

      return acerto;
  }

  corroborarVictoria() : boolean
  {
    this.gano = true;

    for(let i = 0 ; i < this.palabraParaAdivinar.length; i++)
    {
      if(this.palabraAdivinadaHastaAhora[i] == "_")
      {
        this.gano = false;
      }
    }

    return this.gano;
  }

  recargar()
  {
    $("#containerMensaje").attr("hidden", true);
    $("#containerGame").removeAttr("hidden");
    this.letrasErradas = "";
    this.numeroFallos = 0;
    this.palabraAdivinadaHastaAhora = "";
    this.palabraParaAdivinar = "";
    $("#errores").text("");
    this.generarPalabra();
  }

  mostrarMensaje()
  {
    $("#containerGame").attr("hidden", true);
    $("#containerMensaje").removeAttr("hidden");
  }

}
