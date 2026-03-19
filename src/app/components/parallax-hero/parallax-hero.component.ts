import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface LetterItem {
  char: string;
  visible: boolean;
  color: 'orange' | 'white' | 'yellow';
}

@Component({
  selector: 'app-parallax-hero',
  templateUrl: './parallax-hero.component.html',
  styleUrls: ['./parallax-hero.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ParallaxHeroComponent implements OnInit {
  scrollY = 0;

  // Row 1: "DOMYSUMA BUILDING & ROAD WORKS"
  // orange: everything except "&" which is white
  row1Letters: LetterItem[] = [];
  private row1Text = 'DOMYSUMA BUILDING & ROAD WORKS';

  // Row 2: "CONSTRUCTION COMPANY LTD" — all yellow
  row2Letters: LetterItem[] = [];
  private row2Text = 'CONSTRUCTION COMPANY LTD';

  // Truck state
  isTruckActive = false;
  isTipping = false;

  // Roller state
  isRollerActive = false;

  // Done
  animationComplete = false;

  ngOnInit(): void {
    this.buildLetterArrays();
    setTimeout(() => this.startTipperTruck(), 600);
  }

  private buildLetterArrays(): void {
    const ampIndex = this.row1Text.indexOf('&');
    this.row1Letters = this.row1Text.split('').map((char, i) => ({
      char,
      visible: false,
      color: i === ampIndex ? 'white' : 'orange'
    }));

    this.row2Letters = this.row2Text.split('').map(char => ({
      char,
      visible: false,
      color: 'yellow' as const
    }));
  }

  // ─── PHASE 1: Tipper Truck drives right, letters appear behind it ──────────

  private startTipperTruck(): void {
    this.isTruckActive = true;
    let charIndex = 0;

    const pourInterval = setInterval(() => {
      if (charIndex < this.row1Letters.length) {
        // Reveal the letter — it now sits to the left of the truck in DOM order
        this.row1Letters[charIndex].visible = true;

        // Briefly tip the bed
        this.isTipping = true;
        setTimeout(() => { this.isTipping = false; }, 280);

        charIndex++;
      } else {
        clearInterval(pourInterval);

        // Brief pause then hide truck and start roller
        setTimeout(() => {
          this.isTruckActive = false;
          setTimeout(() => this.startRoadRoller(), 400);
        }, 300);
      }
    }, 160);
  }

  // ─── PHASE 2: Road Roller rolls left, letters appear behind it ─────────────

  private startRoadRoller(): void {
    this.isRollerActive = true;

    // Row 2 letters need to appear right-to-left (roller moves left, trails to its right).
    // We reveal them from the LAST index down to 0 so the rightmost letter appears first.
    const total = this.row2Letters.length;
    let step = 0; // how many letters have been revealed

    const stampInterval = setInterval(() => {
      if (step < total) {
        // Reveal from the right end backwards so the roller "pushes" left
        // and leaves a growing trail to its right
        const targetIndex = total - 1 - step;
        this.row2Letters[targetIndex].visible = true;
        step++;
      } else {
        clearInterval(stampInterval);

        setTimeout(() => {
          this.isRollerActive = false;
          this.animationComplete = true;
        }, 300);
      }
    }, 160);
  }

  // ─── Scroll ────────────────────────────────────────────────────────────────

  @HostListener('window:scroll', ['$event'])
  onScroll(_event: Event): void {
    this.scrollY = window.scrollY;
  }
}