import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Notification, NotificationType } from '@app/models';
import { NotificationService } from '@app/services';

@Component({ selector: 'notification', templateUrl: 'notification.component.html' })
export class NotificationComponent implements OnInit, OnDestroy {
    @Input() id = 'default-notification';
    @Input() fade = true;

    notifications: Notification[] = [];
    notificationSubscription: Subscription;
    routeSubscription: Subscription;

    constructor(private router: Router, private notificationService: NotificationService) { }

    ngOnInit() {
        // subscribe to new notification notifications
        this.notificationSubscription = this.notificationService.onNotification(this.id)
            .subscribe(notification => {
                // clear notifications when an empty notification is received
                if (!notification.message) {
                    // filter out notifications without 'keepAfterRouteChange' flag
                    this.notifications = this.notifications.filter(x => x.keepAfterRouteChange);

                    // remove 'keepAfterRouteChange' flag on the rest
                    this.notifications.forEach(x => delete x.keepAfterRouteChange);
                    return;
                }

                // add notification to array
                this.notifications.push(notification);

                // auto close notification if required
                if (notification.autoClose) {
                    setTimeout(() => this.removeNotification(notification), 3000);
                }
           });

        // clear notifications on location change
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.notificationService.clear(this.id);
            }
        });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.notificationSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    removeNotification(notification: Notification) {
        // check if already removed to prevent error on auto close
        if (!this.notifications.includes(notification)) return;

        if (this.fade) {
            // fade out notification
            notification.fade = true;

            // remove notification after faded out
            setTimeout(() => {
                this.notifications = this.notifications.filter(x => x !== notification);
            }, 250);
        } else {
            // remove notification
            this.notifications = this.notifications.filter(x => x !== notification);
        }
    }

    cssClass(notification: Notification) {
        if (!notification) return;

        const classes = ['notification', 'notification-dismissable', 'mt-4', 'container'];
                
        const notificationTypeClass = {
            [NotificationType.Success]: 'notification notification-success',
            [NotificationType.Error]: 'notification notification-danger',
            [NotificationType.Info]: 'notification notification-info',
            [NotificationType.Warning]: 'notification notification-warning'
        }

        classes.push(notificationTypeClass[notification.type]);

        if (notification.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }
}