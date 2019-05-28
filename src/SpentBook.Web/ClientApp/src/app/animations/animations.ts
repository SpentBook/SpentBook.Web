// Angular
import { trigger, transition, query, style, animate, group, animateChild } from "@angular/animations";

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter,:leave', [
      style({
        position: 'absolute',
        width: '100%',
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('120ms',
          style({
            opacity: 0,
          })
        )
      ], { optional: true }),
      query(':enter', [
        style({
          opacity: 0,
        }),
        animate('1s',
          style({
            opacity: 1
          })
        )
      ], { optional: true }),
    ])
  ])
])