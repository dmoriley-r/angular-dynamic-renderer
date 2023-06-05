import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ComponentData } from 'src/app/dynamic-renderer/feature/render-template.types';

@Component({
  selector: 'app-text-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <p *ngFor="let item of text">{{ item }}</p> `,
})
export class TextContainerComponent implements OnInit {
  text: string[];
  constructor() {}

  ngOnInit() {}
}

export const componentDataResolver = (data: ComponentData) => {
  return {
    text: data.text,
  };
};
