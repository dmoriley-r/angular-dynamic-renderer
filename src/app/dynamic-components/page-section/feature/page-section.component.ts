import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ComponentData,
  ComponentTemplate,
} from 'src/app/dynamic-renderer/feature/render-template.types';

@Component({
  selector: 'app-page-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'd-block col-lg-8 col-md-10 mx-auto',
  },
  template: `
    <h2 *ngIf="sectionHeading" class="section-heading">{{ sectionHeading }}</h2>
    <app-render-template [components]="children" />
  `,
})
export class PageSectionComponent implements OnInit {
  sectionHeading: string;
  children: ComponentTemplate[];

  constructor() {}

  ngOnInit() {}
}

export const componentDataResolver = (data: ComponentData) => {
  return {
    sectionHeading: data.sectionHeading,
    children: data.children,
  };
};
