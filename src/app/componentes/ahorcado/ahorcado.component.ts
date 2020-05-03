import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { MiHttpService } from '../../servicios/mi-http/mi-http.service'
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit {

  usuariosGeneral;
  usuariosAhorcado;
  usuarioLogueado;
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

  constructor(private service : MiHttpService, private db : AngularFirestore) 
  {
    this.service.getAhorcado().subscribe((datos) => {
      this.usuariosAhorcado = datos;
      this.usuarioLogueado = localStorage.getItem("usuario");
      this.verificarNuevoAhorcado();
    });

    this.service.getUsuarios().subscribe((datos) => {
      this.usuariosGeneral = datos;
    })
  }

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
    this.cambiarResultadoBD();
    this.cambiarResultadoUsuario();
  }

  verificarNuevoAhorcado()
  {
    let flag = false;

    for(let usu of this.usuariosAhorcado)
    {
      if(usu.usuario == this.usuarioLogueado)
      {
        flag = true;
        break;
      }
    }

    if(!flag)
    {
      this.db.collection("ahorcado").doc(this.usuarioLogueado).set(
        {
          gano : 0,
          perdio : 0,
          usuario : this.usuarioLogueado,
          juego : "ahorcado"
        });
    }
  }

  cambiarResultadoBD()
  {
    let flag = false; 

    for(let usu of this.usuariosAhorcado)
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
      this.db.collection("ahorcado").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "ahorcado"
      })
    }
    else if(this.gano == false)
    {
      usuario.perdio++;
      this.db.collection("ahorcado").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "ahorcado"
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
