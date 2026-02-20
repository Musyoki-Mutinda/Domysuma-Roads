import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';
import * as AOS from 'aos';

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
export class AppComponent implements OnInit {
  title = 'domysuma';

  ngOnInit(): void {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
      duration: 1000,        // Animation duration in milliseconds
      easing: 'ease-out',    // Easing function
      once: true,            // Whether animation should happen only once
      mirror: false,         // Whether elements should animate out while scrolling past them
      offset: 100,           // Offset (in px) from the original trigger point
      delay: 0,              // Delay (in ms) before animation starts
      anchorPlacement: 'top-bottom' // Defines which position of the element should trigger animation
    });

    // Refresh AOS on dynamic content changes (optional)
    // Uncomment if you have dynamic content loading
    // setTimeout(() => {
    //   AOS.refresh();
    // }, 500);
  }
}