import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxStorytellingComponent } from './parallax-storytelling.component';

describe('ParallaxStorytellingComponent', () => {
  let component: ParallaxStorytellingComponent;
  let fixture: ComponentFixture<ParallaxStorytellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParallaxStorytellingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParallaxStorytellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
