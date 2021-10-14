import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  showSuccessMessage(message: string, title: string) {
    this.toastr.success(message, title);
  }

  showErrorMessage(message: string, title: string) {
    this.toastr.error(message, title);
  }
}
