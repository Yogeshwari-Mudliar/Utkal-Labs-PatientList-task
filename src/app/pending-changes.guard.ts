import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class pendingChangesGuard
  implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate();
  }

}