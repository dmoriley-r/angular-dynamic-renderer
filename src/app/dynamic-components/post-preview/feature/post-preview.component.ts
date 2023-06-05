import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ComponentData } from 'src/app/dynamic-renderer/feature/render-template.types';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPreviewComponent implements OnInit {
  title: string;
  subtitle: string;
  author: string;
  dateAsString: string;
  showDivider: boolean;

  constructor() {}

  ngOnInit() {}
}

export const componentDataResolver = (data: ComponentData) => {
  return {
    title: data.title,
    subtitle: data.subtitle,
    author: data.author,
    dateAsString: data.dateAsString,
    showDivider: data.showDivider || true,
  };
};
