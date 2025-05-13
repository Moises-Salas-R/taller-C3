import { Component, OnInit } from '@angular/core';
import { FirebaseConfigService } from '../../core/services/firebase-config.service';
import { Observable } from 'rxjs';
import { Register } from '../../models/register.model';
import { Router } from '@angular/router';

@Component({ selector: 'app-list', templateUrl: './list.page.html',standalone:false })
export class ListPage  {
 registros$!: Observable<Register[]>;

  constructor(
    private firebaseService: FirebaseConfigService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener los registros desde Firestore
    this.registros$ = this.firebaseService.getRegistros();
  }

  // Navegar a la página de registro 
  goToHome() {
    this.router.navigate(['/register']);
  }
}