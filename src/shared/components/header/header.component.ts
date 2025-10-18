import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CreateOrganizationComponent } from '../../../features/organization/components/create-organization/create-organization.component';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive,CreateOrganizationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
