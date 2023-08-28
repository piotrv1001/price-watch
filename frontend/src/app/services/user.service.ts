import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient } from "@angular/common/http";
import { User } from '../models/user/user';

export interface ProfilePic { profilePic?: string, email: string }
export interface UserId { id: number }

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userResourceUrl = `${SERVER_API_URL}/users`;
  private profileResourceUrl = `${this.userResourceUrl}/profile`;
  private profilePictureResourceUrl = `${this.userResourceUrl}/profile-picture`;

  constructor(private http: HttpClient) {}

  getId(): Observable<UserId> {
    return this.http.get<UserId>(`${this.userResourceUrl}/id`);
  }

  getProfile(): Observable<User> {
    return this.http.get<any>(this.profileResourceUrl);
  }

  getProfilePicture(): Observable<ProfilePic> {
    return this.http.get<ProfilePic>(this.profilePictureResourceUrl);
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(this.profileResourceUrl, user);
  }
}
