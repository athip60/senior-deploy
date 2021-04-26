import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BillService } from 'src/app/shared/services/bill.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.scss']
})
export class EditBillComponent implements OnInit {
  progressBar = false;
  form: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditBillComponent>,
    public dialogService: DialogService,
    public billService: BillService
  ) { }

  ngOnInit(): void {
    this.form.user_issur_id = this.data.data.user_issur
    this.form.user_in_room = this.data.data.user_in_room
    this.form.fullname_user_in_room = this.data.data.fullname_user_in_room
    this.form.data_room_id = this.data.data.data_room_id
    this.form.room_number = this.data.data.room_number
    this.form.room_cost = this.data.data.room_cost
    this.form.furniture_cost = this.data.data.furniture_cost
    this.form.internet_cost = this.data.data.internet_cost
    this.form.water_cost = this.data.data.water_cost
    this.form.unit_in_month = this.data.data.unit_in_month
    this.form.unit_per_month = this.data.data.unit_per_month
  }

  onSubmit() {
    this.form['total_unit'] = (this.data.data.total_unit - this.data.data.unit_in_month) + this.form.unit_in_month
    this.form['total_cost'] = (this.form.unit_per_month * this.form.unit_in_month) + this.form.room_cost + this.form.furniture_cost + this.form.internet_cost + this.form.water_cost
    this.billService.updateBill(this.data.data.id, this.form, this.data.token).subscribe((dataRoom) => {
      if (dataRoom.status === true) {
        this.dialogRef.close(true)
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
