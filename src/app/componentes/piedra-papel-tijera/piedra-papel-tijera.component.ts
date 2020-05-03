import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AngularFirestore } from '@angular/fire/firestore';
import { MiHttpService } from '../../servicios/mi-http/mi-http.service';

@Component({
  selector: 'app-piedra-papel-tijera',
  templateUrl: './piedra-papel-tijera.component.html',
  styleUrls: ['./piedra-papel-tijera.component.css']
})
export class PiedraPapelTijeraComponent implements OnInit {

  usuariosGeneral;
  gano;
  usuariosPiedra;
  usuarioLogueado;
  elejidoJugador : string;
  elejidoMaquina : string;
  opciones : string[] = ["piedra","papel","tijera"];
  contadorJugador = 0;
  contadorMaquina = 0;

  constructor(private db : AngularFirestore, private service : MiHttpService) 
  {
      this.service.getPiedra().subscribe((datos) => {
         this.usuariosPiedra = datos;
         this.usuarioLogueado = localStorage.getItem("usuario");
         this.verificarNuevoPiedra();
      });

      this.service.getUsuarios().subscribe((datos) => {
        this.usuariosGeneral = datos;
      })
  }

  ngOnInit(): void {
  }

  seleccionar(elejido : string)
  {
     this.elejidoJugador = elejido;
     this.generarElejidoMaquina();
     this.generarElejidoPropio();
     this.sumarPuntos();
     this.validarVictoria();

     setTimeout( () => {
       this.reiniciarImagenes();
     },2000);
  }

  generarElejidoMaquina()
  {
     let random = Math.floor(Math.random()* (this.opciones.length - 0) + 0);
     this.elejidoMaquina = this.opciones[random];
     
     if(this.elejidoMaquina == 'piedra')
     {
        $("#papelMaquina").attr("hidden",true);
        $("#tijeraMaquina").attr("hidden",true);
     }
     else if(this.elejidoMaquina == 'papel')
     {
        $("#tijeraMaquina").attr("hidden",true);
        $("#piedraMaquina").attr("hidden",true);
     }
     else
     {
        $("#papelMaquina").attr("hidden",true);
        $("#piedraMaquina").attr("hidden",true);
     }
  }

  generarElejidoPropio()
  {
     if(this.elejidoJugador == 'piedra')
     {
        $("#papel").attr("hidden",true);
        $("#tijera").attr("hidden",true);
     }
     else if(this.elejidoJugador == 'papel')
     {
        $("#tijera").attr("hidden",true);
        $("#piedra").attr("hidden",true);
     }
     else
     {
        $("#papel").attr("hidden",true);
        $("#piedra").attr("hidden",true);
     }
  }

  sumarPuntos()
  {
      if(this.elejidoJugador == "papel" && this.elejidoMaquina == "piedra")
      {
         this.contadorJugador++
         this.cambiarPuntos("#puntosJugador", this.contadorJugador);
      }
      else if(this.elejidoJugador == this.elejidoMaquina)
      {
        console.log("empate")
      }
      else if(this.elejidoJugador == "tijera" && this.elejidoMaquina == "papel")
      {
         this.contadorJugador++
         this.cambiarPuntos("#puntosJugador", this.contadorJugador);
      }
      else if(this.elejidoJugador == "piedra" && this.elejidoMaquina == "tijera")
      {
         this.contadorJugador++
         this.cambiarPuntos("#puntosJugador", this.contadorJugador);
      }
      else
      {
         this.contadorMaquina++
         this.cambiarPuntos("#puntosMaquina", this.contadorMaquina);
      }
  }

  cambiarPuntos(id: string ,punto : number)
  {
     $(id).text("Puntos: "+punto);
  }

  validarVictoria()
  {
      if(this.contadorJugador == 3)
      {   
          this.gano = true;
          $("#mensajeP").text('¡FELICITACIONES, SOS MEJOR QUE LA MAQUINA!')
          this.mostrarMensaje()
      }
      else if(this.contadorMaquina == 3)
      {
          this.gano = false;
          $("#mensajeP").text('¡PERDISTE, LA MAQUINA ES MEJOR QUE VOS!')
          this.mostrarMensaje();
      }

  }

  reiniciarImagenes()
  {
      $("#papelMaquina").removeAttr("hidden");
      $("#piedraMaquina").removeAttr("hidden");
      $("#tijeraMaquina").removeAttr("hidden");
      $("#papel").removeAttr("hidden");
      $("#piedra").removeAttr("hidden");
      $("#tijera").removeAttr("hidden");
  }

  mostrarMensaje()
  {
    $("#containerGame").attr("hidden", true);
    $("#containerMensaje").removeAttr("hidden");
    this.cambiarResultadoBD();
    this.cambiarResultadoUsuario();
  }

  reiniciarJuego()
  {
      this.contadorJugador = 0;
      this.contadorMaquina = 0;
      this.cambiarPuntos("#puntosJugador", 0);
      this.cambiarPuntos("#puntosMaquina", 0);

      setTimeout( () => {

        $("#containerMensaje").attr("hidden", true);
        $("#containerGame").removeAttr("hidden");

      },1000);
  }

  verificarNuevoPiedra()
  {
    let flag = false;

    for(let usu of this.usuariosPiedra)
    {
      if(usu.usuario == this.usuarioLogueado)
      {
        flag = true;
        break;
      }
    }

    if(!flag)
    {
      this.db.collection("piedra-papel-tijera").doc(this.usuarioLogueado).set(
        {
          gano : 0,
          perdio : 0,
          usuario : this.usuarioLogueado,
          juego : "piedra-papel-tijera"
        });
    }
  }

  cambiarResultadoBD()
  {
    let flag = false; 

    for(let usu of this.usuariosPiedra)
    {
      if(usu.usuario == this.usuarioLogueado)
      {
        this.modificarExistente(usu);
        break;
      }
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
    if(this.gano == true)
    {
      usuario.gano++;
      this.db.collection("piedra-papel-tijera").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "piedra-papel-tijera"
      })
    }
    else if(this.gano == false)
    {
      usuario.perdio++;
      this.db.collection("piedra-papel-tijera").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "piedra-papel-tijera"
      })
    }
  } 

  modificarUsuarioPuntaje(usuario)
  { 
    if(this.gano == true)
    {
      usuario.gano++;
      this.db.collection("usuarios").doc(this.usuarioLogueado).update({
        nombre : this.usuarioLogueado,
        gano : usuario.gano,
        perdio : usuario.perdio,
      });
    }
    else
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
