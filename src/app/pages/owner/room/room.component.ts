import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { RoomService } from 'src/app/shared/services/room.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  show_data: [];
  rooms = [];
  token: string;
  change = 'lg';
  dataSource: MatTableDataSource<any>;
  watcher: Subscription;

  constructor(
    mediaObserver: MediaObserver,
    public dialogService: DialogService,
    private roomService: RoomService,
    private tokenStorage: TokenStorageService,
    private leaseService: LeaseService,
    private billService: BillService,
    private authService: AuthService
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

  ngOnInit() {
    this.token = this.tokenStorage.getToken()
    this.roomService.findAll(this.token).subscribe(response => {
      response.forEach(async element => {
        // push ห้องทั้งหมดเพื่อเอาไปโชวหน้าผังห้อง
        this.rooms.push({
          id: element.id,
          room_number: element.room_number,
          room_status: element.room_status,
          user_id: '',
          name: '',
          surname: '',
          email: '',
          tel: '',
          lease: '',
          status_bill: '',
          note: element.note
        })
      });
      this.rooms.forEach(room => {
        if (room.room_status === "มีผู้เข้าพัก") {
          // slice ข้อมูลห้องเข้าไปในห้องที่มีผู้เข้าพักแล้ว
          this.roomService.findByRoom(this.token, room.room_number).subscribe(response => {
            room['user_id'] = response.id;
            room['name'] = response.name;
            room['surname'] = response.surname;
            room['email'] = response.email;
            room['tel'] = response.tel;
            room['lease_status'] = response.lease_status;
            room['status_bill'] = response.status_bill;
          })
        }
      });
      this.dataSource = new MatTableDataSource(this.rooms)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showData(data) {
    this.show_data = data
  }

  openCreateNewRoomDialog() {
    // เอายัง dialog เพิ่มห้องใหม่
    this.dialogService.openDialogCreateNewRoom(this.token).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  openInsertDataRoomDialog(data) {
    // เอาข้อมูลส่งไปเพิ่ม update ข้อมูลห้อง
    this.dialogService.openDialogInsertDataRoom(this.token, data).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  moveOut(data) {
    // เอาข้อมูลส่งไปเพิ่ม update ข้อมูลห้อง
    this.dialogService.openDialogConfirm('ย้ายออก***', 'หากทำการดำเนินการต่อจะทำให้ ข้อมูลของผู้เข้าพักทั้งหมดที่เกี่ยวกับห้องนี้หายไปด้วย').afterClosed().subscribe(res => {
      if (res === "true") {
        this.roomService.findDataRoomByUserId(this.token, data.user_id).subscribe((dataRoom) => {
          this.authService.updateUser({ room_number: null, lease_status: null }, dataRoom[0].user_id, this.token).subscribe((userUpdate) => {
            this.leaseService.deleteLease(this.token, dataRoom[0].lease_id).subscribe((deleteLease) => {
              this.roomService.deleteDataRoom(this.token, dataRoom[0].id).subscribe((deleteDataRoom) => {
                this.roomService.updateRoom(this.token, { room_status: 'ห้องว่าง', data_room: null }, dataRoom[0].room_id).subscribe((updateRoom) => {
                  this.reloadPage()
                })
              })
            })
          })
        })
      }
    })
  }

  deleteRoom(show_data) {
    if (show_data.room_status === "มีผู้เข้าพัก") {
      this.dialogService.openDialogConfirm(`ลบห้อง ${show_data.room_number}***`, `ยืนยันที่จะลบห้องพักใช่หรือไม่ หากลบแล้วจะทำให้ข้อมูลผู้ใช้ในห้อง ${show_data.room_number} หายไปด้วย?`).afterClosed().subscribe(res => {
        if (res === "true") {
          this.roomService.findDataRoomByUserId(this.token, show_data.user_id).subscribe((dataRoom) => {

            let form_User = {
              room_number: null,
              lease_status: null
            }
            this.roomService.deleteRoom(this.token, show_data.id).subscribe((res) => {
              this.authService.updateUser(form_User, show_data.user_id, this.token).subscribe((res) => {
                this.roomService.deleteDataRoom(this.token, dataRoom[0].id).subscribe((res) => {
                  this.leaseService.deleteLease(this.token, dataRoom[0].lease_id).subscribe((res) => {
                    this.reloadPage()
                  })
                })
              })
            })
          })
        }
      })
    } else {
      this.dialogService.openDialogConfirm(`ลบห้อง ${show_data.room_number}`, 'ยืนยันที่จะลบห้องพักใช่หรือไม่?').afterClosed().subscribe(res => {
        if (res === "true") {
          this.roomService.deleteRoom(this.token, show_data.id).subscribe((res) => {
            this.reloadPage()
          })
        }
      })
    }
  }

  viewImg(room_number) {
    this.leaseService.findDataLeaseByRid(this.token, room_number).subscribe((res) => {
      this.dialogService.openDialogViewImgLease(res[0]).afterClosed().subscribe(res => {
      })
    })
  }

  openDialogShowData(data) {
    this.dialogService.openDialogShowData(this.token, data).afterClosed().subscribe(res => {
    })
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }
}
