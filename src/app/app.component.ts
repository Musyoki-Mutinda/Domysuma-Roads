import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';
import * as AOS from 'aos';
import { SmoothScrollService } from './core/services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'domysuma';

  constructor(private smoothScroll: SmoothScrollService) {}

  ngOnInit(): void {
    // Initialize smooth scroll
    this.smoothScroll.init();
    
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  }

  ngOnDestroy(): void {
    this.smoothScroll.destroy();
  }
}