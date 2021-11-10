import { Component } from '@angular/core';
import Moralis from 'moralis';
import User = Moralis.User;
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  private name: string;
  private email: string;

  constructor(private router: Router) {}

  onLogin = async (): Promise<void> => {
    await Moralis.Web3.authenticate().then(
      async (user: User) => {
        user.set('name', this.name);
        user.set('email', this.email);
        await user.save();
        this.router.navigate(['/nav/dashboard']).then();
      }
    );
  };

  onChangeName(event) {
    this.name = event.target.value;
    console.log(this.name);
  }

  onChangeEmail(event) {
    this.email = event.target.value;
    console.log(this.email);
  }
}
