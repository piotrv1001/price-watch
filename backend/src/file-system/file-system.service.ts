import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileSystemService {
  createTempFolder(): Promise<void> {
    return new Promise((resolve, reject) => {
      const tempFolder = 'temp';
      fs.mkdir(tempFolder, (err) => {
        if (err) {
          if (err.code === 'EEXIST') {
            resolve();
          } else {
            reject(err);
          }
        } else {
          resolve();
        }
      });
    });
  }

  deleteTempFolder(): Promise<void> {
    return new Promise((resolve, reject) => {
      const folderPath = './temp';
      fs.rm(folderPath, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
