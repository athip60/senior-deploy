import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BlogService } from 'src/app/shared/services/blog.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  progressBar = false;
  form: any = {};
  user_data = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditPostComponent>,
    public dialogService: DialogService,
    public blogService: BlogService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.findGuestAll(this.data.token).subscribe(response => {
      this.user_data = response;
    })

    this.form = this.data.data
  }

  onSubmit() {
    this.dialogService.openDialogConfirm('แก้ไขโพสต์', 'ยืนยันข้อมูลใช่หรือไม่').afterClosed().subscribe(res => {
      if (res === "true") {
        this.progressBar = true;
        this.blogService.updatePost(this.data.token, this.form).subscribe((res) => {
          this.dialogRef.close(true)
        })
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
