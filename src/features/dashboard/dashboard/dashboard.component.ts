import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../sidebar/components/sidebar/sidebar.component';
import { LoginComponent } from '../../auth/components/login/login.component';
import { AuthService } from '../../auth/services/auth/auth.service';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { OrganizationMembersComponent } from '../../organization/components/organization-members/organization-members.component';
import { CloseopenmodelsService } from '../../../shared/services/closeopenmodels/closeopenmodels.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    ButtonModule,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    SearchComponent,
    OrganizationMembersComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isOpenedSidebar = computed(() =>
    this.closeopenmodalService.$isOpened['sidebar'](),
  );
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private closeopenmodalService: CloseopenmodelsService,
  ) {}
  ngOnInit(): void {}
}
