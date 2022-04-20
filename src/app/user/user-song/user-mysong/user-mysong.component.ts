import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Song} from '../../../model/Song';
import {SongService} from '../../../service/song.service';
import {HttpService} from '../../../service/http.service';
import {PlaylistService} from '../../../service/playlist.service';
import {Playlist} from '../../../model/Playlist';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../../model/User';
import {UsersService} from '../../../service/users.service';
import * as moment from 'moment/moment';
import {finalize} from 'rxjs/operators';
import {FileUpload} from "../../../model/file-upload";
import {FileUploadService} from "../../../service/file-upload";
import {AngularFireStorage} from '@angular/fire/storage';
declare var Swal: any;

@Component({
  selector: 'app-user-mysong',
  templateUrl: './user-mysong.component.html',
  styleUrls: ['./user-mysong.component.scss']
})
export class UserMysongComponent implements OnInit {

  @Input() id: string;
  @Input() maxSize: number;
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;
  p: number;
  page: number;
  songList: Song[] = [];
  playlists: Playlist[] = [];
  userid: number;
  user: User;
  song: Song;
  playlistForm: FormGroup;
  avatarPlaylistUrl: string;
  downloadImgURL: any;
  selectImg: string;

  constructor(private songService: SongService,
              private httpService: HttpService,
              private userService: UsersService,
              private playlistService: PlaylistService,
              private form: FormBuilder,
              private uploadService: FileUploadService,
              private storage: AngularFireStorage) {
  }

  ngOnInit(): void {
    this.playlistForm = this.form.group({
      namePlaylist: [''],
      descriptionPlaylist: [''],
    });
    this.userid = Number(this.httpService.getID());
    this.userService.getUserById(String(this.userid)).subscribe(res => {
      this.user = res;
    });
    this.songService.getSongByUser(this.userid).subscribe(res => {
      this.songList = res;
    });
    this.playlistService.getPlaylistByUser(this.userid).subscribe(res => {
      this.playlists = res;
    });
  }

  onDeleteSong(idSong): void {
    if (confirm('Bạn có chắc muốn xóa bài hát?')) {
      this.userid = Number(this.httpService.getID());
      this.songService.deleteSong(idSong).subscribe(res => {
        this.songService.getSongByUser(this.userid).subscribe(data => {
          this.songList = data;
        });
        Swal.fire({
          icon: 'success',
          title: 'Xóa bài hát thành công',
          showConfirmButton: true,
          timer: 3000
        });
      });
    }
  }

  // tslint:disable-next-line:typedef
  createPlaylist() {
    const now = new Date();
    const dateConvert = moment(now).format('yyyy-MM-DD');
    const playlist = {
      namePlaylist: this.playlistForm.value.namePlaylist,
      user: this.user,
      avatarPlaylistUrl: this.avatarPlaylistUrl,
      descriptionPlaylist: this.playlistForm.value.descriptionPlaylist,
      dateCreatePlaylist: dateConvert,
      numberOfViewPlaylist: 0,
      lastModifierPlaylist: dateConvert,
    };
    console.log(playlist);
    this.playlistService.createPlaylist(this.user.id, playlist).subscribe(res => {
      this.playlistService.getPlaylistByUser(this.userid).subscribe(data => {
        this.playlists = data;
      });
      Swal.fire({
        icon: 'success',
        title: 'Tạo playlist thành công',
        showConfirmButton: true,
        timer: 3000
      });
      this.playlistForm.reset();
    });
  }

  submitAvatar() {
    var n = Date.now();
    // @ts-ignore
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadImgURL = fileRef.getDownloadURL();
        this.downloadImgURL.subscribe(url => {
          if (url) {
            this.avatarPlaylistUrl = url;
          }
          console.log(this.avatarPlaylistUrl + 'success');
        });
      })
    )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  // tslint:disable-next-line:typedef
  showPreAvatar(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectImg = event.target.files[0];
      this.submitAvatar();
    } else {
      this.selectImg = null;
    }
  }

  onDeletePlaylist(idPlaylist): void {
    if (confirm('Bạn có chắc muốn xóa playlist?')) {
      this.userid = Number(this.httpService.getID());
      this.playlistService.deletePlaylist(idPlaylist).subscribe(res => {
        this.playlistService.getPlaylistByUser(this.userid).subscribe(data => {
          this.playlists = data;
        });
        Swal.fire({
          icon: 'success',
          title: 'Xóa playlist thành công',
          showConfirmButton: true,
          timer: 3000
        });
      });
    }
  }
}
