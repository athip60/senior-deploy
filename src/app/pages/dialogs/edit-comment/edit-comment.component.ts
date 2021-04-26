import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlogService } from 'src/app/shared/services/blog.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {
  progressBar = false;
  form: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditCommentComponent>,
    public dialogService: DialogService,
    public blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.form = this.data.data
  }

  onSubmit() {
    this.dialogService.openDialogConfirm('แก้ไขคอมเม้นต์', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
      this.progressBar = true;
      if (res === "true") {
        this.blogService.updateComment(this.data.token, this.form).subscribe(response => {
          this.dialogRef.close(true)
        })
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
