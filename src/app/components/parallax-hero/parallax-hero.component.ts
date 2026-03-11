import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

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
  
  // Typing animation with crane
  displayedLetters: string[] = [];
  private fullText = 'DOMYSUMA BUILDING & ROAD WORKS \nCONSTRUCTION COMPANY LTD';
  private typingSpeed = 150;
  cranePosition = 0;
  isTyping = false;
  
  // Define positions for color styling
  whiteStartIndex = 'DOMYSUMA BUILDING '.length;
  whiteEndIndex = this.whiteStartIndex + '&'.length;
  yellowStartIndex = 'DOMYSUMA BUILDING & ROAD WORKS \n'.length;
  yellowEndIndex = this.yellowStartIndex + 'CONSTRUCTION COMPANY LTD'.length;
  
  ngOnInit() {
    setTimeout(() => {
      this.startCraneTyping();
    }, 500);
  }
  
  startCraneTyping(): void {
    this.isTyping = true;
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < this.fullText.length) {
        const char = this.fullText.charAt(charIndex);
        this.displayedLetters.push(char);
        
        // Calculate crane position (percentage)
        this.cranePosition = ((charIndex + 1) / this.fullText.length) * 100;
        
        charIndex++;
      } else {
        clearInterval(typeInterval);
        this.isTyping = false;
      }
    }, this.typingSpeed);
  }
  
  
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    this.scrollY = window.scrollY;
  }
}
