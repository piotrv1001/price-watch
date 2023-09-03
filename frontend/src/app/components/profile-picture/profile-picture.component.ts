import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ProfilePic, UserService } from "src/app/services/user.service";

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit, OnDestroy {

  @Input() picSize = 42;
  @Input() fontSize = 24;
  @Input() hover = true;
  @Input() loadPic = true;
  @Input() profilePic?: string;
  @Input() bigLetter?: string;
  subs: Subscription[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if(this.loadPic) {
      this.getProfilePicture();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private getProfilePicture(): void {
    this.subs.push(
      this.userService.getProfilePicture().subscribe((profilePic: ProfilePic) => {
        this.profilePic = profilePic.profilePic;
        const displayName = profilePic.displayName;
        if(!this.profilePic) {
          if(displayName) {
            this.bigLetter = displayName.charAt(0).toUpperCase();
          } else {
            this.bigLetter = profilePic.email.charAt(0).toUpperCase();
          }
        }
      })
    );
  }
}
