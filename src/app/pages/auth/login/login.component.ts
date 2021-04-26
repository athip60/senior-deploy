import { Component, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {};
  errorMessage = '';
  roles: string[] = [];
  hide = true;
  change = 'lg';
  watcher: Subscription;

  constructor(
    public authService: AuthService,
    private tokenStorage: TokenStorageService,
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
    this.authService.login(this.form).subscribe(
      data => {
        if (data.roles[0] === 'ROLE_USER') {
          this.dialogService.openDialogConfirm('เข้าสู่ระบบ', 'ไม่สามารถเข้าใช้ระบบได้กรุณาติดต่อเจ้าของหอพัก').afterClosed().subscribe((res) => { })
        } else {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.roles = this.tokenStorage.getUser().roles;
          if (this.roles[0] === "ROLE_OWNER") {
            this.router.navigate(['/owner']);
          }
          else if (this.roles[0] === "ROLE_GUEST") {
            this.router.navigate(['/guest']);
          }
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.dialogService.openDialogConfirm('เข้าสู่ระบบไม่สำเร็จ', this.errorMessage).afterClosed().subscribe(res => {
        })
      }
    );
  }
}
