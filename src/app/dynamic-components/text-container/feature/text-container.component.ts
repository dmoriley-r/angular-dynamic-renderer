import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ComponentData,
  DynamicComponent,
} from 'src/app/dynamic-renderer/feature/render-template.types';

@Component({
  selector: 'app-text-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
  template: ` <p *ngFor="let item of text">{{ item }}</p> `,
})
export class TextContainerComponent implements DynamicComponent {
  text: string[];
  constructor() {}

  componentDataResolver(data: ComponentData) {
    return {
      text: data.text,
    };
  }
}
