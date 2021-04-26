import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BlogService } from 'src/app/shared/services/blog.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent implements OnInit {
  comment_data = []
  form: any = {};
  constructor(@
    Inject(MAT_DIALOG_DATA) public data,
    public tokenStorage: TokenStorageService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ViewCommentComponent>,
    public dialogService: DialogService,
    public blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.blogService.viewComment(this.data.token, this.data.id).subscribe(response => {
      this.comment_data = response
      for (let index = 0; index < this.comment_data.length; index++) {
        this.authService.findById(this.comment_data[index].user_comment, this.data.token).subscribe(response => {
          if (response) {
            this.comment_data[index]['username'] = response.name + ' ' + response.surname
          }
          else {
            this.comment_data[index]['username'] = 'ผู้ใช้งาน'
          }
        })
      }
    })

  }

  onSubmit() {
    const user = this.tokenStorage.getUser();
    this.form['user_comment'] = parseInt(user.id)
    this.form['post_id'] = parseInt(this.data.id)
    this.blogService.createComment(this.data.token, this.form).subscribe(response => {
      this.reloadPage()
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }

  updateComment(data) {
    this.dialogService.openDialogEditComment(this.data.token, data).afterClosed().subscribe(res => { 
    })
  }

  delete(id) {
    this.dialogService.openDialogConfirm('ลบคอมเม้นต์', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
      if (res === "true") {
        this.blogService.deleteComment(this.data.token, id).subscribe(response => {
          if (response.status === true) {
            this.reloadPage()
          }
        })
      }
    })
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }
}
