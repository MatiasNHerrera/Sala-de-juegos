import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as $ from 'jquery';
import { createElementCssSelector } from '@angular/compiler';
//para poder hacer las validaciones
//import { Validators, FormBuilder, FormControl, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  claveRepetida : string;
  correo : string = "";
  clave : string = "";
 /* constructor( private miConstructor:FormBuilder) { }
  email=new FormControl('',[Validators.email]);
  formRegistro:FormGroup=this.miConstructor.group({
    usuario:this.email
  });*/
  constructor( private authFire : AngularFireAuth, private navegador : Router) { }

  ngOnInit() {
  }

  registrar()
  {
    if(this.validarCorreo())
    {
      if(this.validarClave())
      {
        this.authFire.auth.createUserWithEmailAndPassword(this.correo,this.clave);
        this.navegador.navigate(["Login"])

      }
    }
  }
  
  validarClave() : boolean
  {
    let retorno = false

    if(this.clave.length >= 6 && this.clave == this.claveRepetida)
    {
        retorno = true;
    }
    else if(this.clave == "")
    {
      this.textoMostrar("Contraseña Requerida")
      this.fadeIn();
    }
    else if(this.clave.length < 6)
    {
      this.textoMostrar("La clave debe ser mayor a 6 digitos");
      this.fadeIn();
    }
    else
    {
      this.textoMostrar("Las claves no coinciden, revise");
      this.fadeIn();
    }

    return retorno;
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
