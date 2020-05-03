import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router';
import { MiHttpService } from '../../servicios/mi-http/mi-http.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-ta-te-ti',
  templateUrl: './ta-te-ti.component.html',
  styleUrls: ['./ta-te-ti.component.scss']
})
export class TaTeTiComponent implements OnInit {

  usuariosGeneral;
  usuarioLogueado : string;
  usuariosTateti : any[];
  contGanados : number = 0;
  contPerdidos : number = 0;
  comenzado : boolean = false;
  resultado : string = "";
  contJugados = 0;
  celdas : number[][] = [[0,0,0],[0,0,0],[0,0,0]];

  constructor(private navegador : Router, private service : MiHttpService, private db : AngularFirestore) 
  {
    this.service.getTateti().subscribe((datos) => {
      this.usuariosTateti = datos;
      this.usuarioLogueado = localStorage.getItem("usuario");
      this.verificarNuevoTateti();
    });

    this.service.getUsuarios().subscribe((datos) => {
      this.usuariosGeneral = datos;
    })
  }

  ngOnInit(): void {
  }

  seleccionarMaquina()
  {
    let i
    let x
    do{
      i = Math.floor(Math.random() * (3-0) + 0);
      x = Math.floor(Math.random() * (3-0) + 0);
    }while(!this.validar(i,x,'o'))
  }

  seleccionarJugador(fila : number, columna : number, jug : string)
  {
    this.comenzado = true;
    if(this.validar(fila,columna,jug)){

        if(this.contJugados < 8 && this.resultado == "")
        {
          this.esperarMaquina();
        }
        else if(this.contJugados == 9 && this.resultado == "")
        {
          this.resultado = "¡EMPATE!";
          this.mostrarMensaje("¡EMPATE!");
        }
    }
    
  }

  esperarMaquina()
  {
    $("#containerTateti").addClass("disabled");
    setTimeout(() => {
      this.seleccionarMaquina();
      $("#containerTateti").removeClass("disabled");
    },1000);
  }

  validar(fila, columna, jug) : boolean
  {
    let retorno = false;
 
    if(this.celdas[fila][columna] == 0)
    {
      retorno = true;
      if(jug == 'x')
      {
        $(`#cell${fila}${columna}`).attr("src", `../../../assets/imagenes/${jug}.png`);
        this.celdas[fila][columna] = 1;
      }
      else{
        $(`#cell${fila}${columna}`).attr("src", `../../../assets/imagenes/${jug}.png`);
        this.celdas[fila][columna] = 2;
      }

      this.validarVictoria();
      this.contJugados++;

    }

    return retorno;
  }

  validarVictoria()
  {
    let retorno = "";

    if(this.celdas[0][0] == 1 && this.celdas[0][1] == 1 && this.celdas[0][2] == 1){
      retorno = "¡GANASTE!";
    }
    else if(this.celdas[1][0] == 1 && this.celdas[1][1] == 1 && this.celdas[1][2] == 1){
      retorno = "¡GANASTE!";
    }
    else if(this.celdas[2][0] == 1 && this.celdas[2][1] == 1 && this.celdas[2][2] == 1){
      retorno = "¡GANASTE!";
    }
    else if(this.celdas[0][0] == 1 && this.celdas[1][0] == 1 && this.celdas[2][0] == 1){
      retorno = "¡GANASTE!";
    }
    else if(this.celdas[0][1] == 1 && this.celdas[1][1] == 1 && this.celdas[2][1] == 1){
      retorno = "¡GANASTE!";
    }
    else if(this.celdas[0][2] == 1 && this.celdas[1][2] == 1 && this.celdas[2][2] == 1){
      retorno = "¡GANASTE!";
    }
    else if(this.celdas[0][0] == 1 && this.celdas[1][1] == 1 && this.celdas[2][2] == 1){
      retorno = "¡GANASTE!";
    }
    else if(this.celdas[0][2] == 1 && this.celdas[1][1] == 1 && this.celdas[2][0] == 1){
      retorno = "¡GANASTE!";
    } //JUGADOR
    else if(this.celdas[0][0] == 2 && this.celdas[0][1] == 2 && this.celdas[0][2] == 2){
      retorno = "¡PERDISTE!";
    }
    else if(this.celdas[1][0] == 2 && this.celdas[1][1] == 2 && this.celdas[1][2] == 2){
      retorno = "¡PERDISTE!";
    }
    else if(this.celdas[2][0] == 2 && this.celdas[2][1] == 2 && this.celdas[2][2] == 2){
      retorno = "¡PERDISTE!";
    }
    else if(this.celdas[0][0] == 2 && this.celdas[1][0] == 2 && this.celdas[2][0] == 2){
      retorno = "¡PERDISTE!";
    }
    else if(this.celdas[0][1] == 2 && this.celdas[1][1] == 2 && this.celdas[2][1] == 2){
      retorno = "¡PERDISTE!";
    }
    else if(this.celdas[0][2] == 2 && this.celdas[1][2] == 2 && this.celdas[2][2] == 2){
      retorno = "¡PERDISTE!";
    }
    else if(this.celdas[0][0] == 2 && this.celdas[1][1] == 2 && this.celdas[2][2] == 2){
      retorno = "¡PERDISTE!";
    }
    else if(this.celdas[0][2] == 2 && this.celdas[1][1] == 2 && this.celdas[2][0] == 2){
      retorno = "¡PERDISTE!";
    }//MAQUINA
    
    if(retorno != "")
    {
      this.resultado = retorno;
      this.mostrarMensaje(retorno);
    }
  }

