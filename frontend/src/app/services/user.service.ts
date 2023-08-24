import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient } from "@angular/common/http";

export interface ProfilePic { profilePic?: string, email: string }

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userResourceUrl = `${SERVER_API_URL}/users`;
  private profilePictureResourceUrl = `${this.userResourceUrl}/profile-picture`;

  constructor(private http: HttpClient) {}

  getProfilePicture(): Observable<ProfilePic> {
    return this.http.get<ProfilePic>(this.profilePictureResourceUrl);
  }
}
