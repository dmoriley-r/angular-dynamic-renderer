import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ComponentData,
  ComponentTemplate,
} from 'src/app/dynamic-renderer/feature/render-template.types';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerComponent implements OnInit {
  children: ComponentTemplate[];

  constructor() {}

  ngOnInit() {}
}

export const componentDataResolver = (data: ComponentData) => {
  return {
    children: data.children,
  };
};