  mostrarMensaje(mensaje : string)
  {
    $("#mensajeTateti").text(mensaje)
    $("#gameContainer").attr("hidden", true);
    $("#containerMensajeTateti").removeAttr("hidden");
    this.cambiarResultadoBD();
    this.cambiarResultadoUsuario();
  }
  
  reiniciar()
  {
    this.contJugados =0;
    this.resultado = "";
    this.comenzado = false;

    for(let i = 0; i < 3 ; i++)
    {
      for(let x = 0; x < 3 ; x++)
      {
         this.celdas[i][x] = 0;
         $(`#cell${i}${x}`).attr("src", "");
      }
    }

    $("#gameContainer").removeAttr("hidden");
    $("#containerMensajeTateti").attr("hidden", true);
  }

  cambiarResultadoBD()
  {
    let flag = false; 

    for(let usu of this.usuariosTateti)
    {
      if(usu.usuario == this.usuarioLogueado)
      {
        this.modificarExistente(usu);
        break;
      }
    }
  }

  verificarNuevoTateti()
  {
    let flag = false;

    for(let usu of this.usuariosTateti)
    {
      if(usu.usuario == this.usuarioLogueado)
      {
        flag = true;
        break;
      }
    }

    if(!flag)
    {
      this.db.collection("tateti").doc(this.usuarioLogueado).set(
        {
          gano : 0,
          perdio : 0,
          usuario : this.usuarioLogueado,
          juego : "tateti"
        });
    }
  }

  cambiarResultadoUsuario()
  {
    let flag = false; 

    for(let usu of this.usuariosGeneral)
    {
      if(usu.nombre == this.usuarioLogueado)
      {
        this.modificarUsuarioPuntaje(usu)
        break;
      }
    }
  }

  modificarExistente(usuario)
  {
    if(this.resultado == "¡GANASTE!")
    {
      usuario.gano++;
      this.db.collection("tateti").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "tateti"
      })
    }
    else if(this.resultado == "¡PERDISTE!")
    {
      usuario.perdio++;
      this.db.collection("tateti").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "tateti"
      })
    }
  } 

  modificarUsuarioPuntaje(usuario)
  { 
    if(this.resultado == "¡GANASTE!")
    {
      usuario.gano++;
      this.db.collection("usuarios").doc(this.usuarioLogueado).update({
        nombre : this.usuarioLogueado,
        gano : usuario.gano,
        perdio : usuario.perdio,
      });
    }
    else if(this.resultado == "¡PERDISTE!")
    {
      usuario.perdio++;
      this.db.collection("usuarios").doc(this.usuarioLogueado).update({
        nombre : this.usuarioLogueado,
        gano : usuario.gano,
        perdio : usuario.perdio,
      });
    }
  }
}