import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ComponentData } from 'src/app/dynamic-renderer/feature/render-template.types';

@Component({
  selector: 'app-img-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img class="img-fluid" src="{{ src }}" alt="{{ alt }}" />
    <span *ngIf="caption" class="caption text-muted">{{ caption }}</span>
  `,
})
export class ImgContainerComponent implements OnInit {
  src: string;
  alt: string;
  caption?: string;
  constructor() {}

  ngOnInit() {}
}

export const componentDataResolver = (data: ComponentData) => {
  return {
    src: data.src,
    alt: data.alt,
    caption: data.caption,
  };
};
