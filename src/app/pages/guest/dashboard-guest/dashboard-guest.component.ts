import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { BlogService } from 'src/app/shared/services/blog.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-dashboard-guest',
  templateUrl: './dashboard-guest.component.html',
  styleUrls: ['./dashboard-guest.component.scss']
})
export class DashboardGuestComponent implements OnInit {
  form: any = {};
  post_data = []
  userLogin: number
  totalCost = 0;
  overdue = 0;
  token: string;
  constructor(
    public tokenStorage: TokenStorageService,
    private authService: AuthService,
    private billService: BillService,
    public dialogService: DialogService,
    public blogService: BlogService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.tokenStorage.getToken()
    const user = this.tokenStorage.getUser();
    this.userLogin = parseInt(user.id)
    this.blogService.findAllForGuest(this.token, parseInt(user.id)).subscribe(response => {
      this.post_data = response
      for (let index = 0; index < this.post_data.length; index++) {
        this.authService.findById(this.post_data[index].user_post, this.token).subscribe(response => {
          this.post_data[index]['name_user_post'] = response.name + ' ' + response.surname
        })
        if (this.post_data[index].send_from) {
          this.authService.findById(this.post_data[index].send_from, this.token).subscribe(response => {
            if (response) {
              this.post_data[index]['name_user_send_from'] = response.name + ' ' + response.surname
            }
            else {
              this.post_data[index]['name_user_send_from'] = 'ผู้ใช้งาน'
            }
          })
        }
        else {
          this.post_data[index]['name_user_send_from'] = 'ทั้งหมด'
        }
      }
    });
    this.billService.findGuest(user.id, this.token).subscribe(dataBills => {
      console.log(dataBills);
      
      dataBills.forEach(data => {
        if (data.bill_status === "ชำระเงินเรียบร้อย") {
          this.totalCost += data.total_cost

        } if (data.bill_status !== "ชำระเงินเรียบร้อย") {
          this.overdue += data.total_cost
        }
      });
    })
  }
  onSubmit() {
    this.dialogService.openDialogConfirm('ยืนยันโพสต์', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
      if (res === "true") {
        const user = this.tokenStorage.getUser();
        this.form['user_post'] = parseInt(user.id)
        if (this.form.send_from) {
          this.form.send_from = parseInt(this.form.send_from)
        }
        console.log(this.form);

        this.blogService.createPost(this.token, this.form).subscribe(response => {
          this.reloadPage()
        })
      }
    })
  }

  viewComment(id) {
    this.dialogService.openDialogViewComment(this.token, id, this.userLogin).afterClosed().subscribe(res => { })
  }

  updatePost(data) {
    this.dialogService.openDialogEditPost(this.token, data).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  delete(id) {
    this.dialogService.openDialogConfirm('ยืนยันโพสต์', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
      if (res === "true") {
        this.blogService.deletePost(this.token, id).subscribe(deletePost => {
          this.blogService.deleteCommentAll(this.token, id).subscribe(deleteComment => {
            if (deleteComment.status === true) {
              this.reloadPage()
            }
          })
        })
      }
    })
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }

  routerTo(path) {
    this.router.navigate([`/guest/${path}`]);
  }
}
