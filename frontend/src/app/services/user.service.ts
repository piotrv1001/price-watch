import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient } from "@angular/common/http";
import { User } from '../models/user/user';
import { ProductWithPrice } from '../models/product/product-with-price';

export interface ProfilePic { profilePic?: string, email: string, displayName?: string }
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

  getFavoriteProducts(): Observable<ProductWithPrice[]> {
    return this.http.get<ProductWithPrice[]>(`${this.userResourceUrl}/favorite-products`);
  }

  addNewFavoriteProduct(productId: string): Observable<ProductWithPrice[]> {
    return this.http.post<ProductWithPrice[]>(`${this.userResourceUrl}/favorite-products/${productId}`, null);
  }

  deleteFavoriteProduct(productId: string): Observable<ProductWithPrice[]> {
    return this.http.delete<ProductWithPrice[]>(`${this.userResourceUrl}/favorite-products/${productId}`);
  }
}
