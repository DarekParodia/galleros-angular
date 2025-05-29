import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery-cell',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gallery-cell.html',
  styleUrl: './gallery-cell.scss'
})
export class GalleryCell {
  @Input() id!: number;
  @Input() title!: string;
  @Input() author!: string;
  @Input() imageUrl!: string;
}
