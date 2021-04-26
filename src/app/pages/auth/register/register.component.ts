import { Component, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  errorMessage = '';
  hide = true;
  hideConfirm = true;
  change = 'lg';
  watcher: Subscription;
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialogService: DialogService,
    mediaObserver: MediaObserver,
  ) {
    this.change = 'lg';
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.change = 'xs';
      } else if (change.mqAlias === 'sm') {
        this.change = 'sm';
      } else if (change.mqAlias === 'md') {
        this.change = 'md';
      }
      else {
        this.change = 'lg';
      }
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.register(this.form).subscribe(
      data => {
        this.dialogService.openDialogConfirm('สมัครสมาชิกสำเร็จ', '').afterClosed().subscribe(res => {
          this.router.navigate(['/auth/login']);
        })
      },
      err => {
        this.errorMessage = err.error.message;
        this.dialogService.openDialogConfirm('สมัครสมาชิกไม่สำเร็จ', this.errorMessage).afterClosed().subscribe(res => {
        })
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
}
