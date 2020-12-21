import { Injectable } from '@angular/core';
import {  AngularFireStorage, AngularFireUploadTask  } from '@angular/fire/storage'
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FireDBService} from './fire-db.service';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

    path = '';
    task: AngularFireUploadTask | undefined ;
    uploadProgress = new Observable();
    downloadURL = of('');

  constructor(public firestorage: AngularFireStorage,
              public auth: AuthService,
              private db: FireDBService  ) { }

  uploadFile(event: any) {
    console.log('event: ', event);

    let ext = '.jpg';
    if (event.target.files[0].type === 'image/png'){
      ext = '.png';
    }
   
    const path = this.path + this.auth.authUser.uid  + ext;
    const ref = this.firestorage.ref(path);

    this.task = this.firestorage.upload(  path, event.target.files[0]);
    
    this.uploadProgress = this.task.percentageChanges();

    this.task.snapshotChanges().pipe( finalize ( ()=> {
      this.downloadURL = ref.getDownloadURL();
      this.db.updateUserImageURL();
      console.log('this.downloadURL: ', this.downloadURL);
    })).subscribe();
   
  }

}
