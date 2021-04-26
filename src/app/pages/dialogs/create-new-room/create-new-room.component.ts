import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { RoomService } from 'src/app/shared/services/room.service';

@Component({
  selector: 'app-create-new-room',
  templateUrl: './create-new-room.component.html',
  styleUrls: ['./create-new-room.component.scss']
})
export class CreateNewRoomComponent implements OnInit {
  progressBar = false;
  form: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CreateNewRoomComponent>,
    public dialogService: DialogService,
    private roomService: RoomService,
  ) { }

  ngOnInit(): void {
    this.form = {
      room_number: 0,
      room_status: 'ห้องว่าง'
    }
  }

  onSubmit(): void {
    this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
      if (res === "true") {
        this.progressBar = true;
        this.roomService.createRoom(this.data.token, this.form).subscribe(res => {
          if (res.message === `เพิ่มห้อง ${this.form.room_number} สำเร็จ`) {
            this.dialogRef.close(true)
          } else {
            this.dialogService.openDialogConfirm('แก้ไขข้อมูลไม่สำเร็จ', res.message).afterClosed().subscribe(res => {
              this.progressBar = false;
            })
          }
        })
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
