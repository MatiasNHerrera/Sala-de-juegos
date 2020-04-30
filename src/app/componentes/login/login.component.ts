import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as $ from 'jquery';
import {Subscription} from "rxjs";
import { timer } from "rxjs";
import { AngularFireAuth } from '@angular/fire/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private subscription: Subscription;
  correo : string = '';
  clave : string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authFire : AngularFireAuth) {

  }

  ngOnInit() {
  }

  loguearse()
  {
     if(this.validarCorreo())
     {
        this.authFire.auth.signInWithEmailAndPassword(this.correo,this.clave).then(() => {
          this.router.navigate(["Principal"])
        }).catch( () =>{
          this.textoMostrar("No se encuentra registrado en la base");
          this.fadeIn();
        })
     }
  }

  validarCorreo() : boolean
  {
    let retorno = false;
    let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if(regex.test(this.correo))
    {
      retorno = true;
    }
    else if(this.correo == "")
    {
      this.textoMostrar("Correo Requerido");
      this.fadeIn();
    }
    else if(this.clave == "")
    {
      this.textoMostrar("Clave Requerida");
      this.fadeIn();
    }
    else
    {
      this.textoMostrar("El campo debe ser de tipo correo");
      this.fadeIn();
    }

    return retorno;
  }

  fadeIn()
  {
    $("#mensaje").fadeIn();
    setTimeout( () => {
      $("#mensaje").fadeOut();
    },2000);
  }

  textoMostrar(mensaje : string)
  {
    $("#mensaje").text(mensaje);
  }

}
