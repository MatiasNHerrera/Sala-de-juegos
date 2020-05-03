
import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { JuegoAdivina } from '../../clases/juego-adivina'
import { MiHttpService } from '../../servicios/mi-http/mi-http.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-adivina-el-numero',
  templateUrl: './adivina-el-numero.component.html',
  styleUrls: ['./adivina-el-numero.component.css']
})
export class AdivinaElNumeroComponent implements OnInit {
 @Output() enviarJuego: EventEmitter<any>= new EventEmitter<any>();

  gano : boolean
  usuariosAdivina;
  usuarioLogueado;
  usuariosGeneral;
  nuevoJuego: JuegoAdivina;
  Mensajes:string;
  contador:number;
  ocultarVerificar:boolean;
 
  constructor(private service : MiHttpService, private db : AngularFirestore) {
    this.service.getAdivina().subscribe((datos) => {
      this.usuariosAdivina = datos;
      this.usuarioLogueado = localStorage.getItem("usuario");
      this.verificarNuevoAdivina();
    });

    this.service.getUsuarios().subscribe((datos) => {
      this.usuariosGeneral = datos;
    })

    this.nuevoJuego = new JuegoAdivina();
    console.info("numero Secreto:",this.nuevoJuego.numeroSecreto);  
    this.ocultarVerificar=false;
  }

  ngOnInit() {
  }

  generarnumero() {
    this.nuevoJuego.generarnumero();
    this.contador=0;
  }
  verificar()
  {
    this.contador++;
    this.ocultarVerificar=true;
    console.info("numero Secreto:",this.nuevoJuego.gano);  
    if (this.nuevoJuego.verificar()){
      
      this.enviarJuego.emit(this.nuevoJuego);
      this.MostarMensaje("Sos un Genio!!!",true);
      this.nuevoJuego.numeroSecreto=0;

    }else{

      let mensaje:string;
      switch (this.contador) {
        case 1:
          mensaje="No, intento fallido, animo";
          break;
          case 2:
          mensaje="No,Te estaras Acercando???";
          break;
          case 3:
          mensaje="No es, Yo crei que la tercera era la vencida.";
          break;
          case 4:
          mensaje="No era el  "+this.nuevoJuego.numeroIngresado;
          break;
          case 5:
          mensaje=" intentos y nada.";
          break;
          case 6:
          mensaje="Afortunado en el amor";
          break;
      
        default:
            mensaje="Ya le erraste "+ this.contador+" veces";
          break;
      }
      this.MostarMensaje("#"+this.contador+" "+mensaje+" ayuda :"+this.nuevoJuego.retornarAyuda());
     

    }
    console.info("numero Secreto:",this.nuevoJuego.gano);  
  }  

  MostarMensaje(mensaje:string="este es el mensaje",ganador:boolean=false) {
    this.Mensajes=mensaje;    
    var x = document.getElementById("snackbar");
    if(ganador)
      {
        this.gano = true;
        x.className = "show Ganador";
      }else{
        this.gano = false;
        x.className = "show Perdedor";
      }
    var modelo=this;
    setTimeout(function(){ 
      x.className = x.className.replace("show", "");
      modelo.ocultarVerificar=false;
     }, 3000);
    console.info("objeto",x);
    this.cambiarResultadoBD();
    this.cambiarResultadoUsuario();
  
   }  
   
   verificarNuevoAdivina()
  {
    let flag = false;

    for(let usu of this.usuariosAdivina)
    {
      if(usu.usuario == this.usuarioLogueado)
      {
        flag = true;
        break;
      }
    }

    if(!flag)
    {
      this.db.collection("adivina").doc(this.usuarioLogueado).set(
        {
          gano : 0,
          perdio : 0,
          usuario : this.usuarioLogueado,
          juego : "adivina numero"
        });
    }
  }

  cambiarResultadoBD()
  {
    let flag = false; 

    for(let usu of this.usuariosAdivina)
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
      this.db.collection("adivina").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "adivina numero"
      })

    }
    else
    {
      usuario.perdio++;
      this.db.collection("adivina").doc(this.usuarioLogueado).update({
        gano : usuario.gano,
        perdio : usuario.perdio,
        usuario : usuario.usuario,
        juego : "adivina numero"
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
