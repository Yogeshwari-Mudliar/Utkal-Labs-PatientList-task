import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';

interface Center {
  id: string;
  name: string;
  location?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-centers',
  standalone: true,
  imports: [TableModule, NgClass],
  templateUrl: './centers.component.html',
  styleUrl: './centers.component.css'
})

export class CentersComponent {
centers: Center[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCenters();
  }

  loadCenters(): void {
    const data = localStorage.getItem('centers');
    this.centers = data ? JSON.parse(data) : [];
  }

  addCenter(): void {
    const newCenter: Center = {
      id: 'CTR-' + Date.now(),
      name: 'New Center',
      location: '',
      isActive: true
    };

    this.centers.push(newCenter);
    this.persist();
  }

  editCenter(center: Center): void {
    center.name = center.name + ' (Edited)';
    this.persist();
  }

  deactivateCenter(center: Center): void {
    center.isActive = false;
    this.persist();
  }

  deleteCenter(center: Center): void {
    this.centers = this.centers.filter(c => c.id !== center.id);
    this.persist();
  }

  openCenter(center: Center): void {
    this.router.navigate(['/centers', center.id, 'departments']);
  }

  private persist(): void {
    localStorage.setItem('centers', JSON.stringify(this.centers));
  }

}
