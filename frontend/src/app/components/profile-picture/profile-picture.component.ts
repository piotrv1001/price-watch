import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ProfilePic, UserService } from "src/app/services/user.service";

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit, OnDestroy {

  profilePic?: string;
  bigLetter?: string;
  subs: Subscription[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getProfilePicture();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private getProfilePicture(): void {
    this.subs.push(
      this.userService.getProfilePicture().subscribe((profilePic: ProfilePic) => {
        this.profilePic = profilePic.profilePic;
        if(!this.profilePic) {
          this.bigLetter = profilePic.email.charAt(0).toUpperCase();
        }
      })
    );
  }
}
