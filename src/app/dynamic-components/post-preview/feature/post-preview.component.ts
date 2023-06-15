import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ComponentData,
  DynamicComponent,
} from 'src/app/dynamic-renderer/feature/render-template.types';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PostPreviewComponent implements DynamicComponent {
  title: string;
  subtitle: string;
  author: string;
  dateAsString: string;
  showDivider: boolean;
  shortName: string;

  constructor() {}

  componentDataResolver = (data: ComponentData) => {
    return {
      title: data.title,
      subtitle: data.subtitle,
      author: data.author,
      dateAsString: data.dateAsString,
      showDivider: data.showDivider || true,
      shortName: data.shortName,
    };
  };
}
