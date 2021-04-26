import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { RoomService } from 'src/app/shared/services/room.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import * as moment from 'moment';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})

export class UserDataComponent implements OnInit {
  user_data: [];
  token: string;
  month = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  displayedColumns: string[] = ['room', 'email', 'fulname', 'tel', 'role', 'bill', 'lease', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    public tokenStorage: TokenStorageService,
    public roomService: RoomService,
    public billService: BillService,
    public leaseService: LeaseService
  ) { }

  ngOnInit(): void {
    this.user_data = []
    this.token = this.tokenStorage.getToken()
    // หาข้อมูลผู้ใช้ทั้งหมด
    this.authService.findAllWithOutUserLogin(this.token).subscribe(response => {

      response.forEach(data => {
        data['dateTranform'] = `${parseInt(moment.utc(data.createdAt).format('DD'))} ${this.month[parseInt(moment.utc(data.createdAt).format('MM')) - 1]} ${parseInt(moment.utc(data.createdAt).format('YYYY')) + 543} เวลา ${moment(data.createdAt).format('HH:mm')}`
      });
      // นำข้อมูลที่ถูกส่งมาจาก api ใส่ไว้ใน this.user_data
      this.user_data = response

      // นำข้อมูลใน this.user_data ไปใส่ใน this.dataSource เพื่อนำไปใช้ใน filter
      this.dataSource = new MatTableDataSource(this.user_data)
      // ทำให้ this.dataSource sort ได้
      this.dataSource.sort = this.sort;
      // ทำให้ this.dataSource แบ่งหน้าได้
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(data) {
    this.dialogService.openDialogEditUser(data, this.token).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  deleteUser(id, lease_status) {
    if (lease_status) {
      if (lease_status === "บันทึกสัญญาเรียบร้อยแล้ว") {
        this.dialogService.openDialogConfirm('ผู้ใช้มีท่านนี้การทำสัญญาแล้ว', 'ยืนยันการลบข้อมูลผู้ใช้ใช่หรือไม่ หากแล้วจะไม่สามารถกู้คืนได้').afterClosed().subscribe(res => {
          if (res === "true") {
            this.roomService.findDataRoomByUserId(this.token, id).subscribe((dataRoom) => {
              let form_Room = {
                room_status: 'ห้องว่าง',
                note: null,
                data_room: null
              }
              this.roomService.updateRoom(this.token, form_Room, dataRoom[0].room_id).subscribe((res) => {
                this.roomService.deleteDataRoom(this.token, dataRoom[0].id).subscribe((res) => {
                  this.leaseService.deleteLease(this.token, dataRoom[0].lease_id).subscribe((res) => {
                    this.authService.deleteUser(id, this.token).subscribe(response => {
                      this.reloadPage()
                    })
                  })
                })
              })
            })
          }
        })
      } else {
        this.dialogService.openDialogConfirm('ผู้ใช้มีท่านนี้มีข้อมูลในห้องพักแล้ว', 'ยืนยันการลบข้อมูลผู้ใช้ใช่หรือไม่ หากแล้วจะไม่สามารถกู้คืนได้').afterClosed().subscribe(res => {
          if (res === "true") {
            this.roomService.findDataRoomByUserId(this.token, id).subscribe((dataRoom) => {
              let form_Room = {
                room_status: 'ห้องว่าง',
                note: null,
                data_room: null
              }
              this.roomService.updateRoom(this.token, form_Room, dataRoom[0].room_id).subscribe((res) => {
                this.roomService.deleteDataRoom(this.token, dataRoom[0].id).subscribe((res) => {
                  this.leaseService.deleteLease(this.token, dataRoom[0].lease_id).subscribe((res) => {
                    this.authService.deleteUser(id, this.token).subscribe(response => {
                      this.reloadPage()
                    })
                  })
                })
              })
            })
          }
        })
      }
    } else {
      this.dialogService.openDialogConfirm('ลบข้อมูล', 'ยืนยันการลบข้อมูลผู้ใช้ใช่หรือไม่ หากลบแล้วจะไม่สามารถกู้คืนได้').afterClosed().subscribe(res => {
        if (res === "true") {
          this.authService.deleteUser(id, this.token).subscribe(response => {
            this.reloadPage()
          })
        }
      })
    }
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }
}
