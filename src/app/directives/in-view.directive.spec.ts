import { InViewDirective } from '../core/directives/in-view.directive';
import { ElementRef } from '@angular/core';

describe('InViewDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {} as ElementRef;
    const directive = new InViewDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
